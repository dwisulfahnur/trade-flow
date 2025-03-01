"use client";

import { useState } from "react";
import { Box, Button, Card, Flex, Text, Table, Badge, Icon, Center, Spinner } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FiMoreVertical, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiCopy } from "react-icons/fi";
import { Tooltip } from "@/components/ui/tooltip";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { useSession } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiKeyFormDialog from "./ApiKeyFormDialog";
import createClerkSupabaseClient from "@/lib/supabase";
import ApiKeysService from "../../services/supabase/apiKeys";
import { Database } from "@/types/database.types";


export default function ApiKeySettings() {
  const { session } = useSession();
  const apiKeysService = new ApiKeysService(session);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingKey, setEditingKey] = useState<
    Database['public']['Tables']['api_keys']['Row'] | null
  >(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [showSecretKey, setShowSecretKey] = useState<Record<string, boolean>>({});
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: apiKeysService.getApiKeys,
  });

  const { mutate: deleteApiKey, isPending: isDeletingApiKey } = useMutation({
    mutationFn: apiKeysService.deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setKeyToDelete(null);
      setDeleteConfirmOpen(false);
    },
  });

  const handleDeleteKey = () => {
    if (!keyToDelete) return;
    deleteApiKey(keyToDelete);
  };

  const openEditDialog = (key: Database['public']['Tables']['api_keys']['Row']) => {
    setEditingKey(key);
    setOpenDialog(true);
  };

  const confirmDelete = (id: string) => {
    setKeyToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const toggleSecretVisibility = (id: string) => {
    setShowSecretKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getExchangeLabel = (exchange: string) => {
    const exchanges: Record<string, string> = {
      'binance': 'Binance',
      'bybit': 'Bybit',
      'okx': 'OKX'
    };
    return exchanges[exchange] || exchange;
  };

  // Mask API key for display - show only first 4 and last 4 characters
  const maskApiKey = (key: string) => {
    if (key.length <= 10) return '••••••••••';
    return key.substring(0, 5) + '•••••' + key.substring(key.length - 5);
  };

  // Mask secret key for display
  const maskSecretKey = (key: string, id: string) => {
    if (showSecretKey[id]) {
      // When visible, show only first 10 characters
      return key.substring(0, 10) + '...';
    }
    return '••••••••••';
  };

  return (
    <>
      <ApiKeyFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingKey(null);
        }}
        initialData={editingKey || undefined}
      />
      <DialogRoot
        open={deleteConfirmOpen}
        onOpenChange={() => setDeleteConfirmOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button colorPalette="red" ml={3} onClick={handleDeleteKey} loading={isDeletingApiKey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontWeight={500} fontSize="lg">API Keys</Text>
        <Button
          size="xs"
          colorPalette="blue"
          variant="surface"
          onClick={() => setOpenDialog(true)}
        >
          Add API Key
        </Button>
      </Flex>
      {isLoading ? (
        <Center h="200px" w="full">
          <Spinner />
        </Center>
      ) : apiKeys?.length === 0 ? (
        <Box p={6} textAlign="center">
          <Text color="gray.500">No API keys added yet</Text>
          <Button
            mt={4}
            size="sm"
            colorPalette="blue"
            variant="surface"
            onClick={() => setOpenDialog(true)}
          >
            Add your first API key
          </Button>
        </Box>
      ) : (
        <Table.Root size="sm" fontSize="xs" overflowX="auto">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontSize="xs">Exchange</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="xs">API Key</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="xs">Secret Key</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="xs">Created</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="xs"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {apiKeys?.map((key) => (
              <Table.Row key={key.id}>
                <Table.Cell>
                  <Badge variant="subtle" colorPalette="blue" fontSize="2xs">
                    {getExchangeLabel(key.exchange)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex alignItems="center" gap={1}>
                    <Tooltip content={copySuccess === 'API Key' ? 'Copied!' : 'Click to copy'}>
                      <Text
                        fontFamily="mono"
                        fontSize="xs"
                        cursor="pointer"
                        onClick={() => copyToClipboard(key.api_key, 'API Key')}
                      >
                        {maskApiKey(key.api_key)}
                      </Text>
                    </Tooltip>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex alignItems="center" gap={1}>
                    <Tooltip content={copySuccess === 'Secret Key' ? 'Copied!' : 'Click to copy'}>
                      <Text
                        fontFamily="mono"
                        fontSize="xs"
                        cursor="pointer"
                        onClick={() => copyToClipboard(key.api_secret, 'Secret Key')}
                      >
                        {maskSecretKey(key.api_secret, key.id)}
                      </Text>
                    </Tooltip>
                    <Button
                      size="xs"
                      variant="ghost"
                      p={1}
                      minW="auto"
                      h="auto"
                      onClick={() => toggleSecretVisibility(key.id)}
                    >
                      <Icon as={showSecretKey[key.id] ? FiEyeOff : FiEye} boxSize={3} />
                    </Button>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="xs">{formatDate(key.created_at)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <MenuRoot positioning={{ placement: 'left-start' }} size="sm">
                    <MenuTrigger asChild>
                      <Button size="xs" variant="ghost" p={1} minW="auto" h="auto">
                        <Icon as={FiMoreVertical} boxSize={3} />
                      </Button>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem onClick={() => openEditDialog(key)} value="edit">
                        <Icon as={FiEdit2} mr={2} boxSize={3} />
                        <Text fontSize="xs">Edit</Text>
                      </MenuItem>
                      <MenuItem onClick={() => confirmDelete(key.id)} value="delete" colorPalette="red">
                        <Icon as={FiTrash2} mr={2} boxSize={3} />
                        <Text fontSize="xs">Delete</Text>
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
}

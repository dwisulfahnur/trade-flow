"use client";

import {
  Button,
  Input,
  Text,
  VStack,
  Select,
  HStack,
  NativeSelect,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  SelectRoot,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toaster } from "../ui/toaster";
import ApiKeysService from "@/services/supabase/apiKeys";
import TradeSyncService from "@/services/supabase/tradeSyncService";

interface TradeSyncDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function TradeSyncDialog({ open, onClose }: TradeSyncDialogProps) {
  const { session } = useSession();
  const apiKeysService = new ApiKeysService(session);
  const tradeSyncService = new TradeSyncService(session);
  const queryClient = useQueryClient();

  const [selectedApiKey, setSelectedApiKey] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [syncAll, setSyncAll] = useState<boolean>(true);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  // Fetch API keys
  const { data: apiKeys, isLoading: isLoadingApiKeys } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: apiKeysService.getApiKeys,
  });

  // Fetch latest sync status
  const { data: latestSync } = useQuery({
    queryKey: ['latestSync'],
    queryFn: tradeSyncService.getLatestSyncStatus,
    // refetchInterval: (data) => {
    //   // Refetch every 5 seconds if sync is in progress
    //   return data?.status === 'in_progress' ? 5000 : false;
    // },
  });

  const { mutate: syncTrades, isPending: isSyncing } = useMutation({
    mutationFn: tradeSyncService.syncTradesFromExchange,
    onSuccess: (result) => {
      if (result.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: ['trades'] });
        queryClient.invalidateQueries({ queryKey: ['latestSync'] });
        toaster.create({
          title: 'Trades synchronized',
          description: `Successfully imported ${result.tradesImported} trades`,
          type: 'success',
        });
        onClose();
      } else {
        toaster.create({
          title: 'Sync failed',
          description: result.errorMessage || 'Unknown error occurred',
          type: 'error',
        });
      }
    },
    onError: (error) => {
      console.error(error);
      toaster.create({
        title: 'Sync failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error',
      });
    }
  });

  const handleSubmit = () => {
    if (!selectedApiKey) {
      toaster.create({
        title: 'API Key required',
        description: 'Please select an API key to sync trades',
        type: 'error',
      });
      return;
    }

    syncTrades({
      apiKeyId: selectedApiKey,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      symbols: syncAll ? undefined : selectedSymbols,
    });
  };

  const handleClose = () => {
    setSelectedApiKey("");
    setStartDate("");
    setEndDate("");
    setSyncAll(true);
    setSelectedSymbols([]);
    onClose();
  };

  return (
    <>
      <DialogRoot open={open} onOpenChange={(details) => details.open === false && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync Trades from Exchange</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack spaceY={4} align="stretch">
              {latestSync?.status === 'in_progress' && (
                <Alert.Root status="info">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Sync in progress</Alert.Title>
                    <Alert.Description>
                      A sync operation is currently running. Please wait for it to complete.
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              {isLoadingApiKeys ? (
                <HStack justify="center" py={4}>
                  <Spinner />
                  <Text>Loading API keys...</Text>
                </HStack>
              ) : apiKeys && apiKeys.length > 0 ? (
                <Field label="Select Exchange API Key">
                  <NativeSelect.Root disabled={isSyncing || latestSync?.status === 'in_progress'}>
                    <NativeSelect.Field
                      value={selectedApiKey}
                      onChange={(e) => setSelectedApiKey(e.target.value)}
                      placeholder="Select an API key"
                    >
                      {apiKeys.map((key) => (
                        <option key={key.id} value={key.id}>
                          {key.exchange}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Field>
              ) : (
                <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>No API Keys Found</Alert.Title>
                    <AlertDescription>
                      You need to add an exchange API key before you can sync trades.
                    </AlertDescription>
                    <Button
                      size="sm"
                      mt={2}
                      onClick={() => {
                        handleClose();
                        // Navigate to API keys page or open API key dialog
                      }}
                    >
                      Add API Key
                    </Button>
                  </Alert.Content>
                </Alert.Root>
              )}

              <Field label="Date Range (Optional)">
                <HStack>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                    disabled={isSyncing || latestSync?.status === 'in_progress'}
                  />
                  <Text>to</Text>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                    disabled={isSyncing || latestSync?.status === 'in_progress'}
                  />
                </HStack>
              </Field>

              <Field label="Symbols">
                <Checkbox
                  checked={syncAll}
                  onCheckedChange={(e) => setSyncAll(!!e.checked)}
                  disabled={isSyncing || latestSync?.status === 'in_progress'}
                >
                  Sync all trading pairs
                </Checkbox>
              </Field>

              {!syncAll && (
                <Field label="Select Specific Symbols">
                  <NativeSelect.Root disabled={isSyncing || latestSync?.status === 'in_progress'}>
                    <NativeSelect.Field
                      placeholder="Add symbols (e.g., BTC/USDT)"
                      onChange={(e) => {
                        if (e.target.value && !selectedSymbols.includes(e.target.value)) {
                          setSelectedSymbols([...selectedSymbols, e.target.value]);
                        }
                      }}
                    >
                      <option value="BTC/USDT">BTC/USDT</option>
                      <option value="ETH/USDT">ETH/USDT</option>
                      <option value="SOL/USDT">SOL/USDT</option>
                      {/* Add more common trading pairs */}
                    </NativeSelect.Field>
                  </NativeSelect.Root>

                  {selectedSymbols.length > 0 && (
                    <HStack mt={2} flexWrap="wrap" gap={2}>
                      {selectedSymbols.map((symbol) => (
                        <Button
                          key={symbol}
                          size="xs"
                          variant="outline"
                          onClick={() => setSelectedSymbols(selectedSymbols.filter(s => s !== symbol))}
                          disabled={isSyncing || latestSync?.status === 'in_progress'}
                        >
                          {symbol}
                          <span>×</span>
                        </Button>
                      ))}
                    </HStack>
                  )}
                </Field>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogActionTrigger>
            <Button
              colorPalette="blue"
              size="sm"
              onClick={handleSubmit}
              loading={isSyncing || latestSync?.status === 'in_progress'}
              disabled={!selectedApiKey || latestSync?.status === 'in_progress'}
            >
              {isSyncing || latestSync?.status === 'in_progress' ? 'Syncing...' : 'Sync Trades'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <Toaster />
    </>
  );
} 
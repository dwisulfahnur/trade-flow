"use client";

import { Card, Flex, Text, Button, Table, Icon, FormatNumber, Skeleton, Box } from "@chakra-ui/react";
import { FiArrowDown, FiArrowUp, FiExternalLink } from "react-icons/fi";
import { Trade } from "@/services/supabase/userTrades";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import UserTradesService from "@/services/supabase/userTrades";
import { useSession } from "@clerk/nextjs";

export default function LatestTradesCard() {
  const { session } = useSession();
  const tradesService = new UserTradesService(session);

  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => tradesService.getTrades({ limit: 5 }),
  });

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card.Root _hover={{ boxShadow: 'md' }}>
      <Card.Header px={2}>
        <Flex justifyContent={'space-between'}>
          <Text fontWeight={500} fontSize={'lg'}>Latest Trades</Text>
          <Button size="xs" variant="ghost" alignItems="center" gap={2} asChild>
            <NextLink href="/dashboard/trade-journal">
              <Icon as={FiExternalLink} />
              View All
            </NextLink>
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body p={0}>
        {isLoading ? (
          <Box p={4}>
            <Skeleton height="20px" mb={4} />
            <Skeleton height="20px" mb={4} />
            <Skeleton height="20px" mb={4} />
            <Skeleton height="20px" mb={4} />
            <Skeleton height="20px" />
          </Box>
        ) : trades && trades.length === 0 ? (
          <Flex p={4} justifyContent="center" alignItems="center" height="200px">
            <Text color="gray.500">No trades recorded yet</Text>
          </Flex>
        ) : (
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Symbol</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>PnL</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {trades?.map((trade) => (
                <Table.Row key={trade.id}>
                  <Table.Cell>
                    <Text fontWeight="medium">{trade.symbol}</Text>
                    <Text fontSize="xs" color="gray.500">{formatDate(trade.date)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex alignItems="center" gap={1}>
                      <Icon
                        as={trade.type === 'buy' ? FiArrowUp : FiArrowDown}
                        color={trade.type === 'buy' ? 'green.500' : 'red.500'}
                      />
                      <Text>{trade.type.toUpperCase()}</Text>
                    </Flex>
                    <Text fontSize="xs" color="gray.500">
                      {trade.amount} @ <FormatNumber value={trade.entry_price || 0} maximumFractionDigits={2} />
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      fontWeight="medium"
                      color={trade.pnl >= 0 ? 'green.500' : 'red.500'}
                    >
                      {trade.pnl >= 0 ? '+' : ''}<FormatNumber value={trade.pnl} maximumFractionDigits={2} />
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card.Body>
    </Card.Root>
  );
} 
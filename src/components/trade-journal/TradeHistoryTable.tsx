"use client";

import { Card, Flex, Text, Button, Icon, Table, Badge, Tabs } from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { FormatNumber } from "@chakra-ui/react";

interface Trade {
  id: number;
  date: string;
  symbol: string;
  type: string;
  amount: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  notes: string;
}

interface TradeHistoryTableProps {
  trades: Trade[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight={500} fontSize="lg">Trade History</Text>
          <Button size="sm" variant="ghost" alignItems={'center'} gap={2}>
            <Icon as={FiFilter} />
            <Text>Filter</Text>
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body p={0}>
        <Tabs.Root defaultValue="all">
          <Tabs.List px={4}>
            <Tabs.Trigger value="all">All Trades</Tabs.Trigger>
            <Tabs.Trigger value="winning">Winning Trades</Tabs.Trigger>
            <Tabs.Trigger value="losing">Losing Trades</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="all" p={0}>
            <TradeTable trades={trades} />
          </Tabs.Content>
          <Tabs.Content value="winning" p={0}>
            <TradeTable trades={trades.filter(trade => trade.pnl > 0)} />
          </Tabs.Content>
          <Tabs.Content value="losing" p={0}>
            <TradeTable trades={trades.filter(trade => trade.pnl < 0)} />
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>
    </Card.Root>
  );
}

function TradeTable({ trades }: { trades: Trade[] }) {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Date</Table.ColumnHeader>
          <Table.ColumnHeader>Symbol</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Entry/Exit</Table.ColumnHeader>
          <Table.ColumnHeader>P&L</Table.ColumnHeader>
          <Table.ColumnHeader>Notes</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {trades.map((trade) => (
          <Table.Row key={trade.id}>
            <Table.Cell>{trade.date}</Table.Cell>
            <Table.Cell>
              <Text fontWeight="medium">{trade.symbol}</Text>
            </Table.Cell>
            <Table.Cell>
              <Flex alignItems="center" gap={1}>
                <Icon
                  as={trade.type === 'buy' ? FiArrowUp : FiArrowDown}
                  color={trade.type === 'buy' ? 'green.500' : 'red.500'}
                />
                <Badge colorPalette={trade.type === 'buy' ? 'green' : 'red'}>
                  {trade.type.toUpperCase()}
                </Badge>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Text fontSize="sm">
                Entry: <FormatNumber value={trade.entryPrice} maximumFractionDigits={2} />
              </Text>
              <Text fontSize="sm">
                Exit: <FormatNumber value={trade.exitPrice} maximumFractionDigits={2} />
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
            <Table.Cell maxW="300px">
              <Text truncate fontSize="sm">{trade.notes}</Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
} 
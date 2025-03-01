"use client";

import { Card, Flex, Text, Button, Table, Icon, FormatNumber } from "@chakra-ui/react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

interface Trade {
  id: number;
  symbol: string;
  type: string;
  amount: number;
  price: number;
  pnl: number;
  date: string;
}

interface LatestTradesCardProps {
  trades: Trade[];
}

export default function LatestTradesCard({ trades }: LatestTradesCardProps) {
  return (
    <Card.Root _hover={{ boxShadow: 'md' }}>
      <Card.Header px={2}>
        <Flex justifyContent={'space-between'}>
          <Text fontWeight={500} fontSize={'lg'}>Latest Trades</Text>
          <Button size="xs" variant="ghost">View All</Button>
        </Flex>
      </Card.Header>
      <Card.Body p={0}>
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Symbol</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader>PnL</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {trades.map((trade) => (
              <Table.Row key={trade.id}>
                <Table.Cell>
                  <Text fontWeight="medium">{trade.symbol}</Text>
                  <Text fontSize="xs" color="gray.500">{trade.date}</Text>
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
                    {trade.amount} @ <FormatNumber value={trade.price} maximumFractionDigits={2} />
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
      </Card.Body>
    </Card.Root>
  );
} 
"use client";

import { Card, Flex, Text, Button, Icon, Table, Badge, Box, useBreakpointValue } from "@chakra-ui/react";
import { FiFilter, FiArrowUp, FiArrowDown, FiInfo } from "react-icons/fi";
import { FormatNumber } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

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
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Define theme colors
  const colors = {
    cardBg: useColorModeValue("white", "gray.800"),
    borderColor: useColorModeValue("gray.200", "gray.700"),
    primaryText: useColorModeValue("gray.800", "white"),
    secondaryText: useColorModeValue("gray.500", "gray.400"),
    profitText: useColorModeValue("green.500", "green.300"),
    lossText: useColorModeValue("red.500", "red.300"),
  };

  // Render mobile card view for each trade
  const renderMobileTradeCard = (trade: Trade) => (
    <Card.Root key={trade.id} mb={3} borderColor={colors.borderColor}>
      <Card.Body p={3}>
        <Flex justifyContent="space-between" mb={2}>
          <Text fontWeight="medium">{trade.symbol}</Text>
          <Text
            fontWeight="bold"
            color={trade.pnl >= 0 ? colors.profitText : colors.lossText}
          >
            {trade.pnl >= 0 ? '+' : ''}<FormatNumber value={trade.pnl} maximumFractionDigits={2} />
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb={2}>
          <Text fontSize="sm" color={colors.secondaryText}>{trade.date}</Text>
          <Flex alignItems="center" gap={1}>
            <Icon
              as={trade.type === 'buy' ? FiArrowUp : FiArrowDown}
              color={trade.type === 'buy' ? 'green.500' : 'red.500'}
            />
            <Badge colorPalette={trade.type === 'buy' ? 'green' : 'red'}>
              {trade.type.toUpperCase()}
            </Badge>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" mb={2}>
          <Text fontSize="sm">
            Entry: <FormatNumber value={trade.entryPrice} maximumFractionDigits={2} />
          </Text>
          <Text fontSize="sm">
            Exit: <FormatNumber value={trade.exitPrice} maximumFractionDigits={2} />
          </Text>
        </Flex>

        {trade.notes && (
          <Box mt={2} pt={2} borderTopWidth="1px" borderColor={colors.borderColor}>
            <Text fontSize="xs" color={colors.secondaryText} fontWeight="medium">Notes:</Text>
            <Text fontSize="sm">{trade.notes}</Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );

  return (
    <Card.Root bg={colors.cardBg} borderColor={colors.borderColor}>
      <Card.Header>
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Text fontWeight={500} fontSize="lg" color={colors.primaryText}>Trade History</Text>
          <Button size="sm" variant="ghost" alignItems={'center'} gap={2}>
            <Icon as={FiFilter} />
            <Text>Filter</Text>
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body p={0} pt={4}>
        {isMobile ? (
          // Mobile view - cards
          <Box px={4} pb={4}>
            {trades.length === 0 ? (
              <Flex direction="column" alignItems="center" justifyContent="center" py={8}>
                <Icon as={FiInfo} fontSize="3xl" color={colors.secondaryText} mb={2} />
                <Text color={colors.secondaryText}>No trades found</Text>
              </Flex>
            ) : (
              trades.map(renderMobileTradeCard)
            )}
          </Box>
        ) : (
          // Desktop view - table
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Symbol</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Price</Table.ColumnHeader>
                  <Table.ColumnHeader>P&L</Table.ColumnHeader>
                  <Table.ColumnHeader>Notes</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {trades.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6}>
                      <Flex direction="column" alignItems="center" justifyContent="center" py={8}>
                        <Icon as={FiInfo} fontSize="3xl" color={colors.secondaryText} mb={2} />
                        <Text color={colors.secondaryText}>No trades found</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  trades.map(trade => (
                    <Table.Row key={trade.id}>
                      <Table.Cell>
                        <Text fontSize="sm">{trade.date}</Text>
                      </Table.Cell>
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
                          color={trade.pnl >= 0 ? colors.profitText : colors.lossText}
                        >
                          {trade.pnl >= 0 ? '+' : ''}<FormatNumber value={trade.pnl} maximumFractionDigits={2} />
                        </Text>
                      </Table.Cell>
                      <Table.Cell maxW="300px">
                        <Text truncate fontSize="sm">{trade.notes}</Text>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
} 
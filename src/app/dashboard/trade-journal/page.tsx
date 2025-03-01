"use client";

import { useState } from "react";
import {
  Container,
  Flex,
  Text,
  SimpleGrid,
  GridItem,
  Button,
  Icon,
  Box,
  FormatNumber,
  Tabs
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import TradeJournalForm from "@/components/trade-journal/TradeJournalForm";
import TradeHistoryTable from "@/components/trade-journal/TradeHistoryTable";
import TradeCalendar from "@/components/trade-journal/TradeCalendar";
import StatCard from "@/components/dashboard/StatCard";


type JournalTabType = "calendar" | "table"

const sampleTrades = [
  {
    id: 1,
    date: "2025-02-15",
    symbol: "BTC/USDT",
    type: "buy",
    amount: 0.25,
    entryPrice: 42350.75,
    exitPrice: 43150.25,
    pnl: 199.88,
    notes: "Breakout from descending triangle pattern. Strong volume confirmation."
  },
  {
    id: 2,
    date: "2025-02-14",
    symbol: "ETH/USDT",
    type: "sell",
    amount: 1.5,
    entryPrice: 2250.25,
    exitPrice: 2180.50,
    pnl: 104.63,
    notes: "Resistance rejection at 2300. RSI showing overbought conditions."
  },
  {
    id: 3,
    date: "2025-02-13",
    symbol: "SOL/USDT",
    type: "buy",
    amount: 10,
    entryPrice: 105.80,
    exitPrice: 112.45,
    pnl: 66.50,
    notes: "Following uptrend. Support at 100 holding strong."
  },
  {
    id: 4,
    date: "2025-02-12",
    symbol: "ADA/USDT",
    type: "sell",
    amount: 500,
    entryPrice: 0.45,
    exitPrice: 0.42,
    pnl: -15.00,
    notes: "Stop loss triggered. Market reacted negatively to news."
  },
  {
    id: 5,
    date: "2025-02-11",
    symbol: "DOT/USDT",
    type: "buy",
    amount: 25,
    entryPrice: 6.75,
    exitPrice: 6.25,
    pnl: -12.50,
    notes: "Failed breakout. Volume didn't confirm the move."
  },
  {
    id: 6,
    date: "2025-02-10",
    symbol: "BTC/USDT",
    type: "buy",
    amount: 0.15,
    entryPrice: 41250.50,
    exitPrice: 42100.75,
    pnl: 127.54,
    notes: "Support bounce with increasing volume."
  },
  {
    id: 7,
    date: "2025-02-09",
    symbol: "ETH/USDT",
    type: "sell",
    amount: 2.0,
    entryPrice: 2300.25,
    exitPrice: 2250.50,
    pnl: 99.50,
    notes: "Resistance rejection with bearish divergence."
  },
  {
    id: 8,
    date: "2025-02-08",
    symbol: "SOL/USDT",
    type: "buy",
    amount: 15,
    entryPrice: 102.30,
    exitPrice: 98.45,
    pnl: -57.75,
    notes: "Failed breakout attempt."
  }
];

export default function TradeJournalPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [trades, setTrades] = useState(sampleTrades);
  const [activeView, setActiveView] = useState<JournalTabType | null>('table');

  const handleAddTrade = (newTrade: any) => {
    setTrades([
      { id: trades.length + 1, ...newTrade },
      ...trades
    ]);
    setIsFormOpen(false);
  };

  // Calculate statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(trade => trade.pnl > 0).length;
  const losingTrades = trades.filter(trade => trade.pnl < 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex flexDir="column" gap={6}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontWeight={500} fontSize="2xl">Trade Journal</Text>
            <Text fontSize="md" color="gray.500">Track and analyze your trading decisions</Text>
          </Box>
          <Flex gap={4}>
            <Tabs.Root value={activeView} onValueChange={(e) => e?.value && setActiveView(e.value as unknown as JournalTabType)}>
              <Tabs.List>
                <Tabs.Trigger value="table">Table View</Tabs.Trigger>
                <Tabs.Trigger value="calendar">Calendar View</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            <Button
              variant={"surface"}
              onClick={() => setIsFormOpen(true)}
              alignItems={'center'}
              gap={2}
            >
              <Icon as={FiPlus} />
              <Text>Add Trade</Text>
            </Button>
          </Flex>
        </Flex>

        {/* Statistics Cards */}
        <SimpleGrid columns={12} gap={4}>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <StatCard
              label="Total Trades"
              value={totalTrades.toString()}
              formatValue={false}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <StatCard
              label="Win Rate"
              value={`${winRate.toFixed(1)}%`}
              formatValue={false}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <StatCard
              label="Total P&L"
              value={totalPnl}
              valueColor={totalPnl >= 0 ? "green.500" : "red.500"}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <StatCard
              label="Win/Loss"
              value={`${winningTrades}/${losingTrades}`}
              formatValue={false}
            />
          </GridItem>
        </SimpleGrid>

        {/* Trade View (Table or Calendar) */}
        {activeView === 'table' ? (
          <TradeHistoryTable trades={trades} />
        ) : (
          <TradeCalendar trades={trades} />
        )}
      </Flex>

      {/* Add Trade Form Dialog */}
      {isFormOpen && (
        <TradeJournalForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddTrade}
        />
      )}
    </Container>
  );
}
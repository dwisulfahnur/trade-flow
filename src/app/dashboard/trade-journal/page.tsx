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
  Tabs,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import TradeJournalForm from "@/components/trade-journal/TradeJournalForm";
import TradeHistoryTable from "@/components/trade-journal/TradeHistoryTable";
import TradeCalendar from "@/components/trade-journal/TradeCalendar";
import StatCard from "@/components/dashboard/StatCard";
import { useColorModeValue } from "@/components/ui/color-mode";

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
  const [activeView, setActiveView] = useState<JournalTabType>('table');

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

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
    <Container
      maxW="container.xl"
      py={{ base: 3, md: 6 }}
      px={{ base: 2, sm: 4, md: 6 }}
      minH="calc(100vh - 64px)"
      bg={bgColor}
    >
      <VStack spaceY={{ base: 4, md: 6 }} align="stretch" w="full">
        {/* Header Section */}
        <Flex
          justifyContent="space-between"
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 0 }}
          w="full"
        >
          <Box mb={{ base: 2, md: 0 }}>
            <Text
              fontWeight="600"
              fontSize={{ base: "xl", md: "2xl" }}
              color={textColor}
            >
              Trade Journal
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={secondaryTextColor}
            >
              Track and analyze your trading decisions
            </Text>
          </Box>

          <Flex
            gap={3}
            flexDirection={{ base: "column", sm: "row" }}
            width={{ base: "100%", md: "auto" }}
          >
            <Tabs.Root
              value={activeView}
              onValueChange={(e) => e?.value && setActiveView(e.value as JournalTabType)}
              size={isMobile ? "sm" : "md"}
            >
              <Tabs.List>
                <Tabs.Trigger value="table">Table View</Tabs.Trigger>
                <Tabs.Trigger value="calendar">Calendar View</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Button
              variant="surface"
              onClick={() => setIsFormOpen(true)}
              alignItems="center"
              gap={2}
              size={isMobile ? "sm" : "md"}
              width={{ base: "100%", sm: "auto" }}
            >
              <Icon as={FiPlus} />
              <Text>{isSmallScreen ? "Add" : "Add Trade"}</Text>
            </Button>
          </Flex>
        </Flex>

        {/* Statistics Cards */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          gap={{ base: 3, md: 4 }}
          w="full"
        >
          <GridItem>
            <StatCard
              label="Total Trades"
              value={totalTrades.toString()}
              formatValue={false}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Win Rate"
              value={`${winRate.toFixed(1)}%`}
              formatValue={false}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Total P&L"
              value={totalPnl}
              valueColor={totalPnl >= 0 ? "green.500" : "red.500"}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Win/Loss"
              value={`${winningTrades}/${losingTrades}`}
              formatValue={false}
            />
          </GridItem>
        </SimpleGrid>

        {/* Trade View (Table or Calendar) */}
        <Box
          w="full"
          overflowX="auto"
          borderRadius="md"
          boxShadow="sm"
        >
          {activeView === 'table' ? (
            <TradeHistoryTable trades={trades} />
          ) : (
            <TradeCalendar trades={trades} />
          )}
        </Box>
      </VStack>

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
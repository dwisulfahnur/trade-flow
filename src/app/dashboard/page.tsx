"use client";

import { Container, SimpleGrid, Text, Flex, GridItem } from "@chakra-ui/react";
import StatCard from "@/components/dashboard/StatCard";
import PerformanceChartCard from "@/components/dashboard/PerformanceChartCard";
import LatestTradesCard from "@/components/dashboard/LatestTradesCard";

export default function DashboardPage() {
  // Sample data for latest trades
  const latestTrades = [
    { id: 1, symbol: "BTC/USDT", type: "buy", amount: 0.25, price: 42350.75, pnl: 125.50, date: "2023-06-15" },
    { id: 2, symbol: "ETH/USDT", type: "sell", amount: 1.5, price: 2250.25, pnl: -45.75, date: "2023-06-14" },
    { id: 3, symbol: "SOL/USDT", type: "buy", amount: 10, price: 105.80, pnl: 78.20, date: "2023-06-13" },
    { id: 4, symbol: "ADA/USDT", type: "sell", amount: 500, price: 0.45, pnl: 32.40, date: "2023-06-12" },
    { id: 5, symbol: "DOT/USDT", type: "buy", amount: 25, price: 6.75, pnl: -18.30, date: "2023-06-11" },
  ];

  return (
    <Container my={8}>
      <Flex flexDir={'column'} gap={4}>
        <Flex flexDir={'column'}>
          <Text fontWeight={500} fontSize={'2xl'}>Dashboard</Text>
          <Text fontSize={'md'} color={'gray.500'}>Track and analyze your trading performance</Text>
        </Flex>
        <SimpleGrid columns={12} gap={6}>
          <GridItem colSpan={3}>
            <StatCard
              label="Total PNL"
              value={123102}
              change={4.3}
              showChange={true}
            />
          </GridItem>
          <GridItem colSpan={3}>
            <StatCard
              label="Win Rate"
              value="192.1k"
              change={-1.9}
              showChange={true}
              formatValue={false}
            />
          </GridItem>
          <GridItem colSpan={3}>
            <StatCard
              label="Balance"
              value={10123.2123}
            />
          </GridItem>
          <GridItem colSpan={3}>
            <StatCard
              label="Open Positions"
              value="4"
              formatValue={false}
            />
          </GridItem>
          <GridItem colSpan={9}>
            <PerformanceChartCard />
          </GridItem>
          <GridItem colSpan={3}>
            <LatestTradesCard trades={latestTrades} />
          </GridItem>
        </SimpleGrid>
      </Flex>
    </Container>
  );
}
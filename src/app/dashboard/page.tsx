"use client";

import { useState } from "react";
import {
  Container,
  SimpleGrid,
  GridItem,
  Flex,
  Text,
  Box,
  VStack,
  HStack,
  Icon,
  Button,
  useBreakpointValue,
  Skeleton
} from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode";
import StatCard from "@/components/dashboard/StatCard";
import PerformanceChartCard from "@/components/dashboard/PerformanceChartCard";
import LatestTradesCard from "@/components/dashboard/LatestTradesCard";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import UserTradesService from "@/services/supabase/userTrades";


export default function DashboardPage() {
  // Responsive layout adjustments
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  const { session } = useSession();
  const tradesService = new UserTradesService(session);

  const { data: pnlRes, isLoading: pnlLoading } = useQuery({
    queryKey: ['trades-pnl'],
    queryFn: () => tradesService.getTradesPnl({}),
    enabled: !!session,
  });

  const { data: tradesNumberRes, isLoading: tradesNumberLoading } = useQuery({
    queryKey: ['trades-count'],
    queryFn: () => tradesService.getTradesCount({}),
    enabled: !!session,
  });

  const { data: winningTradesRes, isLoading: winningTradesLoading } = useQuery({
    queryKey: ['trades-winning-count'],
    queryFn: () => tradesService.getTradesWinningCount({}),
    enabled: !!session,
  });

  const { data: losingTradesRes, isLoading: losingTradesLoading } = useQuery({
    queryKey: ['trades-losing-count'],
    queryFn: () => tradesService.getTradesLosingCount({}),
    enabled: !!session,
  });

  const totalPnl = pnlRes ?? 0;
  const totalTrades = tradesNumberRes ?? 0;
  const winningTrades = winningTradesRes ?? 0;
  const losingTrades = losingTradesRes ?? 0;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return (
    <Container
      maxW="container.xl"
      py={{ base: 3, md: 6 }}
      px={{ base: 2, sm: 4, md: 6 }}
      minH="calc(100vh - 64px)"
      bg={bgColor}
    >
      <VStack spaceY={{ base: 4, md: 6 }} align="stretch" w="full">
        {/* Header */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Dashboard
            </Text>
            <Text fontSize="sm" color={secondaryTextColor}>
              Overview of your trading performance
            </Text>
          </Box>
          <HStack>
            <Button
              size={isMobile ? "sm" : "md"}
              variant="outline"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiCalendar} />
              Last 30 Days
            </Button>
          </HStack>
        </Flex>

        {/* Stats Cards */}
        {/* Statistics Cards */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          gap={{ base: 3, md: 4 }}
          w="full"
        >
          <GridItem>
            <StatCard
              label="Total Trades"
              value={totalTrades}
              formatValue={true}
              isLoading={tradesNumberLoading}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Win Rate"
              value={winningTradesLoading || losingTradesLoading ? "-" : `${winRate.toFixed(1)}%`}
              formatValue={false}
              isLoading={tradesNumberLoading}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Total P&L"
              value={totalPnl}
              valueColor={totalPnl >= 0 ? "green.500" : "red.500"}
              formatValue={true}
              isLoading={pnlLoading}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Win/Loss"
              value={winningTradesLoading || losingTradesLoading ? "-" : `${winningTrades}/${losingTrades}`}
              formatValue={false}
              isLoading={winningTradesLoading || losingTradesLoading}
            />
          </GridItem>
        </SimpleGrid>

        {/* Charts */}
        <SimpleGrid columns={12} gap={{ base: 3, md: 4 }}>
          <GridItem colSpan={{ base: 12, lg: 9 }}>
            <PerformanceChartCard />
          </GridItem>

          <GridItem colSpan={{ base: 12, lg: 3 }}>
            <LatestTradesCard />
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
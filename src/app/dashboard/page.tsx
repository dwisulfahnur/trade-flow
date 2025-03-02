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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Responsive layout adjustments
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  const latestTrades = [
    { id: 1, symbol: "BTC/USDT", type: "buy", amount: 0.25, price: 42350.75, pnl: 125.50, date: "2023-06-15" },
    { id: 2, symbol: "ETH/USDT", type: "sell", amount: 1.5, price: 2250.25, pnl: -45.75, date: "2023-06-14" },
    { id: 3, symbol: "SOL/USDT", type: "buy", amount: 10, price: 105.80, pnl: 78.20, date: "2023-06-13" },
    { id: 4, symbol: "ADA/USDT", type: "sell", amount: 500, price: 0.45, pnl: 32.40, date: "2023-06-12" },
    { id: 5, symbol: "DOT/USDT", type: "buy", amount: 25, price: 6.75, pnl: -18.30, date: "2023-06-11" },
  ];

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
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 0 }}
        >
          <Box>
            <Text
              fontWeight="600"
              fontSize={{ base: "xl", md: "2xl" }}
              color={textColor}
            >
              Dashboard
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={secondaryTextColor}
            >
              Overview of your trading performance
            </Text>
          </Box>

          <HStack spaceX={3} mt={{ base: 2, md: 0 }}>
            <Button
              size={isMobile ? "sm" : "md"}
              variant="surface"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiCalendar} />
              {isMobile ? "Today" : "Last 7 Days"}
            </Button>
            <Button
              size={isMobile ? "sm" : "md"}
              variant="surface"
              colorPalette="blue"
            >
              Refresh
            </Button>
          </HStack>
        </Flex>

        {/* Stats Cards */}
        <SimpleGrid columns={12} gap={{ base: 3, md: 4 }}>
          <GridItem colSpan={{ base: 6, lg: 3 }}>
            <Skeleton loading={isLoading}>
              <StatCard
                label="Total Balance"
                value={24650.75}
              />
            </Skeleton>
          </GridItem>
          <GridItem colSpan={{ base: 6, lg: 3 }}>
            <Skeleton loading={isLoading}>
              <StatCard
                label="Monthly Profit"
                value={1245.23}
              />
            </Skeleton>
          </GridItem>
          <GridItem colSpan={{ base: 6, lg: 3 }}>
            <Skeleton loading={isLoading}>
              <StatCard
                label="Win Rate"
                value="68.5%"
                formatValue={false}
              />
            </Skeleton>
          </GridItem>
          <GridItem colSpan={{ base: 6, lg: 3 }}>
            <Skeleton loading={isLoading}>
              <StatCard
                label="Total Trades"
                value="156"
                formatValue={false}
              />
            </Skeleton>
          </GridItem>
        </SimpleGrid>

        {/* Charts */}
        <SimpleGrid columns={12} gap={{ base: 3, md: 4 }}>
          <GridItem colSpan={{ base: 12, lg: 9 }}>
            <PerformanceChartCard />
          </GridItem>

          <GridItem colSpan={{ base: 12, lg: 3 }}>
            <LatestTradesCard trades={latestTrades} />
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
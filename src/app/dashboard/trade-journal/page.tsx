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
  VStack,
  Spinner,
  Center
} from "@chakra-ui/react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import TradeJournalForm from "@/components/trade-journal/TradeJournalForm";
import TradeHistoryTable from "@/components/trade-journal/TradeHistoryTable";
import TradeCalendar from "@/components/trade-journal/TradeCalendar";
import TradeSyncDialog from "@/components/trade-journal/TradeSyncDialog";
import StatCard from "@/components/dashboard/StatCard";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import UserTradesService, { Trade } from "@/services/supabase/userTrades";

type JournalTabType = "calendar" | "table"

export default function TradeJournalPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<JournalTabType>('table');
  const [editingTrade, setEditingTrade] = useState<Trade | undefined>(undefined);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });

  const { session } = useSession();
  const tradesService = new UserTradesService(session);

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");

  // Fetch trades from the database
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: tradesService.getTrades,
    enabled: !!session, // Only fetch if user is logged in
  });

  const handleAddTrade = (data: any) => {
    console.log("Adding trade:", data);
    setIsFormOpen(false);
  };

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setIsFormOpen(true);
  };

  const handleOpenSyncDialog = () => {
    setIsSyncDialogOpen(true);
  };

  // Calculate statistics
  const tradeData = trades || [];
  const totalTrades = tradeData.length;
  const winningTrades = tradeData.filter(trade => trade.pnl > 0).length;
  const losingTrades = tradeData.filter(trade => trade.pnl < 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalPnl = tradeData.reduce((sum, trade) => sum + trade.pnl, 0);

  return (
    <Container
      maxW="container.xl"
      py={{ base: 4, md: 6 }}
      px={{ base: 4, md: 6 }}
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

            <Flex gap={2}>
              <Button
                variant="outline"
                onClick={handleOpenSyncDialog}
                alignItems="center"
                gap={2}
                size={isMobile ? "sm" : "md"}
              >
                <Icon as={FiRefreshCw} />
                {!isSmallScreen && "Sync"}
              </Button>

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
              value={isLoading ? "-" : totalTrades.toString()}
              formatValue={false}
              isLoading={isLoading}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Win Rate"
              value={isLoading ? "-" : `${winRate.toFixed(1)}%`}
              formatValue={false}
              isLoading={isLoading}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Total P&L"
              value={isLoading ? 0 : totalPnl}
              valueColor={totalPnl >= 0 ? "green.500" : "red.500"}
              isLoading={isLoading}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Win/Loss"
              value={isLoading ? "-" : `${winningTrades}/${losingTrades}`}
              formatValue={false}
              isLoading={isLoading}
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
            <TradeHistoryTable
              trades={trades}
              isLoading={isLoading}
              onEditTrade={handleEditTrade}
            />
          ) : (
            <TradeCalendar
              trades={trades || []}
              onEditTrade={handleEditTrade}
            />
          )}
        </Box>
      </VStack>

      {/* Add/Edit Trade Form Dialog */}
      {isFormOpen && (
        <TradeJournalForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTrade(undefined);
          }}
          onSubmit={handleAddTrade}
          initialData={editingTrade}
        />
      )}

      {/* Sync Dialog */}
      {isSyncDialogOpen && (
        <TradeSyncDialog
          open={isSyncDialogOpen}
          onClose={() => setIsSyncDialogOpen(false)}
        />
      )}
    </Container>
  );
}
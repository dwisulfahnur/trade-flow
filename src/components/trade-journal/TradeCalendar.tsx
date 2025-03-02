"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Flex,
  Text,
  Grid,
  GridItem,
  Box,
  Button,
  Icon,
  HStack,
  Badge,
  FormatNumber
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode";
import UserTradesService, { Trade } from "@/services/supabase/userTrades";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
interface TradeCalendarProps {
  onEditTrade: (trade: Trade) => void;
}

export default function TradeCalendar({ onEditTrade }: TradeCalendarProps) {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const [currentDate, setCurrentDate] = useState(new Date());
  const { session } = useSession();

  const tradesService = new UserTradesService(session);
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => tradesService.getTrades({ startDate, endDate }),
    enabled: !!session,
  });

  // Define all theme colors using useColorModeValue at the top
  const colors = {
    // Card and border colors
    cardBg: useColorModeValue("white", "gray.800"),
    borderColor: useColorModeValue("gray.200", "gray.700"),

    // Day cell colors
    dayBg: useColorModeValue("gray.50", "gray.700"),
    todayBg: useColorModeValue("blue.50", "blue.900"),

    // Profit/loss colors
    profitBg: useColorModeValue("green.100", "green.900"),
    lossBg: useColorModeValue("red.100", "red.900"),
    profitText: useColorModeValue("green.600", "green.200"),
    lossText: useColorModeValue("red.600", "red.200"),

    // Text colors
    primaryText: useColorModeValue("gray.800", "white"),
    secondaryText: useColorModeValue("gray.500", "gray.400"),

    // Badge colors
    profitBadgeBg: useColorModeValue("green.100", "green.800"),
    lossBadgeBg: useColorModeValue("red.100", "red.800"),
    profitBadgeText: useColorModeValue("green.700", "green.100"),
    lossBadgeText: useColorModeValue("red.700", "red.100"),

    // Button colors
    buttonHoverBg: useColorModeValue("gray.100", "gray.700"),
  };

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Format month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

  // Previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  useEffect(() => {
    setStartDate(new Date(currentYear, currentMonth, 1).toISOString());
    setEndDate(new Date(currentYear, currentMonth + 1, 0).toISOString());
  }, [currentDate]);

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
  };

  // Get trades for a specific day
  const getDayStats = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTrades = trades?.filter(trade => trade.date.startsWith(dateString)) ?? [];

    const pnl = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const tradesCount = dayTrades.length;

    return {
      pnl,
      tradesCount,
      hasActivity: tradesCount > 0,
      trades: dayTrades
    };
  };

  // Generate calendar days array with null for empty cells
  const calendarDays = Array(firstDayOfMonth).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Calculate monthly statistics
  const monthStats = {
    totalPnl: 0,
    profitDays: 0,
    lossDays: 0,
    totalTrades: 0
  };

  // Loop through all days in the month to calculate stats
  for (let day = 1; day <= daysInMonth; day++) {
    const { pnl, tradesCount } = getDayStats(day);
    if (tradesCount > 0) {
      monthStats.totalPnl += pnl;
      monthStats.totalTrades += tradesCount;
      if (pnl > 0) {
        monthStats.profitDays++;
      } else if (pnl < 0) {
        monthStats.lossDays++;
      }
    }
  }

  // Handle day click to show trades
  const handleDayClick = (day: number) => {
    const { trades: dayTrades } = getDayStats(day);
    if (dayTrades.length === 1) {
      // If there's only one trade, open it directly
      onEditTrade(dayTrades[0]);
    } else if (dayTrades.length > 1) {
      // If there are multiple trades, you could show a list or open the first one
      // For now, we'll just open the first one
      onEditTrade(dayTrades[0]);
    }
  };

  return (
    <Card.Root bg={colors.cardBg} borderColor={colors.borderColor}>
      <Card.Header>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight={500} fontSize="lg" color={colors.primaryText}>Trading Calendar</Text>
          <HStack spaceX={4}>
            <Badge colorPalette="green" variant="subtle" bg={colors.profitBadgeBg} color={colors.profitBadgeText}>
              Profit Days: {monthStats.profitDays}
            </Badge>
            <Badge colorPalette="red" variant="subtle" bg={colors.lossBadgeBg} color={colors.lossBadgeText}>
              Loss Days: {monthStats.lossDays}
            </Badge>
            <Badge variant="subtle">
              Monthly P&L: <FormatNumber value={monthStats.totalPnl} maximumFractionDigits={2} />
            </Badge>
          </HStack>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Button
            onClick={prevMonth}
            size="sm"
            variant="ghost"
            alignItems={'center'}
            gap={2}
            _hover={{ bg: colors.buttonHoverBg }}
          >
            <Icon as={FiChevronLeft} />
            <Text>Previous</Text>
          </Button>
          <Text fontWeight="bold" fontSize="xl" color={colors.primaryText}>
            {monthName} {currentYear}
          </Text>
          <Button
            onClick={nextMonth}
            size="sm"
            variant="ghost"
            alignItems={'center'}
            gap={2}
            _hover={{ bg: colors.buttonHoverBg }}
          >
            <Text>Next</Text>
            <Icon as={FiChevronRight} />
          </Button>
        </Flex>

        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <GridItem key={day} textAlign="center" fontWeight="medium" py={2} color={colors.primaryText}>
              {day}
            </GridItem>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return <GridItem key={`empty-${index}`} />;
            }

            const { pnl, tradesCount, hasActivity } = getDayStats(day);
            const dayBg = hasActivity
              ? (pnl > 0 ? colors.profitBg : colors.lossBg)
              : (isToday(day) ? colors.todayBg : colors.dayBg);
            const textColor = hasActivity
              ? (pnl > 0 ? colors.profitText : colors.lossText)
              : colors.primaryText;

            return (
              <GridItem
                key={`day-${day}`}
                bg={dayBg}
                borderRadius="md"
                p={2}
                position="relative"
                minH="80px"
                border="1px solid"
                borderColor={colors.borderColor}
                cursor={hasActivity ? "pointer" : "default"}
                onClick={hasActivity ? () => handleDayClick(day) : undefined}
                _hover={hasActivity ? { opacity: 0.8 } : undefined}
              >
                <Text fontWeight={isToday(day) ? "bold" : "normal"} color={textColor}>
                  {day}
                </Text>

                {hasActivity && (
                  <Tooltip
                    content={`${tradesCount} trade${tradesCount > 1 ? 's' : ''}, P&L: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}`}
                  >
                    <Box position="absolute" bottom="2" right="2">
                      <Flex direction="column" alignItems="flex-end">
                        <Text fontSize="xs" color={textColor}>
                          {tradesCount} trade{tradesCount > 1 ? 's' : ''}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                        </Text>
                      </Flex>
                    </Box>
                  </Tooltip>
                )}
              </GridItem>
            );
          })}
        </Grid>

        <Flex justifyContent="flex-end" mt={4} alignItems="center">
          <Icon as={FiInfo} mr={2} color={colors.secondaryText} />
          <Text fontSize="sm" color={colors.secondaryText}>
            Green: Profitable day | Red: Unprofitable day | Click on a day to view trades
          </Text>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
} 
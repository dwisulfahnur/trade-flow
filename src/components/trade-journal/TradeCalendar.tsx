"use client";

import { useState } from "react";
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

interface TradeCalendarProps {
  trades: Trade[];
}

export default function TradeCalendar({ trades }: TradeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const dayBgColor = useColorModeValue("gray.50", "gray.700");
  const todayBgColor = useColorModeValue("blue.50", "blue.900");
  const profitColor = useColorModeValue("green.100", "green.900");
  const lossColor = useColorModeValue("red.100", "red.900");
  const profitTextColor = useColorModeValue("green.600", "green.200");
  const lossTextColor = useColorModeValue("red.600", "red.200");

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

  // Group trades by date
  const tradesByDate = trades.reduce((acc, trade) => {
    const date = trade.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  // Calculate daily PnL
  const dailyPnL = Object.entries(tradesByDate).reduce((acc, [date, dayTrades]) => {
    acc[date] = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    return acc;
  }, {} as Record<string, number>);

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Format date string for comparison
  const formatDateString = (day: number) => {
    const month = currentMonth + 1;
    return `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
  };

  // Get day statistics
  const getDayStats = (day: number) => {
    const dateStr = formatDateString(day);
    const dayPnL = dailyPnL[dateStr] || 0;
    const tradesCount = tradesByDate[dateStr]?.length || 0;

    return {
      pnl: dayPnL,
      tradesCount,
      hasActivity: tradesCount > 0
    };
  };

  // Get month statistics
  const getMonthStats = () => {
    let totalPnL = 0;
    let tradingDays = 0;
    let profitDays = 0;
    let lossDays = 0;

    Object.values(dailyPnL).forEach(pnl => {
      totalPnL += pnl;
      tradingDays++;
      if (pnl > 0) profitDays++;
      else if (pnl < 0) lossDays++;
    });

    return {
      totalPnL,
      tradingDays,
      profitDays,
      lossDays,
      winRate: tradingDays > 0 ? (profitDays / tradingDays) * 100 : 0
    };
  };

  const monthStats = getMonthStats();

  return (
    <Card.Root>
      <Card.Header>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight={500} fontSize="lg">Trading Calendar</Text>
          <HStack spaceX={4}>
            <Badge colorPalette="green" variant="subtle">
              Profit Days: {monthStats.profitDays}
            </Badge>
            <Badge colorPalette="red" variant="subtle">
              Loss Days: {monthStats.lossDays}
            </Badge>
            <Badge colorPalette={monthStats.totalPnL >= 0 ? "green" : "red"} variant="subtle">
              Month P&L: {monthStats.totalPnL >= 0 ? '+' : ''}
              <FormatNumber value={monthStats.totalPnL} maximumFractionDigits={2} />
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
          >
            <Icon as={FiChevronLeft} />
            <Text>Previous</Text>
          </Button>
          <Text fontWeight="bold" fontSize="xl">
            {monthName} {currentYear}
          </Text>
          <Button
            onClick={nextMonth}
            size="sm"
            variant="ghost"
            alignItems={'center'}
            gap={2}
          >
            <Text>Next</Text>
            <Icon as={FiChevronRight} />
          </Button>
        </Flex>

        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <GridItem key={day} textAlign="center" fontWeight="medium" py={2}>
              {day}
            </GridItem>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return <GridItem key={`empty-${index}`} />;
            }

            const { pnl, tradesCount, hasActivity } = getDayStats(day);
            const dayBg = hasActivity
              ? (pnl > 0 ? profitColor : lossColor)
              : (isToday(day) ? todayBgColor : dayBgColor);
            const textColor = hasActivity
              ? (pnl > 0 ? profitTextColor : lossTextColor)
              : undefined;

            return (
              <GridItem
                key={`day-${day}`}
                bg={dayBg}
                borderRadius="md"
                p={2}
                position="relative"
                minH="80px"
                border="1px solid"
                borderColor={borderColor}
              >
                <Text fontWeight={isToday(day) ? "bold" : "normal"}>
                  {day}
                </Text>

                {hasActivity && (
                  <Tooltip
                    content={`${tradesCount} trade${tradesCount > 1 ? 's' : ''}, P&L: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}`}
                  // placement="top"
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
          <Icon as={FiInfo} mr={2} color="gray.500" />
          <Text fontSize="sm" color="gray.500">
            Green: Profitable day | Red: Unprofitable day
          </Text>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
} 
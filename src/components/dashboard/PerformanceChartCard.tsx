"use client";

import { Card, Flex, Text, Box } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Skeleton } from "@chakra-ui/react";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import UserTradesService from "@/services/supabase/userTrades";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ApexOptions } from "apexcharts";
// Dynamically import ApexCharts to avoid SSR issues
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PerformanceChartCardProps {
  startDate?: Date;
  endDate?: string;
}

export default function PerformanceChartCard({ startDate, endDate }: PerformanceChartCardProps) {
  const { session } = useSession();
  const tradesService = new UserTradesService(session);

  const { data, isLoading } = useQuery({
    queryKey: ['trades-performance'],
    queryFn: () => tradesService.getDailyPerformance({}),
  });

  const performanceData = data ?? [];

  // Define colors based on color mode
  const textColor = useColorModeValue("rgba(0, 0, 0, 0.6)", "rgba(255, 255, 255, 0.6)");
  const positiveColor = useColorModeValue("#22c55e", "#4ade80"); // Green
  const negativeColor = useColorModeValue("#ef4444", "#f87171"); // Red
  const gridColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)");
  const labelColor = useColorModeValue("#1A202C", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#1A202C");

  // Calculate the maximum absolute value for y-axis symmetry
  const maxAbsValue = useMemo(() => {
    if (performanceData.length === 0) return 100; // Default value if no data

    const maxPositive = Math.max(0, ...performanceData.map(item => item.pnl));
    const maxNegative = Math.abs(Math.min(0, ...performanceData.map(item => item.pnl)));

    // Get the larger of the two and add some padding (20%)
    return Math.ceil(Math.max(maxPositive, maxNegative) * 1.2);
  }, [performanceData]);

  // Prepare series data
  const series = useMemo(() => [{
    name: 'Profit/Loss',
    data: performanceData.map((item) => ({
      x: new Date(item.date).getTime(),
      y: item.pnl,
    }))
  }], [performanceData]);

  // Configure chart options
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: false
      },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '80%', // Slightly narrower bars
        colors: {
          ranges: [{
            from: -1000000,
            to: 0,
            color: negativeColor
          }, {
            from: 0,
            to: 1000000,
            color: positiveColor
          }]
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        style: {
          colors: labelColor,
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: -maxAbsValue, // Set minimum value to negative of max
      max: maxAbsValue,  // Set maximum value to max
      tickAmount: 4,     // Control number of ticks on y-axis
      forceNiceScale: true,
      labels: { show: false }
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: useColorModeValue('light', 'dark'),
      x: {
        format: 'dd MMM yyyy'
      },
      y: {
        formatter: (value: number) => {
          return `${value >= 0 ? '+' : ''}${value.toFixed(2)} USD`;
        }
      },
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    },
    fill: {
      opacity: 0.9 // Slightly transparent bars
    }
  }

  return (
    <Card.Root _hover={{ boxShadow: 'md' }}>
      <Card.Header>
        <Flex justifyContent={'space-between'}>
          <Text fontWeight={500} fontSize={'lg'}>Performance</Text>
        </Flex>
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <Skeleton height="400px" />
        ) : performanceData && performanceData.length === 0 ? (
          <Flex height="400px" alignItems="center" justifyContent="center">
            <Text color={textColor}>No performance data available</Text>
          </Flex>
        ) : (
          <Box width={'full'} height={'400px'}>
            {typeof window !== 'undefined' && (
              <ApexCharts
                options={chartOptions}
                series={series}
                type="bar"
                height={400}
              />
            )}
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
} 
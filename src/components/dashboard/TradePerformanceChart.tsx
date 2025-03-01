"use client";

import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useColorModeValue } from "@/components/ui/color-mode";

const data = [
  { date: 'Apr 22', pnl: 0 },
  { date: 'Apr 23', pnl: 12 },
  { date: 'Apr 24', pnl: -5 },
  { date: 'Apr 25', pnl: 18 },
  { date: 'Apr 26', pnl: 22 },
  { date: 'Apr 27', pnl: 34 },
  { date: 'Apr 28', pnl: 55 },
  { date: 'Apr 29', pnl: 72 },
];

const getCumulativeData = (chartData: any[]) => {
  let cumulativePnl = 0;
  return chartData.map(item => {
    cumulativePnl += item.pnl;
    return {
      ...item,
      cumulativePnl
    };
  });
};

export default function TradePerformanceChart() {
  const [chartData] = useState(getCumulativeData(data));

  // Define colors based on color mode
  const primaryColor = useColorModeValue("#3182CE", "#63B3ED"); // Blue in light mode, lighter blue in dark mode
  const primaryColorOpacity = useColorModeValue("rgba(49, 130, 206, 0.3)", "rgba(99, 179, 237, 0.3)");
  const primaryColorOpacityZero = useColorModeValue("rgba(49, 130, 206, 0)", "rgba(99, 179, 237, 0)");

  const secondaryColor = useColorModeValue("#22c55e", "#4ade80"); // Green in light mode, lighter green in dark mode
  const secondaryColorOpacity = useColorModeValue("rgba(34, 197, 94, 0.3)", "rgba(74, 222, 128, 0.3)");
  const secondaryColorOpacityZero = useColorModeValue("rgba(34, 197, 94, 0)", "rgba(74, 222, 128, 0)");

  const gridColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)");
  const textColor = useColorModeValue("rgba(0, 0, 0, 0.6)", "rgba(255, 255, 255, 0.6)");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const tooltipBorderColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: tooltipBgColor,
          border: `1px solid ${tooltipBorderColor}`,
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{ fontWeight: 500, color: textColor }}>{label}</p>
          <p style={{ fontSize: "14px", color: textColor }}>
            Daily: <span style={{ color: payload[1].value >= 0 ? secondaryColor : "#EF4444" }}>
              {payload[1].value >= 0 ? '+' : ''}{payload[1].value} USD
            </span>
          </p>
          <p style={{ fontSize: "14px", fontWeight: 500, color: textColor }}>
            Total: <span style={{ color: payload[0].value >= 0 ? primaryColor : "#EF4444" }}>
              {payload[0].value >= 0 ? '+' : ''}{payload[0].value} USD
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Box width={'full'} height={'400px'}>
      <ResponsiveContainer>
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColorOpacity} stopOpacity={1} />
              <stop offset="95%" stopColor={primaryColorOpacityZero} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={secondaryColorOpacity} stopOpacity={1} />
              <stop offset="95%" stopColor={secondaryColorOpacityZero} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulativePnl"
            stroke={primaryColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPnl)"
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="pnl"
            stroke={secondaryColor}
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorDaily)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
} 
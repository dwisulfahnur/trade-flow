"use client";

import { Card, Flex, Stat, Badge, FormatNumber } from "@chakra-ui/react";

interface StatCardProps {
  label: string;
  value: number | string;
  change?: number;
  showChange?: boolean;
  formatValue?: boolean;
  valueColor?: string;
}

export default function StatCard({
  label,
  value,
  change,
  showChange = false,
  formatValue = true,
  valueColor,
}: StatCardProps) {
  const isPositive = typeof change === 'number' ? change >= 0 : false;

  return (
    <Card.Root _hover={{ boxShadow: 'md' }}>
      <Card.Body>
        <Stat.Root>
          <Stat.Label>{label}</Stat.Label>
          <Flex justifyContent={'space-between'}>
            <Stat.ValueText color={valueColor ?? undefined} >
              {formatValue && typeof value === 'number' ? (
                <FormatNumber value={value} maximumFractionDigits={2} />
              ) : (
                value
              )}
            </Stat.ValueText>
            {showChange && change !== undefined && (
              <Badge colorPalette={isPositive ? "green" : "red"} variant="plain" px="0">
                {isPositive ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
                {Math.abs(change)}%
              </Badge>
            )}
          </Flex>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}
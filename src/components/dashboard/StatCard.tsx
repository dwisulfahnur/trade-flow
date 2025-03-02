"use client";

import { Card, Text, Flex, Box, Skeleton } from "@chakra-ui/react";
import { FormatNumber } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

export interface StatCardProps {
  label: string;
  value: number | string;
  valueColor?: string;
  formatValue?: boolean;
  isLoading?: boolean;
}

export default function StatCard({
  label,
  value,
  valueColor,
  formatValue = true,
  isLoading
}: StatCardProps) {
  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const defaultValueColor = useColorModeValue("gray.800", "white");
  const skeletonStartColor = useColorModeValue("gray.100", "gray.700");
  const skeletonEndColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Card.Root bg={cardBg} p={4} h="100%">
      <Flex direction="column" h="100%">
        <Text fontSize="sm" color={labelColor} mb={1}>
          {label}
        </Text>

        {isLoading ? (
          <Skeleton
            height="28px"
            width="80%"
            css={{
              "--start-color": skeletonStartColor,
              "--end-color": skeletonEndColor,
            }}
          />
        ) : (
          <Box>
            {formatValue && typeof value === 'number' ? (
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={valueColor || defaultValueColor}
              >
                <FormatNumber value={value} />
              </Text>
            ) : (
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={valueColor || defaultValueColor}
              >
                {value}
              </Text>
            )}
          </Box>
        )}
      </Flex>
    </Card.Root>
  );
}
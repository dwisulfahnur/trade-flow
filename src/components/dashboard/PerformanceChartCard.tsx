"use client";

import { Card, Flex, Text } from "@chakra-ui/react";
import TradePerformanceChart from "@/components/dashboard/TradePerformanceChart";

export default function PerformanceChartCard() {
  return (
    <Card.Root _hover={{ boxShadow: 'md' }}>
      <Card.Header>
        <Flex justifyContent={'space-between'}>
          <Text fontWeight={500} fontSize={'lg'}>Performance</Text>
        </Flex>
      </Card.Header>
      <Card.Body>
        <TradePerformanceChart />
      </Card.Body>
    </Card.Root>
  );
} 
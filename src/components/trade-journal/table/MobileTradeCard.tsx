import { Card, Flex, Text, Icon, Badge, HStack, IconButton } from "@chakra-ui/react";
import { FiArrowUp, FiArrowDown, FiEdit, FiTrash2 } from "react-icons/fi";
import { Trade } from "@/services/supabase/userTrades";

interface MobileTradeCardProps {
  trade: Trade;
  colors: {
    borderColor: string;
    secondaryText: string;
    profitText: string;
    lossText: string;
  };
  formatDate: (date: string) => string;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
}

export function MobileTradeCard({
  trade,
  colors,
  formatDate,
  onEditTrade,
  onDeleteTrade
}: MobileTradeCardProps) {
  return (
    <Card.Root key={trade.id} mb={3} borderColor={colors.borderColor}>
      <Card.Body p={3}>
        <Flex justifyContent="space-between" mb={2}>
          <Text fontWeight="medium">{trade.symbol}</Text>
          <Text
            fontWeight="bold"
            color={trade.pnl >= 0 ? colors.profitText : colors.lossText}
          >
            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb={2}>
          <Flex alignItems="center" gap={1}>
            <Icon
              as={trade.type === 'buy' ? FiArrowUp : FiArrowDown}
              color={trade.type === 'buy' ? 'green.500' : 'red.500'}
            />
            <Badge colorPalette={trade.type === 'buy' ? 'green' : 'red'}>
              {trade.type.toUpperCase()}
            </Badge>
          </Flex>
          <Text fontSize="sm" color={colors.secondaryText}>
            {formatDate(trade.date)}
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb={2}>
          <Text fontSize="sm">
            Entry: {trade.entry_price ? trade.entry_price.toFixed(2) : 'N/A'}
          </Text>
          <Text fontSize="sm">
            Exit: {trade.exit_price ? trade.exit_price.toFixed(2) : 'N/A'}
          </Text>
        </Flex>

        {trade.fee && (
          <Text fontSize="sm" color={colors.secondaryText} mb={2}>
            Fee: {trade.fee.toFixed(2)}
          </Text>
        )}

        {trade.notes && (
          <Text fontSize="sm" color={colors.secondaryText} truncate>
            {trade.notes}
          </Text>
        )}

        <HStack mt={2} justifyContent="flex-end">
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Edit trade"
            onClick={() => onEditTrade(trade)}
          >
            <FiEdit />
          </IconButton>
          <IconButton
            size="xs"
            variant="ghost"
            colorPalette="red"
            aria-label="Delete trade"
            onClick={() => onDeleteTrade(trade.id!)}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
} 
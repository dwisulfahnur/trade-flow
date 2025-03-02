import { Table, Flex, Icon, Text } from "@chakra-ui/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { SortField, SortDirection } from "../TradeHistoryTable";

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortableHeader({
  label,
  field,
  currentSort,
  direction,
  onSort
}: SortableHeaderProps) {
  const isActive = currentSort === field;

  return (
    <Table.ColumnHeader>
      <Flex
        alignItems="center"
        gap={1}
        cursor="pointer"
        onClick={() => onSort(field)}
      >
        <Text>{label}</Text>
        {isActive && (
          <Icon
            as={direction === 'asc' ? FiChevronUp : FiChevronDown}
            boxSize={4}
          />
        )}
      </Flex>
    </Table.ColumnHeader>
  );
} 
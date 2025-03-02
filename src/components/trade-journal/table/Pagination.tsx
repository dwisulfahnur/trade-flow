import { Flex, Button, Text, HStack, Icon, NativeSelect } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage
}: PaginationProps) {
  return (
    <Flex justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
      <HStack>
        <Text fontSize="sm">Rows per page:</Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            width="70px"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </HStack>

      <HStack>
        <Text fontSize="sm">
          Page {currentPage} of {totalPages || 1}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon as={FiChevronLeft} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Icon as={FiChevronRight} />
        </Button>
      </HStack>
    </Flex>
  );
} 
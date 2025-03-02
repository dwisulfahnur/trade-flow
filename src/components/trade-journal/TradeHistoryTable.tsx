"use client";

import { Card, Flex, Text, Button, Icon, Table, Badge, Box, useBreakpointValue, VStack, Tag, TagLabel } from "@chakra-ui/react";
import { FiFilter, FiArrowUp, FiArrowDown, FiInfo, FiEdit, FiTrash2, FiMoreVertical, FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import UserTradesService, { Trade } from "@/services/supabase/userTrades";
import { useState, useMemo } from "react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@/components/ui/dialog";
import { toaster } from "../ui/toaster";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { SortableHeader } from "./table/SortableHeader";
import { Pagination } from "@/components/trade-journal/table/Pagination";
import { MobileTradeCard } from "@/components/trade-journal/table/MobileTradeCard";
import { TableSkeletons } from "@/components/trade-journal/table/TableSkeletons";
import { FilterDialog, FilterOptions } from "@/components/trade-journal/table/FilterDialog";

// Define sorting types
export type SortField = 'date' | 'symbol' | 'type' | 'pnl';
export type SortDirection = 'asc' | 'desc';

interface TradeHistoryTableProps {
  trades?: Trade[];
  isLoading?: boolean;
  onEditTrade: (trade: Trade) => void;
}

export default function TradeHistoryTable({ onEditTrade }: TradeHistoryTableProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { session } = useSession();
  const tradesService = new UserTradesService(session);
  const queryClient = useQueryClient();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    types: ["buy", "sell"]
  });

  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  // Fetch trades if not provided as props
  const { data: fetchedTrades, isLoading: isLoadingTrades } = useQuery({
    queryKey: ['trades'],
    queryFn: () => tradesService.getTrades({ limit: itemsPerPage, offset: (currentPage - 1) * itemsPerPage }),
  });

  // Use props or fetched data
  const allTrades = fetchedTrades || [];
  const isLoading = isLoadingTrades;

  // Define theme colors
  const colors = {
    cardBg: useColorModeValue("white", "gray.800"),
    borderColor: useColorModeValue("gray.200", "gray.700"),
    primaryText: useColorModeValue("gray.800", "white"),
    secondaryText: useColorModeValue("gray.500", "gray.400"),
    profitText: useColorModeValue("green.500", "green.300"),
    lossText: useColorModeValue("red.500", "red.300"),
    skeletonStartColor: useColorModeValue("gray.100", "gray.700"),
    skeletonEndColor: useColorModeValue("gray.300", "gray.600"),
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Apply filters to trades
  const filteredTrades = useMemo(() => {
    return allTrades.filter(trade => {
      // Filter by symbol
      if (filters.symbol && trade.symbol !== filters.symbol) {
        return false;
      }

      // Filter by type
      if (!filters.types.includes(trade.type)) {
        return false;
      }

      // Filter by P&L range
      if (filters.pnlMin !== undefined && trade.pnl < filters.pnlMin) {
        return false;
      }
      if (filters.pnlMax !== undefined && trade.pnl > filters.pnlMax) {
        return false;
      }

      // Filter by date range
      if (filters.dateFrom) {
        const tradeDate = new Date(trade.date);
        const fromDate = new Date(filters.dateFrom);
        if (tradeDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const tradeDate = new Date(trade.date);
        const toDate = new Date(filters.dateTo);
        // Set time to end of day for inclusive comparison
        toDate.setHours(23, 59, 59, 999);
        if (tradeDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [allTrades, filters]);

  // Sort and paginate trades
  const sortedAndPaginatedTrades = useMemo(() => {
    // First sort the trades
    const sorted = [...filteredTrades].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'symbol') {
        return sortDirection === 'asc'
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      } else if (sortField === 'type') {
        return sortDirection === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      } else if (sortField === 'pnl') {
        return sortDirection === 'asc' ? a.pnl - b.pnl : b.pnl - a.pnl;
      }
      return 0;
    });

    // Then paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTrades, sortField, sortDirection, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);

  // Handle filter application
  const handleApplyFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Remove a single filter
  const handleRemoveFilter = (filterKey: keyof FilterOptions) => {
    const newFilters = { ...filters };

    if (filterKey === 'types') {
      // For types, reset to both buy and sell
      newFilters.types = ['buy', 'sell'];
    } else {
      // For other filters, remove them
      delete newFilters[filterKey];
    }

    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilters({ types: ['buy', 'sell'] });
    setCurrentPage(1);
  };

  const { mutate: deleteTrade, isPending: isDeleting } = useMutation({
    mutationFn: tradesService.deleteTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toaster.create({
        title: 'Trade deleted',
        description: 'Trade deleted successfully',
        type: 'success',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toaster.create({
        title: 'Error deleting trade',
        description: 'Failed to delete trade',
        type: 'error',
      });
    }
  });

  const handleDeleteClick = (id: string) => {
    setTradeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tradeToDelete) {
      deleteTrade(tradeToDelete);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).some(key => {
    if (key === 'types') {
      return filters.types.length !== 2 || !filters.types.includes('buy') || !filters.types.includes('sell');
    }
    return filters[key as keyof FilterOptions] !== undefined;
  });

  return (
    <Card.Root>
      <Card.Header>
        <Flex justifyContent="space-between" alignItems="center" w="full">
          <Text fontWeight="medium" fontSize="lg">Trade History</Text>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Filter trades"
            alignItems="center"
            gap={1}
            onClick={() => setFilterDialogOpen(true)}
            colorPalette={hasActiveFilters ? "blue" : undefined}
          >
            <FiFilter />
            Filter
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body>
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Flex wrap="wrap" gap={2} mb={4}>
            {filters.symbol && (
              <Tag.Root size="sm" borderRadius="full" variant="subtle" colorPalette="blue">
                <Tag.Label>Symbol: {filters.symbol}</Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger onClick={() => handleRemoveFilter('symbol')} />
                </Tag.EndElement>
              </Tag.Root>
            )}

            {(filters.types.length !== 2 || !filters.types.includes('buy') || !filters.types.includes('sell')) && (
              <Tag.Root size="sm" borderRadius="full" variant="subtle" colorPalette="blue">
                <Tag.Label>Type: {filters.types.join(', ')}</Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger onClick={() => handleRemoveFilter('types')} />
                </Tag.EndElement>
              </Tag.Root>
            )}

            {(filters.pnlMin !== undefined || filters.pnlMax !== undefined) && (
              <Tag.Root size="sm" borderRadius="full" variant="subtle" colorPalette="blue">
                <Tag.Label>
                  P&L: {filters.pnlMin !== undefined ? filters.pnlMin : 'min'} to {filters.pnlMax !== undefined ? filters.pnlMax : 'max'}
                </Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger onClick={() => {
                    handleRemoveFilter('pnlMin');
                    handleRemoveFilter('pnlMax');
                  }} />
                </Tag.EndElement>
              </Tag.Root>
            )}

            {(filters.dateFrom || filters.dateTo) && (
              <Tag.Root size="sm" borderRadius="full" variant="subtle" colorPalette="blue">
                <Tag.Label>
                  <Icon as={FiCalendar} mr={1} />
                  {filters.dateFrom ? formatDate(filters.dateFrom) : 'Start'} - {filters.dateTo ? formatDate(filters.dateTo) : 'End'}
                </Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger onClick={() => {
                    handleRemoveFilter('dateFrom');
                    handleRemoveFilter('dateTo');
                  }} />
                </Tag.EndElement>
              </Tag.Root>
            )}

            <Button
              size="xs"
              variant="ghost"
              onClick={handleClearAllFilters}
            >
              Clear All
            </Button>
          </Flex>
        )}

        {isLoading ? (
          // Show skeleton loaders while loading
          isMobile ?
            <TableSkeletons isMobile={true} colors={colors} /> :
            <Box overflowX="auto"><TableSkeletons isMobile={false} colors={colors} /></Box>
        ) : filteredTrades.length === 0 ? (
          // Show empty state when no trades
          <Flex direction="column" alignItems="center" justifyContent="center" py={10} gap={2}>
            <Icon as={FiInfo} boxSize={10} color={colors.secondaryText} />
            <Text color={colors.secondaryText}>No trades found</Text>
            <Text fontSize="sm" color={colors.secondaryText}>
              {hasActiveFilters
                ? "Try adjusting your filters to see more results"
                : "Add your first trade to get started"}
            </Text>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAllFilters}
                mt={2}
              >
                Clear Filters
              </Button>
            )}
          </Flex>
        ) : (
          // Show trades when data is loaded
          isMobile ? (
            <VStack align="stretch" spaceY={3}>
              {sortedAndPaginatedTrades.map(trade => (
                <MobileTradeCard
                  key={trade.id}
                  trade={trade}
                  colors={colors}
                  formatDate={formatDate}
                  onEditTrade={onEditTrade}
                  onDeleteTrade={handleDeleteClick}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                itemsPerPage={itemsPerPage}
              />
            </VStack>
          ) : (
            <Box overflowX="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <SortableHeader
                      label="Date"
                      field="date"
                      currentSort={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Symbol"
                      field="symbol"
                      currentSort={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Type"
                      field="type"
                      currentSort={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                    <SortableHeader
                      label="P&L"
                      field="pnl"
                      currentSort={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <Table.ColumnHeader>Notes</Table.ColumnHeader>
                    <Table.ColumnHeader width="60px"></Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedAndPaginatedTrades.map(trade => (
                    <Table.Row key={trade.id}>
                      <Table.Cell>
                        <Text fontSize="sm">{formatDate(trade.date)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontWeight="medium">{trade.symbol}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex alignItems="center" gap={1}>
                          <Icon
                            as={trade.type === 'buy' ? FiArrowUp : FiArrowDown}
                            color={trade.type === 'buy' ? 'green.500' : 'red.500'}
                          />
                          <Badge colorPalette={trade.type === 'buy' ? 'green' : 'red'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm">
                          Entry: {trade.entry_price ? trade.entry_price.toFixed(2) : 'N/A'}
                        </Text>
                        <Text fontSize="sm">
                          Exit: {trade.exit_price ? trade.exit_price.toFixed(2) : 'N/A'}
                        </Text>
                        {trade.fee && (
                          <Text fontSize="sm" color={colors.secondaryText}>
                            Fee: {trade.fee.toFixed(2)}
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Text
                          fontWeight="medium"
                          color={trade.pnl >= 0 ? colors.profitText : colors.lossText}
                        >
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell maxW="300px">
                        <Text truncate fontSize="sm">{trade.notes}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <MenuRoot positioning={{ placement: 'left-start' }} size="sm">
                          <MenuTrigger asChild>
                            <Button size="xs" variant="ghost" p={1} minW="auto" h="auto">
                              <Icon as={FiMoreVertical} boxSize={3} />
                            </Button>
                          </MenuTrigger>
                          <MenuContent>
                            <MenuItem onClick={() => onEditTrade(trade)} value="edit">
                              <Icon as={FiEdit} mr={2} boxSize={3} />
                              <Text fontSize="xs">Edit</Text>
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteClick(trade.id!)} value="delete" colorPalette="red">
                              <Icon as={FiTrash2} mr={2} boxSize={3} />
                              <Text fontSize="xs">Delete</Text>
                            </MenuItem>
                          </MenuContent>
                        </MenuRoot>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                itemsPerPage={itemsPerPage}
              />
            </Box>
          )
        )}

        {/* Filter Dialog */}
        <FilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          onApplyFilter={handleApplyFilter}
          currentFilters={filters}
          trades={allTrades}
        />

        {/* Delete Confirmation Dialog */}
        <DialogRoot open={deleteDialogOpen} onOpenChange={(details) => setDeleteDialogOpen(details.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Trade</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>Are you sure you want to delete this trade? This action cannot be undone.</Text>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogActionTrigger>
              <Button
                colorPalette="red"
                size="sm"
                onClick={confirmDelete}
                loading={isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Card.Body>
    </Card.Root>
  );
} 
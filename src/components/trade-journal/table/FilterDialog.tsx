import { useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger
} from "@/components/ui/dialog";
import {
  Button,
  Flex,
  Input,
  VStack,
  HStack,
  Text,
  Box,
  NativeSelect
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Trade } from "@/services/supabase/userTrades";

export interface FilterOptions {
  symbol?: string;
  types: string[];
  pnlMin?: number;
  pnlMax?: number;
  dateFrom?: string;
  dateTo?: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  trades: Trade[];
}

export function FilterDialog({
  open,
  onOpenChange,
  onApplyFilter,
  currentFilters,
  trades
}: FilterDialogProps) {
  // Initialize state with current filters
  const [symbol, setSymbol] = useState(currentFilters.symbol || "");
  const [types, setTypes] = useState<string[]>(currentFilters.types || ["buy", "sell"]);
  const [pnlMin, setPnlMin] = useState<string>(
    currentFilters.pnlMin !== undefined ? currentFilters.pnlMin.toString() : ""
  );
  const [pnlMax, setPnlMax] = useState<string>(
    currentFilters.pnlMax !== undefined ? currentFilters.pnlMax.toString() : ""
  );
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom || "");
  const [dateTo, setDateTo] = useState(currentFilters.dateTo || "");

  // Get unique symbols from trades for dropdown
  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.symbol)));

  // Handle type checkbox changes
  const handleTypeChange = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  // Handle filter application
  const handleApplyFilter = () => {
    onApplyFilter({
      symbol: symbol || undefined,
      types,
      pnlMin: pnlMin ? parseFloat(pnlMin) : undefined,
      pnlMax: pnlMax ? parseFloat(pnlMax) : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined
    });
    onOpenChange(false);
  };

  // Handle filter reset
  const handleResetFilter = () => {
    setSymbol("");
    setTypes(["buy", "sell"]);
    setPnlMin("");
    setPnlMax("");
    setDateFrom("");
    setDateTo("");

    onApplyFilter({
      types: ["buy", "sell"]
    });
    onOpenChange(false);
  };

  return (
    <DialogRoot open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Trades</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack spaceY={4} align="stretch">
            {/* Symbol Filter */}
            <Field label="Symbol">
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                >
                  <option value="">All Symbols</option>
                  {uniqueSymbols.map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field>

            {/* Trade Type Filter */}
            <Field label="Trade Type">
              <HStack>
                <Checkbox
                  checked={types.includes("buy")}
                  onChange={() => handleTypeChange("buy")}
                >
                  Buy
                </Checkbox>
                <Checkbox
                  checked={types.includes("sell")}
                  onChange={() => handleTypeChange("sell")}
                >
                  Sell
                </Checkbox>
              </HStack>
            </Field>

            {/* P&L Range Filter */}
            <Field label="P&L Range (Optional)">
              <HStack>
                <Field label="Min P&L">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={pnlMin}
                    onChange={(e) => setPnlMin(e.target.value)}
                  />
                </Field>
                <Field label="Max P&L">
                  <Input
                    type="number"
                    placeholder="Max"
                    value={pnlMax}
                    onChange={(e) => setPnlMax(e.target.value)}
                  />
                </Field>
              </HStack>
            </Field>

            {/* Date Range Filter */}
            <Field label="Date Range">
              <HStack>
                <Field label="From">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Field>
                <Field label="To">
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </Field>
              </HStack>
            </Field>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={handleResetFilter}>
            Reset
          </Button>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
} 
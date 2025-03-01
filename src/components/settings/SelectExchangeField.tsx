import { SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { createListCollection, SelectContent, SelectItem } from "@chakra-ui/react";

interface SelectExchangeFieldProps {
  value: string
  onChange: (value: string) => void
}

export default function SelectExchangeField({ value, onChange }: SelectExchangeFieldProps) {
  const exchanges = createListCollection({
    items: [
      { label: 'Binance', value: 'binance' },
      { label: 'Bybit', value: 'bybit' },
      { label: 'OKX', value: 'okx' },
    ]
  });
  return (
    <SelectRoot
      value={[value]}
      multiple={false}
      collection={exchanges}
      onValueChange={v => v.value && onChange(v.value[0])}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select Exchange" />
      </SelectTrigger>
      <SelectContent>
        {exchanges.items.map((exchange) => (
          <SelectItem item={exchange} key={exchange.value}>
            {exchange.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
} 
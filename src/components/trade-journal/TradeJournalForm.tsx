"use client";

import {
  Button,
  Field,
  Input,
  Text,
  VStack,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { RadioGroup, Radio } from "../ui/radio";

interface TradeJournalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function TradeJournalForm({ open, onClose, onSubmit }: TradeJournalFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<{
    date: string,
    symbol: string
    type: 'buy' | 'sell'
    amount: number
    entryPrice: number
    exitPrice: number
    notes: string
  }>();

  const handleFormSubmit = (data: any) => {
    // Calculate PnL
    const amount = parseFloat(data.amount);
    const entryPrice = parseFloat(data.entryPrice);
    const exitPrice = parseFloat(data.exitPrice);

    let pnl = 0;
    if (data.type === 'buy') {
      pnl = (exitPrice - entryPrice) * amount;
    } else {
      pnl = (entryPrice - exitPrice) * amount;
    }

    onSubmit({
      ...data,
      amount: parseFloat(data.amount),
      entryPrice: parseFloat(data.entryPrice),
      exitPrice: parseFloat(data.exitPrice),
      pnl: parseFloat(pnl.toFixed(2))
    });

    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Trade</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack spaceY={4} align="stretch">
              <Field.Root invalid={!!errors.date}>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Date</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && <Field.ErrorText>{errors.date.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.symbol}>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Symbol</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="BTC/USDT"
                  {...register('symbol', { required: 'Symbol is required' })}
                />
                {errors.symbol && <Field.ErrorText>{errors.symbol.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Trade Type</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                    >
                      <HStack spaceX={4}>
                        <Radio value="buy">Buy (Long)</Radio>
                        <Radio value="sell">Sell (Short)</Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />
              </Field.Root>

              <Field.Root invalid={!!errors.amount}>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Amount</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.5"
                  {...register('amount', {
                    required: 'Amount is required',
                    valueAsNumber: true,
                    validate: value => value > 0 || 'Amount must be greater than 0'
                  })}
                />
                {errors.amount && <Field.ErrorText>{errors.amount.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.entryPrice}>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Entry Price</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="42000"
                  {...register('entryPrice', {
                    required: 'Entry price is required',
                    valueAsNumber: true,
                    validate: value => value > 0 || 'Price must be greater than 0'
                  })}
                />
                {errors.entryPrice && <Field.ErrorText>{errors.entryPrice.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.exitPrice}>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Exit Price</Text>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="43000"
                  {...register('exitPrice', {
                    required: 'Exit price is required',
                    valueAsNumber: true,
                    validate: value => value > 0 || 'Price must be greater than 0'
                  })}
                />
                {errors.exitPrice && <Field.ErrorText>{errors.exitPrice.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root>
                <Field.Label>
                  <Text fontSize="sm" fontWeight="medium">Notes</Text>
                </Field.Label>
                <Textarea
                  placeholder="Why did you take this trade? What was your strategy?"
                  rows={3}
                  {...register('notes')}
                />
              </Field.Root>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button colorPalette="red" variant="surface" size="xs">Cancel</Button>
            </DialogActionTrigger>
            <Button type="submit" colorPalette="blue" variant="surface" size="xs">Save Trade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
} 
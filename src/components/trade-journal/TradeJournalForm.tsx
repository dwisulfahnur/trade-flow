"use client";

import {
  Button,
  Input,
  VStack,
  Textarea,
  NativeSelect,
  HStack,
  Text,
  Box,
  SimpleGrid,
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
import { Field } from "../ui/field";
import { NumberInputField, NumberInputRoot } from "../ui/number-input";
import { Checkbox } from "../ui/checkbox";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toaster } from "../ui/toaster";
import UserTradesService, { Trade, TradeInput } from "@/services/supabase/userTrades";
import { useColorModeValue } from "@/components/ui/color-mode";

interface TradeJournalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: Trade;
}

export default function TradeJournalForm({ open, onClose, initialData }: TradeJournalFormProps) {
  const { session } = useSession();
  const tradesService = new UserTradesService(session);
  const queryClient = useQueryClient();

  // State to track if detailed fields should be shown
  const [showDetailedFields, setShowDetailedFields] = useState(false);

  // Theme colors
  const hintColor = useColorModeValue("gray.500", "gray.400");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TradeInput & { fee?: number }>({
    defaultValues: {
      symbol: '',
      type: 'buy',
      amount: undefined,
      entry_price: undefined,
      exit_price: undefined,
      pnl: 0,
      fee: undefined,
      notes: '',
      date: new Date().toISOString().split('T')[0],
    }
  });

  // Watch values for calculation
  const watchType = watch('type');
  const watchAmount = watch('amount');
  const watchEntryPrice = watch('entry_price');
  const watchExitPrice = watch('exit_price');
  const watchFee = watch('fee');

  // Set form values when editing
  useEffect(() => {
    if (initialData) {
      setValue('symbol', initialData.symbol);
      setValue('type', initialData.type);
      setValue('amount', initialData.amount);
      setValue('entry_price', initialData.entry_price);
      setValue('exit_price', initialData.exit_price);
      setValue('pnl', initialData.pnl);
      setValue('fee', initialData.fee);
      setValue('notes', initialData.notes || '');
      setValue('date', initialData.date);

      // If any of the detailed fields have values, show the detailed section
      if (initialData.amount || initialData.entry_price || initialData.exit_price || initialData.fee) {
        setShowDetailedFields(true);
      }
    }
  }, [initialData, setValue]);

  // Calculate PnL when detailed fields change
  useEffect(() => {
    if (showDetailedFields && watchAmount && watchEntryPrice && watchExitPrice) {
      let calculatedPnl = 0;

      if (watchType === 'buy') {
        calculatedPnl = (watchExitPrice - watchEntryPrice) * watchAmount;
      } else {
        calculatedPnl = (watchEntryPrice - watchExitPrice) * watchAmount;
      }

      // Subtract fee if provided
      if (watchFee) {
        calculatedPnl -= watchFee;
      }

      setValue('pnl', calculatedPnl);
    }
  }, [watchType, watchAmount, watchEntryPrice, watchExitPrice, watchFee, showDetailedFields, setValue]);

  const handleClose = () => {
    reset();
    setShowDetailedFields(false);
    onClose();
  };

  const { mutate: createTrade, isPending: isCreatingTrade } = useMutation({
    mutationFn: (data: TradeInput & { fee?: number }) => {
      // Extract fee from the form data
      const { fee, ...tradeData } = data;

      // Add fee to the database if provided
      if (fee !== undefined) {
        return tradesService.createTrade({
          ...tradeData,
          fee
        });
      }

      return tradesService.createTrade(tradeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toaster.create({
        title: 'Trade created',
        description: 'Trade created successfully',
        type: 'success',
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      toaster.create({
        title: 'Error creating trade',
        description: 'Failed to create trade',
        type: 'error',
      });
    }
  });

  const { mutate: updateTrade, isPending: isUpdatingTrade } = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TradeInput> & { fee?: number } }) => {
      // Extract fee from the form data
      const { fee, ...tradeData } = data;

      // Add fee to the database if provided
      if (fee !== undefined) {
        return tradesService.updateTrade(id, {
          ...tradeData,
          fee
        });
      }

      return tradesService.updateTrade(id, tradeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toaster.create({
        title: 'Trade updated',
        description: 'Trade updated successfully',
        type: 'success',
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      toaster.create({
        title: 'Error updating trade',
        description: 'Failed to update trade',
        type: 'error',
      });
    }
  });

  const onFormSubmit = (data: TradeInput & { fee?: number }) => {
    if (initialData?.id) {
      updateTrade({ id: initialData.id, data });
    } else {
      createTrade(data);
    }
  };

  return (
    <>
      <DialogRoot open={open} onOpenChange={(details) => !details.open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <DialogBody>
              <VStack spaceY={4} align="stretch">
                <Field
                  label="Symbol"
                  invalid={!!errors.symbol}
                  errorText={errors.symbol?.message?.toString()}
                >
                  <Input
                    {...register('symbol', { required: 'Symbol is required' })}
                    placeholder="BTC/USDT"
                  />
                </Field>

                <Field
                  label="Type"
                  invalid={!!errors.type}
                  errorText={errors.type?.message?.toString()}
                >
                  <NativeSelect.Root {...register('type', { required: 'Type is required' })}>
                    <NativeSelect.Field>
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field>

                <Field>
                  <Checkbox
                    checked={showDetailedFields}
                    onCheckedChange={(e) => setShowDetailedFields(!!e.checked)}
                  >
                    Add detailed trade information
                  </Checkbox>
                </Field>

                {showDetailedFields && (
                  <Box
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderStyle="dashed"
                  >
                    <SimpleGrid columns={2} gap={3}>
                      <Field
                        label="Entry Price"
                        invalid={!!errors.entry_price}
                        errorText={errors.entry_price?.message?.toString()}
                      >
                        <NumberInputRoot min={0} size='sm'>
                          <NumberInputField
                            {...register('entry_price', {
                              valueAsNumber: true,
                              min: { value: 0, message: 'Entry price must be positive' }
                            })}
                            placeholder="Optional"
                          />
                        </NumberInputRoot>
                      </Field>

                      <Field
                        label="Exit Price"
                        invalid={!!errors.exit_price}
                        errorText={errors.exit_price?.message?.toString()}
                      >
                        <NumberInputRoot min={0} size='sm'>
                          <NumberInputField
                            {...register('exit_price', {
                              valueAsNumber: true,
                              min: { value: 0, message: 'Exit price must be positive' }
                            })}
                            placeholder="Optional"
                          />
                        </NumberInputRoot>
                      </Field>

                      <Field
                        label="Amount"
                        invalid={!!errors.amount}
                        errorText={errors.amount?.message?.toString()}
                      >
                        <NumberInputRoot min={0} size='sm'>
                          <NumberInputField
                            {...register('amount', {
                              valueAsNumber: true,
                              min: { value: 0, message: 'Amount must be positive' }
                            })}
                            placeholder="Optional"
                          />
                        </NumberInputRoot>
                      </Field>

                      <Field
                        label="Fee"
                        invalid={!!errors.fee}
                        errorText={errors.fee?.message?.toString()}
                      >
                        <NumberInputRoot min={0} size='sm'>
                          <NumberInputField
                            {...register('fee', {
                              valueAsNumber: true,
                              min: { value: 0, message: 'Fee must be positive' }
                            })}
                            placeholder="Optional"
                          />
                        </NumberInputRoot>
                      </Field>
                    </SimpleGrid>
                  </Box>
                )}

                <Field
                  label="P&L"
                  invalid={!!errors.pnl}
                  errorText={errors.pnl?.message?.toString()}
                >
                  <NumberInputRoot>
                    <NumberInputField
                      {...register('pnl', {
                        required: 'P&L is required',
                        valueAsNumber: true,
                      })}
                      disabled={!!(showDetailedFields && watchAmount && watchEntryPrice && watchExitPrice)}
                    />
                  </NumberInputRoot>
                  {showDetailedFields && watchAmount && watchEntryPrice && watchExitPrice && (
                    <Text fontSize="xs" color={hintColor} mt={1}>
                      P&L is calculated automatically from trade details
                    </Text>
                  )}
                </Field>

                <Field
                  label="Date"
                  invalid={!!errors.date}
                  errorText={errors.date?.message?.toString()}
                >
                  <Input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                  />
                </Field>

                <Field
                  label="Notes"
                  invalid={!!errors.notes}
                  errorText={errors.notes?.message?.toString()}
                >
                  <Textarea
                    {...register('notes')}
                    placeholder="Add your trade notes here..."
                    rows={3}
                  />
                </Field>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button colorPalette={"white"} variant={'solid'} size={'xs'}>Cancel</Button>
              </DialogActionTrigger>
              <Button
                type="submit"
                colorPalette={"blue"}
                variant={'solid'}
                size={'xs'}
                loading={isCreatingTrade || isUpdatingTrade}
              >
                {initialData ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
      <Toaster />
    </>
  );
} 
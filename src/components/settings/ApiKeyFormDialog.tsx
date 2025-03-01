"use client";

import { Button, Input, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Field } from "@/components/ui/field";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toaster } from "../ui/toaster";
import { Database } from "@/types/database.types";
import SelectExchangeField from "./SelectExchangeField";
import ApiKeysService from "@/services/supabase/apiKeys";

interface ApiKeyFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Database['public']['Tables']['api_keys']['Row'];
}

export default function ApiKeyFormDialog({ open, onClose, initialData }: ApiKeyFormDialogProps) {
  const { session } = useSession();
  const apiKeysService = new ApiKeysService(session);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm<{
    exchange: string,
    apiKey: string,
    secretKey: string,
  }>({
    defaultValues: {
      exchange: '',
      apiKey: '',
      secretKey: '',
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (initialData) {
      setValue('exchange', initialData.exchange);
      setValue('apiKey', initialData.api_key);
      setValue('secretKey', initialData.api_secret);
    }
  }, [initialData, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const queryClient = useQueryClient();
  const { mutate: createApiKey, isPending: isCreatingApiKey } = useMutation({
    mutationFn: apiKeysService.createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toaster.create({
        title: 'API Key created',
        description: 'API Key created successfully',
        type: 'success',
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      toaster.create({
        title: 'Error creating API Key',
        description: 'Failed to create API Key',
        type: 'error',
      });
    }
  });

  const { mutate: updateApiKey, isPending: isUpdatingApiKey } = useMutation({
    mutationFn: apiKeysService.updateApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toaster.create({
        title: 'API Key updated',
        description: 'API Key updated successfully',
        type: 'success',
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      toaster.create({
        title: 'Error updating API Key',
        description: 'Failed to update API Key',
        type: 'error',
      });
    }
  });

  const onSubmit = (data: {
    exchange: string;
    apiKey: string;
    secretKey: string;
  }) => {
    if (initialData) {
      updateApiKey({ id: initialData.id, ...data });
    } else {
      createApiKey(data);
    }
  };

  return (
    <>
      <DialogRoot open={open} onOpenChange={handleClose} closeOnInteractOutside={false} closeOnEscape={false}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{initialData ? 'Edit API Key' : 'Add API Key'}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <VStack spaceY={4} align="stretch">
                <Field
                  label="Exchange"
                  invalid={!!errors.exchange}
                  errorText={errors.exchange?.message?.toString()}
                >
                  <Controller
                    name="exchange"
                    control={control}
                    rules={{ required: 'Exchange is required' }}
                    render={({ field }) => (
                      <SelectExchangeField
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Field>
                <Field invalid={!!errors.apiKey} label="API Key" errorText={errors.apiKey?.message?.toString()}>
                  <Input {...register('apiKey', { required: 'API Key is required' })} />
                </Field>
                <Field invalid={!!errors.secretKey} label="Secret Key" errorText={errors.secretKey?.message?.toString()}>
                  <Input {...register('secretKey', { required: 'Secret Key is required' })} />
                </Field>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button colorPalette={"white"} variant={'solid'} size={'xs'}>Cancel</Button>
              </DialogActionTrigger>
              <Button type="submit" colorPalette={"blue"} variant={'solid'} size={'xs'} loading={isCreatingApiKey || isUpdatingApiKey}>
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
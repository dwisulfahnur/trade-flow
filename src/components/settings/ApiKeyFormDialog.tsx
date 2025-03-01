import { Button, DialogBackdrop, Field, Input, Text, VStack, createListCollection } from "@chakra-ui/react";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@/components/ui/select";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";

interface ApiKeyFormDialogProps {
  open: boolean
  onClose: () => void
}

export default function ApiKeyFormDialog({ open, onClose }: ApiKeyFormDialogProps) {
  const exchanges = createListCollection({
    items: [
      { label: 'Binance', value: 'binance' },
      { label: 'Bybit', value: 'bybit' },
      { label: 'OKX', value: 'okx' },
    ]
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
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
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: {
    exchange: string
    apiKey: string
    secretKey: string
  }) => {
    console.log(data)
    handleClose()
  }

  return (
    <DialogRoot
      motionPreset={'slide-in-top'}
      placement={'top'}
      open={open}
      closeOnEscape={false}
      scrollBehavior={'inside'}
      onOpenChange={handleClose}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent as='form' onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack spaceY={4}>
            <Field.Root invalid={!!errors.exchange}>
              <Field.Label>
                <Text fontSize={'sm'} fontWeight={'medium'}>Exchange</Text>
                <Field.RequiredIndicator />
              </Field.Label>
              <Controller
                control={control}
                name="exchange"
                render={({ field }) => (
                  <SelectRoot
                    name={field.name}
                    multiple={false}
                    value={[field.value]}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                    collection={exchanges}
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
                )}
              />
            </Field.Root>
            <Field.Root invalid={!!errors.apiKey}>
              <Field.Label>
                <Text fontSize={'sm'} fontWeight={'medium'}>API Key</Text>
                <Field.RequiredIndicator />
              </Field.Label>
              <Input {...register('apiKey', { required: 'API Key is required' })} />
              {errors.apiKey && <Field.ErrorText>{errors.apiKey.message}</Field.ErrorText>}
            </Field.Root>
            <Field.Root invalid={!!errors.secretKey}>
              <Field.Label>
                <Text fontSize={'sm'} fontWeight={'medium'}>Secret Key</Text>
                <Field.RequiredIndicator />
              </Field.Label>
              <Input {...register('secretKey', { required: 'Secret Key is required' })} />
              {errors.secretKey && <Field.ErrorText>{errors.secretKey.message}</Field.ErrorText>}
            </Field.Root>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette={"red"} variant={'surface'} size={'xs'}>Cancel</Button>
          </DialogActionTrigger>
          <Button type="submit" colorPalette={"blue"} variant={'surface'} size={'xs'}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
} 
import { Center, Spinner } from "@chakra-ui/react"

export default function Loading() {
  return (
    <Center minH={'100vh'} w={'full'}>
      <Spinner size="lg" />
    </Center>
  )
}
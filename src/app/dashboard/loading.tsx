import { Center, Spinner } from "@chakra-ui/react"

export default function DashboardLoading() {
  return (
    <Center minH={'100vh'} w={'full'}>
      <Spinner size="lg" />
    </Center>
  )
}
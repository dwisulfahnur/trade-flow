"use client"

import { Box, Button, Center, Container, Flex, Heading, Text, Card, SimpleGrid, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { LuChartLine, LuLock, LuLayers, LuBookOpen } from "react-icons/lu";
import { BsLightning } from "react-icons/bs";
import { HiOutlineDocument } from "react-icons/hi";
import Navbar from "@/components/common/Navbar";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";

const FEATURES = [
  {
    icon: LuChartLine,
    title: 'Performance Analytics',
    description: 'Visualize your trading performance with advanced charts and metrics that help identify patterns.',
  },
  {
    icon: LuLayers,
    title: 'Multi-Exchange Support',
    description: 'Connect with all major exchanges including Binance, Bybit, OKX and more.',
  },
  {
    icon: LuLock,
    title: 'Secure and Private',
    description: 'Your data is yours to keep. We never sell your data to third parties.',
  },
  {
    icon: BsLightning,
    title: 'Real-time Trackin',
    description: 'Keep tabs on your open positions and get insights as the market moves.',
  },
  {
    icon: HiOutlineDocument,
    title: 'Detailed Reports',
    description: 'Get detailed reports on your trading performance and identify areas for improvement.',
  },
  {
    icon: LuBookOpen,
    title: 'Trade Journal',
    description: 'Keep track of your trading ideas and strategies in one place.',
  }
]

export default function IndexPage() {
  return (
    <>
      <Navbar />
      <Box pt={'70px'}>
        <Center flexDirection={'column'} gap={1} w='full' h='calc(100vh - 300px)'>
          <Container maxW={'container.xl'}>
            <Flex flexDirection={'column'} gap={2} justifyContent={'center'} alignItems={'center'}>
              <Text fontSize={'6xl'} fontWeight={500} textAlign={'center'}>Track Your Trades Smarter</Text>
              <Text fontSize={'2xl'} fontWeight={400} color={'gray.500'} maxW={'600px'} textAlign={'center'}>TradeFlow is a tool that helps you track your trades and optimize your profits.</Text>
              <Flex justifyContent={'center'} gap={4} mt={4}>
                <Button alignItems={'center'} gap={2} px={8}>
                  Get Started for Free
                  <Icon as={FiArrowRight} />
                </Button>
                <Button variant={'outline'} alignItems={'center'} gap={2} px={8}>
                  Learn More
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Center>
        <Center flexDirection={'column'} w='full' minH='calc(100vh - 200px)'>
          <Container maxW={'container.xl'}>
            <VStack gap={4} alignItems={'center'}>
              <Heading fontSize={'4xl'} fontWeight={500} textAlign={'center'}>Powerful Features for Traders</Heading>
              <Text fontSize={'xl'} fontWeight={400} color={'gray.500'} textAlign={'center'} maxW={'800px'}>Everything you need to analyze and improve your trading performance in one place.</Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} gap={8} mt={12}>
              {FEATURES.map((feature, index) => (
                <Card.Root key={index} boxShadow={'lg'}>
                  <Card.Header justifyContent={'center'} alignItems={'center'} gap={4}>
                    <Icon as={feature.icon} w={10} h={10} />
                    <Heading fontSize={'1xl'} fontWeight={500} textAlign={'center'}>{feature.title}</Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize={'md'} fontWeight={400} color={'gray.500'} maxW={'600px'} textAlign={'center'}>Visualize your trading performance with advanced charts and metrics that help identify patterns.</Text>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Container>
        </Center>
        <Center flexDirection={'column'} gap={1} w='full' h='300px' bg={useColorModeValue('gray.800', 'gray.200')}>
          <Container maxW={'container.xl'}>
            <VStack gap={4} alignItems={'center'}>
              <Heading fontSize={'4xl'} fontWeight={500} textAlign={'center'} color={useColorModeValue('gray.200', 'gray.500')}>Ready to Improve Your Trading?</Heading>
              <Text fontSize={'xl'} fontWeight={400} color={useColorModeValue('gray.200', 'gray.500')} textAlign={'center'}>Join the thousands of traders who have already improved their trading performance with TradeFlow.</Text>
              <Button variant={'outline'} bg={useColorModeValue('gray.200', 'gray.900')} alignItems={'center'} gap={2} px={8}>
                Get Started Now
                <Icon as={FiArrowRight} />
              </Button>
            </VStack>
          </Container>
        </Center>
      </Box>
    </>
  )
}
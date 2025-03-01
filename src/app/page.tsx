"use client"

import { Box, Button, Center, Container, Flex, Heading, Text, Card, SimpleGrid, VStack, HStack, Icon, Link, Separator } from "@chakra-ui/react";
import { FiArrowRight, FiGithub, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";
import { Icon as ChakraIcon } from "@chakra-ui/react";
import { LuChartLine, LuLock, LuLayers, LuBookOpen } from "react-icons/lu";
import { BsLightning } from "react-icons/bs";
import { HiOutlineDocument } from "react-icons/hi";
import { useColorModeValue } from "@/components/ui/color-mode";
import Navbar from "@/components/common/Navbar";
import NextLink from "next/link";

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
    title: 'Real-time Tracking',
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

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'FAQ', href: '/faq' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API', href: '/api' },
      { label: 'Guides', href: '/guides' },
      { label: 'Support', href: '/support' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
    ]
  }
]

export default function IndexPage() {
  const footerBg = useColorModeValue('gray.50', 'gray.900');
  const footerBorderColor = useColorModeValue('gray.200', 'gray.700');
  const footerTextColor = useColorModeValue('gray.600', 'gray.400');
  const footerHeadingColor = useColorModeValue('gray.700', 'gray.300');

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
                <Button alignItems={'center'} gap={2} px={8} asChild>
                  <NextLink href={'/auth/sign-in'}>
                    Get Started for Free
                    <ChakraIcon as={FiArrowRight} />
                  </NextLink>
                </Button>
                <Button variant={'outline'} alignItems={'center'} gap={2} px={8}>
                  Learn More
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Center>
        <Center flexDirection={'column'} w='full' minH='calc(100vh - 200px)' id="features">
          <Container maxW={'container.xl'}>
            <VStack gap={4} alignItems={'center'}>
              <Heading fontSize={'4xl'} fontWeight={500} textAlign={'center'}>Powerful Features for Traders</Heading>
              <Text fontSize={'xl'} fontWeight={400} color={'gray.500'} textAlign={'center'} maxW={'800px'}>Everything you need to analyze and improve your trading performance in one place.</Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} gap={8} mt={12}>
              {FEATURES.map((feature, index) => (
                <Card.Root key={index} boxShadow={'lg'}>
                  <Card.Header justifyContent={'center'} alignItems={'center'} gap={4}>
                    <ChakraIcon as={feature.icon} w={10} h={10} />
                    <Heading fontSize={'1xl'} fontWeight={500} textAlign={'center'}>{feature.title}</Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text fontSize={'md'} fontWeight={400} color={'gray.500'} maxW={'600px'} textAlign={'center'}>
                      {feature.description}
                    </Text>
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
              <NextLink href={'/auth/sign-in'}>
                <Button variant={'outline'} bg={useColorModeValue('gray.200', 'gray.900')} alignItems={'center'} gap={2} px={8}>
                  Get Started Now
                  <ChakraIcon as={FiArrowRight} />
                </Button>
              </NextLink>
            </VStack>
          </Container>
        </Center>

        {/* Footer */}
        <Box as="footer" bg={footerBg} borderTopWidth="1px" borderColor={footerBorderColor}>
          <Container maxW="container.xl" py={10}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={8} mb={10}>
              {FOOTER_LINKS.map((group) => (
                <VStack key={group.title} align="flex-start" gap={3}>
                  <Text fontWeight="600" fontSize="md" color={footerHeadingColor}>
                    {group.title}
                  </Text>
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      fontSize="sm"
                      color={footerTextColor}
                      _hover={{ color: 'blue.500' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </VStack>
              ))}
            </SimpleGrid>

            <Separator mb={6} borderColor={footerBorderColor} />

            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align={{ base: 'center', md: 'center' }}
              gap={4}
            >
              <Flex align="center" gap={2}>
                <ChakraIcon as={LuChartLine} w={6} h={6} />
                <Text fontWeight="bold" fontSize="lg">TradeFlow</Text>
              </Flex>

              <HStack spaceX={4}>
                <Link href="https://github.com" target="_blank">
                  <ChakraIcon as={FiGithub} w={5} h={5} color={footerTextColor} />
                </Link>
                <Link href="https://twitter.com" target="_blank">
                  <ChakraIcon as={FiTwitter} w={5} h={5} color={footerTextColor} />
                </Link>
                <Link href="https://linkedin.com" target="_blank">
                  <ChakraIcon as={FiLinkedin} w={5} h={5} color={footerTextColor} />
                </Link>
                <Link href="https://instagram.com" target="_blank">
                  <ChakraIcon as={FiInstagram} w={5} h={5} color={footerTextColor} />
                </Link>
              </HStack>

              <Text fontSize="sm" color={footerTextColor}>
                © {new Date().getFullYear()} TradeFlow. All rights reserved.
              </Text>
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  )
}
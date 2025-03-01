"use client"

import AuthenticatedNavbar from "@/components/common/AuthenticatedNavbar";
import { Box, Container, Flex, HStack, Icon, Link, Text } from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment, useEffect } from "react";
import { FiGithub, FiTwitter, FiLinkedin, FiHelpCircle } from "react-icons/fi";
import { LuChartLine } from "react-icons/lu";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  // Theme colors for footer
  const footerBg = useColorModeValue('gray.50', 'gray.900');
  const footerBorderColor = useColorModeValue('gray.200', 'gray.700');
  const footerTextColor = useColorModeValue('gray.600', 'gray.400');
  const footerHeadingColor = useColorModeValue('gray.700', 'gray.300');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/auth/sign-in')
    }
  }, [isSignedIn, isLoaded])

  return (
    <Fragment>
      <AuthenticatedNavbar />
      <Box pt={'70px'} w='full' minH='calc(100vh - 140px)'>
        {children}
      </Box>

      {/* Dashboard Footer */}
      <Box as="footer" bg={footerBg} borderTopWidth="1px" borderColor={footerBorderColor}>
        <Container maxW="container.xl" py={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'center', md: 'center' }}
            gap={{ base: 3, md: 0 }}
          >
            <Flex align="center" gap={2}>
              <Icon as={LuChartLine} w={5} h={5} />
              <Text fontWeight="medium" fontSize="sm">TradeFlow</Text>
            </Flex>

            <HStack spaceX={4}>
              <Link href="https://github.com" target="_blank">
                <Icon as={FiGithub} w={4} h={4} color={footerTextColor} />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <Icon as={FiTwitter} w={4} h={4} color={footerTextColor} />
              </Link>
              <Link href="https://linkedin.com" target="_blank">
                <Icon as={FiLinkedin} w={4} h={4} color={footerTextColor} />
              </Link>
              <Link href="/help" display="flex" alignItems="center" gap={1}>
                <Icon as={FiHelpCircle} w={4} h={4} color={footerTextColor} />
                <Text fontSize="xs" color={footerTextColor}>Help</Text>
              </Link>
            </HStack>

            <Text fontSize="xs" color={footerTextColor}>
              © {new Date().getFullYear()} TradeFlow. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Fragment>
  )
}
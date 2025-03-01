"use client"

import { Box, Button, Flex, Link, Icon, Text, Container } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import NextLink from "next/link";
import UserSettings from "../user/UserSettings";
import { FaRegChartBar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BiBook, BiPieChart } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useColorModeValue } from "@/components/ui/color-mode";
const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: BiPieChart },
  { label: 'Trade Journal', href: '/dashboard/trade-journal', icon: BiBook },
]

export default function AuthenticatedNavbar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const bgColor = useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(26, 26, 26, 0.2)");
  return (
    <Box
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={10}
      w={'full'}
      p={4}
      bg={isScrolled ? bgColor : "transparent"}
      backdropFilter={isScrolled ? "blur(12px)" : "none"}
      transition="background 0.3s ease, backdrop-filter 0.3s ease"
    >
      <Container maxW={'container.xl'}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Flex gap={8} alignItems={'center'}>
            <Link fontWeight={'bold'} fontSize={'2xl'} fontFamily={'heading'} asChild>
              <NextLink href={'/dashboard'}>
                <Flex alignItems={'center'} gap={2}>
                  <Icon as={FaRegChartBar} />
                  <Text fontSize={'xl'} fontWeight={'bold'}>TradeFlow</Text>
                </Flex>
              </NextLink>
            </Link>
          </Flex>
          <Flex gap={8} alignItems={'center'}>
            <Flex gap={6} display={{ base: 'none', md: 'flex' }}>
              {MENU_ITEMS.map((menu) => (
                <Button key={menu.href} variant={pathname === menu.href ? 'solid' : 'ghost'} asChild>
                  <Link key={menu.href} asChild>
                    <NextLink href={menu.href}>
                      <Icon as={menu.icon} />
                      <Text>{menu.label}</Text>
                    </NextLink>
                  </Link>
                </Button>
              ))}
            </Flex>
            {user ? (
              <UserSettings />
            ) : (
              <Button size="sm" variant='outline' colorPalette={'gray'} loading={!isLoaded}>
                <NextLink href='/auth/sign-in'>
                  Sign In
                </NextLink>
              </Button>
            )}
          </Flex>
        </Flex>
      </Container >
    </Box >
  )
}
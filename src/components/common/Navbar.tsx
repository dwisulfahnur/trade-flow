"use client"

import { Box, Button, Container, Flex, Icon, Link, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { FaRegChartBar } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useColorModeValue } from "../ui/color-mode";

const menus = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

export default function Navbar() {
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
          <Link fontWeight={'bold'} fontSize={'2xl'} fontFamily={'heading'} asChild>
            <NextLink href={'/'}>
              <Flex alignItems={'center'} gap={2}>
                <Icon as={FaRegChartBar} w={6} h={6} />
                <Text fontSize={'2xl'} fontWeight={'bold'}>TradeFlow</Text>
              </Flex>
            </NextLink>
          </Link>
          <Flex gap={6} display={{ base: 'none', md: 'flex' }}>
            {menus.map((menu) => (
              <Link key={menu.href} asChild fontSize={'lg'}>
                <NextLink href={menu.href}>
                  {menu.label}
                </NextLink>
              </Link>
            ))}
          </Flex>
          <Flex gap={8} alignItems={'center'}>
            {user ? (
              <Button colorPalette={'gray'} loading={!isLoaded}>
                <NextLink href='/dashboard'>
                  <Flex alignItems={'center'} gap={2}>
                    <Icon as={FiPieChart} />
                    Dashboard
                  </Flex>
                </NextLink>
              </Button>
            ) : (
              <Button size="sm" variant='outline' colorPalette={'gray'} loading={!isLoaded} px={8}>
                <NextLink href='/auth/sign-in'>
                  Sign In
                </NextLink>
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
"use client"

import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
import { useUser } from "@clerk/nextjs";
import NextLink from "next/link";
import UserSettings from "../user/UserSettings";

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Trade Journal', href: '/dashboard/trade-journal' },
  // { label: 'Settings', href: '/dashboard/settings/account' },
]

export default function AuthenticatedNavbar() {
  const { user, isLoaded } = useUser();

  const bg = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box position={'fixed'} top={0} left={0} right={0} zIndex={10} bg={bg} w={'full'} p={4}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Flex gap={8} alignItems={'center'}>
          <Link fontWeight={'bold'} fontSize={'2xl'} fontFamily={'heading'} asChild>
            <NextLink href={'/dashboard'}>
              TradeFlow
            </NextLink>
          </Link>
          <Flex gap={6} display={{ base: 'none', md: 'flex' }}>
            {MENU_ITEMS.map((menu) => (
              <Link key={menu.href} asChild>
                <NextLink href={menu.href}>
                  {menu.label}
                </NextLink>
              </Link>
            ))}
          </Flex>
        </Flex>
        <Flex gap={8} alignItems={'center'}>
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
    </Box>
  )
}
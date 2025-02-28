'use client'

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Link,
  Text,
  Drawer,
  BoxProps,
  FlexProps,
  useDisclosure,
  Avatar,
} from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';


interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="0.3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRightWidth="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} w='full'>
            {link.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" _focus={{ boxShadow: 'none' }} w='full'>
      <Flex
        align="center"
        justify="start"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering until mounted
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={4}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton display={{ base: 'flex', md: 'none' }} onClick={onOpen} aria-label="open menu">
        <FiMenu />
      </IconButton>
      <Text fontSize="2xl" fontWeight="bold" display={{ base: 'flex', md: 'none' }}>
        Logo
      </Text>
      <HStack spaceX={6} spaceY={6}>
        <Flex alignItems={'center'}>
          <MenuRoot>
            <MenuTrigger>
              <HStack>
                <VStack alignItems="flex-end" gap={0} ml="2">
                  <Text fontSize="sm">{user?.fullName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Avatar.Root size={'sm'}>
                  <Avatar.Image src={'https://images.unsplash.com/photo-1619946794135-5bc917a27793'} />
                </Avatar.Root>
                {/* <Box>
                  <FiChevronDown />
                </Box> */}
              </HStack>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="Profile">Profile</MenuItem>
              <MenuItem value="Settings">Settings</MenuItem>
              <MenuItem value="Billing">Billing</MenuItem>
              <MenuItem value="Sign out" onClick={() => signOut()}>Sign out</MenuItem>
            </MenuContent>
          </MenuRoot>
        </Flex>
      </HStack>
    </Flex>
  );
};


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering until mounted
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer.Root open={open} placement={'start'} onOpenChange={onClose} size="full">
        <Drawer.Content>
          <SidebarContent onClose={onClose} />
        </Drawer.Content>
      </Drawer.Root>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
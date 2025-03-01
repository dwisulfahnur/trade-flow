"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { FaBell, FaKey } from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";
import { dark } from "@clerk/themes";
import ApiKeySettings from "@/components/settings/ApiKeySettings";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { colorMode } = useColorMode();

  if (!isLoaded || !user) return null;
  return (
    <Flex mx={'auto'} w={{ base: '100%', md: '80%' }} justifyContent={'center'} my={{ base: 4, md: 10 }}>
      <UserProfile
        path="/dashboard/settings"
        appearance={{
          baseTheme: colorMode === 'dark' ? dark : undefined,
          elements: {
            rootBox: {
              margin: '0 auto',
            },
            headerTitle: {
              fontSize: '1.5rem',
            },
            headerSubtitle: {
              fontSize: '2rem',
            },
          },
        }}
      >
        <UserProfile.Page label="API Keys" url={`api-keys`} labelIcon={<Icon as={FaKey} />}>
          <ApiKeySettings />
        </UserProfile.Page>
        <UserProfile.Page label="Notifications" url={`notifications`} labelIcon={<Icon as={FaBell} />}>
          <Text>Notifications</Text>
        </UserProfile.Page>
      </UserProfile>
    </Flex>
  );
}
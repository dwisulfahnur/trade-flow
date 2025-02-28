"use client"

import { VStack, Text, Button, Flex, HStack, Avatar } from "@chakra-ui/react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { FaGoogle, FaApple, FaFacebook, FaTimes } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

const icons = {
  facebook: FaFacebook,
  google: FaGoogle,
  apple: FaApple,
} as const;

type Provider = keyof typeof icons;

export default function LinkedAccounts() {
  const { user } = useUser();
  const { signIn, } = useSignIn();

  const externalAccounts = user?.externalAccounts;

  const handleDisconnect = async (accountId: string) => {
    try {
      if (user) {
        await user.externalAccounts?.find(acc => acc.id === accountId)?.destroy();
        toaster.create({
          title: "Account disconnected.",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Failed to disconnect account:", error);
    }
  };

  const handleConnect = async (provider: Provider) => {
    if (signIn) {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/dashboard/settings/account',
        redirectUrlComplete: '/dashboard/settings/account'
      });
      toaster.create({
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign in successful.`,
        type: "success",
        duration: 3000,
      });
    } else {
      toaster.create({
        title: "Failed to connect account.",
        description: "Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const providers: Provider[] = ['facebook', 'google', 'apple'];

  return (
    <>
      <VStack w='full' alignItems={'start'}>
        <Text fontSize="lg" mb={2}>Linked Accounts</Text>
        {externalAccounts?.length === 0 ? (
          <Text>You have not linked any accounts yet.</Text>
        ) : (
          <VStack w='full' alignItems={'start'}>
            {providers.map((provider) => {
              const account = externalAccounts?.find(acc => acc.provider === provider);
              return (
                <Flex key={provider} w='full' justifyContent={'space-between'} alignItems={'center'} p={2} borderWidth={1} borderRadius="md">
                  <HStack>
                    <Icon as={icons[provider]} w={6} h={6} />
                    {account && (
                      <Avatar.Root size={'2xs'}>
                        <Avatar.Image src={account?.imageUrl} rounded={'sm'} />
                        <Avatar.Fallback>
                          {account?.username?.charAt(0)}
                        </Avatar.Fallback>
                      </Avatar.Root>
                    )}
                    <Text>{account?.username || account?.emailAddress}</Text>
                  </HStack>
                  {account ? (
                    <Button size='xs' variant={'subtle'} onClick={() => handleDisconnect(account?.id ?? '')}>
                      <Flex alignItems={'center'} gap={1}>
                        <Icon as={FaTimes} />
                        <Text>Disconnect</Text>
                      </Flex>
                    </Button>
                  ) : (
                    <Button size='xs' variant={'subtle'} onClick={() => handleConnect(provider)}>
                      <Flex alignItems={'center'} gap={1}>
                        <Icon as={icons[provider]} />
                        <Text>Connect</Text>
                      </Flex>
                    </Button>
                  )}
                </Flex>
              )
            })}
          </VStack>
        )}
      </VStack>
      <Toaster />
    </>
  );
} 
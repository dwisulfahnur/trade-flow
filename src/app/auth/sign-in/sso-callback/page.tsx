'use client';

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Center, Spinner } from "@chakra-ui/react";

export default function SignInCallbackPage() {
  const { isLoaded } = useUser();
  if (!isLoaded) return null;
  return (
    <>
      <Center h="calc(100vh - 100px)" w="full">
        <Spinner />
      </Center>
      <AuthenticateWithRedirectCallback />
    </>
  );
}
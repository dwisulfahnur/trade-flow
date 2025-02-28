"use client";

import { UserButton } from "@clerk/nextjs";
import { useColorMode } from "../ui/color-mode";
import { dark } from "@clerk/themes";

export default function UserSettings() {
  const { colorMode } = useColorMode();
  return (
    <>
      <UserButton
        userProfileMode="navigation"
        userProfileUrl="/dashboard/settings"
        signInUrl="/auth/signin"
        appearance={{ baseTheme: colorMode === 'dark' ? dark : undefined }}
      />
    </>
  );
}
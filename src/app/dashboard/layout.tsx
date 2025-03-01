"use client"

import AuthenticatedNavbar from "@/components/common/AuthenticatedNavbar";
import { Box } from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/auth/sign-in')
    }
  }, [isSignedIn, isLoaded])
  return (
    <Fragment>
      <AuthenticatedNavbar />
      <Box pt={'70px'} w='full' minH='100vh'>
        {children}
      </Box>
    </Fragment>
  )
}
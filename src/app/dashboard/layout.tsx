"use client"

import ColorModeSwitcherButton from "@/components/ColorModeSwitcherButton";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/auth/sign-in')
    }
  }, [isSignedIn, isLoaded])
  return (
    <AdminLayout>
      {children}
      <ColorModeSwitcherButton />
    </AdminLayout>
  )
}
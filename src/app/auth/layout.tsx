"use client"

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/common/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { isSignedIn } = useUser()
  useEffect(() => {
    if (isSignedIn) router.push("/dashboard")
  }, [isSignedIn, router])

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
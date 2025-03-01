"use client"

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { isSignedIn } = useUser()
  if (isSignedIn) router.push("/dashboard")
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
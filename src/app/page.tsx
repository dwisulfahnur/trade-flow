"use client"

import { Center, Heading } from "@chakra-ui/react";
import Navbar from "@/components/common/Navbar";

export default function IndexPage() {
  return (
    <Center minH='100vh' w='full'>
      <Navbar />
      <Heading>Trade Flow</Heading>
    </Center>
  )
}
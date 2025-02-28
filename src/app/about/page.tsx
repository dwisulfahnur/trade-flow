import { Center, Heading } from "@chakra-ui/react";
import Navbar from "@/components/common/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <Center minH='100vh' w='full'>
        <Heading>About</Heading>
      </Center>
    </>
  )
}
"use client"

import { IconButton } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import dynamic from "next/dynamic";

const FiSun = dynamic(() => import("react-icons/fi").then(mod => mod.FiSun), { ssr: false });
const FiMoon = dynamic(() => import("react-icons/fi").then(mod => mod.FiMoon), { ssr: false });

export default function ColorModeSwitcherButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      right={'18px'}
      bottom={'18px'}
      position={"absolute"}
      onClick={toggleColorMode}
      rounded={'full'}
      aria-label="Toggle color mode"
    >
      {colorMode === "dark" ? <FiSun /> : <FiMoon />}
    </IconButton>
  )
}
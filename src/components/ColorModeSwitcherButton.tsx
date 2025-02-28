"use client"

import { IconButton } from "@chakra-ui/react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useColorMode } from "./ui/color-mode";

export default function ColorModeSwitcherButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      right={'18px'}
      bottom={'18px'}
      position={"absolute"}
      onClick={toggleColorMode}
      rounded={'full'}
    >
      {colorMode === "dark" ? <FiSun /> : <FiMoon />}
    </IconButton>
  )
}
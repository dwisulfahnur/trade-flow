"use client"

import { defaultSystem } from "@chakra-ui/react"
import { type ColorModeProviderProps } from "./color-mode"
import dynamic from "next/dynamic"

const ChakraProvider = dynamic(() => import("@chakra-ui/react").then(mod => mod.ChakraProvider), { ssr: false });
const ColorModeProvider = dynamic(() => import("./color-mode").then(mod => mod.ColorModeProvider), { ssr: false });

export function Provider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}

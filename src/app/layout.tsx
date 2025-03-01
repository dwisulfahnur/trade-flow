import ColorModeSwitcherButton from "@/components/ColorModeSwitcherButton"
import { ClerkProvider } from "@clerk/nextjs"
import Providers from "./providers"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <Providers>
            {children}
            <ColorModeSwitcherButton />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
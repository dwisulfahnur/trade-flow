import ColorModeSwitcherButton from "@/components/ColorModeSwitcherButton"
import { Provider } from "@/components/ui/provider"
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <ClerkProvider>
      <html suppressHydrationWarning>
        <body>
          <Provider>{children}
            <ColorModeSwitcherButton />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
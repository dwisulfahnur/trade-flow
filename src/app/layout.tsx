import type { Metadata, ResolvingMetadata } from 'next'
import { ClerkProvider } from "@clerk/nextjs"
import Providers from "./providers"

export const metadata: Metadata = {
  title: 'TradeFlow | Track your trades',
  description: 'TradeFlow is a tool that helps you track your trades and analyze your trading performance.',
  openGraph: {
    title: 'TradeFlow | Track your trades',
    description: 'TradeFlow is a tool that helps you track your trades and analyze your trading performance.',
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
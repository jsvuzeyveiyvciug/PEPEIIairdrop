'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { mainnet, base, bsc, polygon, arbitrum, optimism, avalanche } from 'wagmi/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useState } from 'react'

const projectId = 'TON_PROJECT_ID_ICI'

const networks = [
  mainnet,
  base,
  bsc,
  polygon,
  arbitrum,
  optimism,
  avalanche,
] as const

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,

  metadata: {
    name: 'PP Ⅱ',
    description: 'PP Ⅱ Web3 Community',
    url: 'https://TON-DOMAINE.vercel.app',
    icons: ['https://TON-DOMAINE.vercel.app/pepe.png'],
  },

  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },

  allWallets: 'SHOW',
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
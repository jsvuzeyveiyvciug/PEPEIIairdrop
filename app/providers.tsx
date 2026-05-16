'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import {
  mainnet,
  base,
  bsc,
  polygon,
  arbitrum,
  optimism,
  avalanche,
} from 'wagmi/chains'
import { useState } from 'react'

const projectId = '9024a723562403cfa72556294154bd6a'

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  base,
  bsc,
  polygon,
  arbitrum,
  optimism,
  avalanche,
]

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
    description: 'PEPE Ⅱ Web3 Community',
    url: 'https://pepei-iairdrop.vercel.app',
    icons: ['https://pepei-iairdrop-9rea.vercel.app/pepe.png'],
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
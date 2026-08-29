/*  Hermes adapter — aiagents on pct103 (192.168.1.103)
 *
 *  Server-side only. Sends the WhatsApp confirmation and the coupon.
 *  Hermes drives WhatsApp directly — no Meta Business API, no template
 *  approval queue (see CRM spec §7).
 *
 *  Failure here must NEVER fail the booking. The booking is already safe
 *  in the CRM; the message is a follow-up. We log and move on.
 */
import 'server-only'
import { HERMES } from './config'

async function send(body) {
  if (!HERMES.base) return { ok: false, offline: true }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), HERMES.timeout)
  try {
    const res = await fetch(HERMES.base + HERMES.sendPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(HERMES.key ? { Authorization: `Bearer ${HERMES.key}` } : {}),
      },
      body: JSON.stringify({ agent: HERMES.agent, ...body }),
      signal: ctrl.signal,
      cache: 'no-store',
    })
    if (!res.ok) return { ok: false, status: res.status }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? 'Hermes timeout' : e.message }
  } finally {
    clearTimeout(timer)
  }
}

/** Booking received — sent immediately, before payment. */
export function sendBookingAck({ mobile, name, outlet, offer, date, time, pax, reference, paymentUrl }) {
  const lines = [
    `Namaste ${name}, your table request is in.`,
    ``,
    `${outlet} — ${offer}`,
    `${date} at ${time} · ${pax} guest${pax > 1 ? 's' : ''}`,
    reference ? `Reference: ${reference}` : ``,
    ``,
    paymentUrl
      ? `Pay ₹50 to hold the table: ${paymentUrl}`
      : `We will send your ₹50 payment link here shortly.`,
    ``,
    `₹50 per person cover charge, redeemable against your restaurant bill.`,
  ].filter(Boolean)

  return send({ to: mobile, type: 'text', text: lines.join('\n'), thread_key: reference || mobile })
}

/** Coupon delivery — called after the payment webhook confirms. */
export function sendCoupon({ mobile, name, code, outlet, offer, date, time, couponUrl }) {
  const text = [
    `${name}, your coupon is ready.`,
    ``,
    `Code: ${code}`,
    `${outlet} — ${offer}`,
    `${date} at ${time}`,
    ``,
    `Show this at the restaurant: ${couponUrl}`,
  ].join('\n')
  return send({ to: mobile, type: 'text', text, thread_key: code })
}

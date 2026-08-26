/*  POST /api/enquiry
 *
 *  The ONLY route the browser calls. It runs on the Coolify host inside the
 *  LAN (192.168.1.102), so it reaches cis (pct211) and Hermes (pct103) by
 *  private IP. The CRM address and API keys never leave the server.
 *
 *  Order matters:
 *    1. Validate      — a bad payload never reaches the CRM.
 *    2. Write to CRM  — if this fails, the guest is told to call.
 *    3. Fire WhatsApp — best effort, never fails the booking.
 */
import { NextResponse } from 'next/server'
import { createEnquiry } from '../../../lib/crm'
import { sendBookingAck } from '../../../lib/hermes'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MOBILE = /^[6-9]\d{9}$/
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

function validate(b) {
  const e = []
  if (!b.outlet) e.push('outlet')
  if (!b.offer) e.push('offer')
  if (!b.date || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) e.push('date')
  if (!b.time) e.push('time')
  if (!b.name || b.name.trim().length < 2) e.push('name')
  const mobile = String(b.mobile || '').replace(/\D/g, '').slice(-10)
  if (!MOBILE.test(mobile)) e.push('mobile')
  if (b.email && !EMAIL.test(b.email)) e.push('email')
  const adults = Number(b.adults || 0)
  if (adults < 1 || adults > 20) e.push('adults')
  const today = new Date().toISOString().slice(0, 10)
  if (b.date && b.date < today) e.push('date')
  return { errors: e, mobile }
}

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 })
  }

  const { errors, mobile } = validate(body)
  if (errors.length) {
    return NextResponse.json({ ok: false, error: 'validation', fields: errors }, { status: 422 })
  }

  const payload = {
    outlet: body.outlet,
    offer: body.offer,
    offerSlug: body.offerSlug,
    occasion: body.occasion || null,
    date: body.date,
    session: body.session,
    time: body.time,
    adults: Number(body.adults),
    children: Number(body.children || 0),
    name: body.name.trim(),
    mobile: '+91' + mobile,
    email: body.email ? body.email.trim() : null,
    area: body.area ? body.area.trim() : null,
    requests: body.requests ? body.requests.trim() : null,
    attribution: body.attribution || {},
    idempotencyKey: body.idempotencyKey || 'tvc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10),
  }

  const crm = await createEnquiry(payload)

  if (!crm.ok) {
    console.error('[enquiry] CRM write failed:', crm.error)
    return NextResponse.json(
      {
        ok: false,
        error: 'crm_unavailable',
        message: 'We could not save your booking just now. Please call us and we will hold your table.',
      },
      { status: 502 }
    )
  }

  sendBookingAck({
    mobile: payload.mobile,
    name: payload.name,
    outlet: payload.outlet,
    offer: payload.offer,
    date: payload.date,
    time: payload.time,
    pax: payload.adults + payload.children,
    reference: crm.reference,
    paymentUrl: crm.paymentUrl,
  }).then(r => {
    if (!r.ok) console.warn('[enquiry] Hermes send failed:', r.error || r.status || 'offline')
  })

  return NextResponse.json({ ok: true, reference: crm.reference, paymentUrl: crm.paymentUrl })
}

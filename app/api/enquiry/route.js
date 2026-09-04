/*  POST /api/enquiry
 *
 *  The ONLY route the browser calls to create a booking. It runs server-side,
 *  so the CRM address never reaches a guest's browser.
 *
 *  Order matters:
 *    1. Validate       — a bad payload never reaches the CRM.
 *    2. Create in CRM  — if this fails, the guest is told to call.
 *    3. Return the CRM's own reference, amount and payment link.
 *
 *  The CRM owns the reservation and the money. This route does not compute an
 *  amount, does not keep a second copy of the booking, and does not decide
 *  whether a payment succeeded.
 */
import { NextResponse } from 'next/server'
import { createReservation } from '../../../lib/crm'
import { sendBookingAck } from '../../../lib/hermes'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MOBILE = /^[6-9]\d{9}$/
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

function validate(b) {
  const e = []
  if (!b.outlet) e.push('outlet')
  if (!b.date || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) e.push('date')
  if (!b.session) e.push('session')
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

  const crm = await createReservation({
    outlet: body.outlet,
    occasion: body.occasion || null,
    date: body.date,
    session: body.session,
    time: body.time,
    adults: Number(body.adults),
    children: Number(body.children || 0),
    name: body.name.trim(),
    mobile,
    email: body.email ? body.email.trim() : null,
    attribution: body.attribution || {},
  })

  if (!crm.ok) {
    console.error('[enquiry] CRM booking failed:', crm.error)
    return NextResponse.json(
      {
        ok: false,
        error: 'crm_unavailable',
        message: 'We could not save your booking just now. Please call us and we will hold your table.',
      },
      { status: 502 }
    )
  }

  // The CRM recorded the guest but could not hold a table (no slot for that
  // time, venue not chosen, ...). That is a real answer to give a guest, not
  // an error to hide — and their details are safely with the restaurant.
  if (!crm.reservationRef) {
    return NextResponse.json({
      ok: true,
      held: false,
      message: 'We have your request and the restaurant will call you to confirm the table.',
    })
  }

  // Best-effort WhatsApp acknowledgement, unchanged and non-blocking. Inert
  // unless HERMES_BASE_URL is configured. Coupon/receipt delivery is the CRM's
  // job, not this site's.
  sendBookingAck({
    mobile: '+91' + mobile,
    name: body.name.trim(),
    outlet: body.outlet,
    offer: body.offer || '',
    date: body.date,
    time: body.time,
    pax: Number(body.adults) + Number(body.children || 0),
    reference: crm.reservationRef,
    paymentUrl: crm.payUrl,
  }).then(r => {
    if (!r.ok) console.warn('[enquiry] Hermes send failed:', r.error || r.status || 'offline')
  }).catch(() => {})

  return NextResponse.json({
    ok: true,
    held: true,
    reservationRef: crm.reservationRef,
    amountPaise: crm.amountPaise,
    payableCovers: crm.payableCovers,
    chargeDescription: crm.chargeDescription,
    payUrl: crm.payUrl,
    duplicate: crm.duplicateSubmission,
  })
}

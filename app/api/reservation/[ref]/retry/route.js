/*  POST /api/reservation/[ref]/retry
 *
 *  "Try again" after a failed or abandoned payment. Server-side proxy to the
 *  CRM, which preserves the SAME reservation and issues a fresh payment
 *  attempt. This route never creates a booking of its own.
 */
import { NextResponse } from 'next/server'
import { retryReservationPayment } from '../../../../../lib/crm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(_req, { params }) {
  const { ref } = await params
  const r = await retryReservationPayment(ref)

  if (!r.ok) {
    const message =
      r.status === 404 ? 'We could not find that booking reference.'
      : r.status === 409 ? 'This booking cannot be paid again right now. Please call us and we will help.'
      : 'We could not start a new payment just now. Please try again in a moment.'
    return NextResponse.json({ ok: false, message }, { status: r.status === 404 ? 404 : 502 })
  }

  return NextResponse.json({
    ok: true,
    reservationRef: r.reservationRef,
    amountPaise: r.amountPaise,
    payUrl: r.payUrl,
  })
}

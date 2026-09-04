/*  GET /api/reservation/[ref]/status
 *
 *  Server-side proxy to the CRM's status endpoint. The browser never talks to
 *  the CRM directly and — critically — a payment return URL in the address bar
 *  is never trusted. Only this reply, sourced from the CRM, decides whether a
 *  booking is confirmed.
 *
 *  Only business-safe fields are forwarded. Nothing internal reaches the page.
 */
import { NextResponse } from 'next/server'
import { getReservationStatus } from '../../../../../lib/crm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req, { params }) {
  const { ref } = await params
  const r = await getReservationStatus(ref)

  if (!r.ok) {
    if (r.status === 404) {
      return NextResponse.json({ ok: false, error: 'not_found', message: 'We could not find that booking reference.' }, { status: 404 })
    }
    return NextResponse.json(
      { ok: false, error: 'unavailable', message: 'We could not check your booking just now. Please try again in a moment.' },
      { status: 502 }
    )
  }

  const d = r.data
  return NextResponse.json({
    ok: true,
    reservationRef: d.reservationRef,
    state: d.state,
    amountPaise: d.amountPaise,
    coversTotal: d.coversTotal,
    reservationDate: d.reservationDate,
    session: d.session,
    time: d.slotTime,
    outletName: d.outletName,
    confirmedAt: d.confirmedAt,
  })
}

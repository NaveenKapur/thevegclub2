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
    // The CRM keeps PENDING for a booking that is still held and still
    // payable, whether the guest has not paid yet or their last attempt was
    // declined. Only paymentStatus tells the two apart, so the page cannot
    // show a failed payment as a failure without it. It is a state name, not
    // guest data, and it is never the authority for a confirmation.
    paymentStatus: d.paymentStatus,
    // The coupon the paid booking earned. The code is safe to show -- a guest
    // reads it out at the counter. The QR's rotating token is NOT here: it
    // stays inside the image the CRM renders, so nothing opaque is ever
    // printed as text on the page.
    couponCode: d.couponCode,
    couponStatus: d.couponStatus,
    couponRedeemablePaise: d.couponRedeemablePaise,
  })
}

/*  /c/[code] — the guest's own coupon page.
 *
 *  This is where a QR scanned with a plain phone camera lands. It existed only
 *  as a URL before: every coupon link pointed at a host that returned 404, so
 *  the one thing a guest could do with their coupon outside the restaurant was
 *  nothing.
 *
 *  Server-rendered on purpose. Somebody standing outside a restaurant on a bad
 *  connection should get the coupon in the first response, not after a client
 *  fetch resolves. The CRM remains the only authority on what a coupon is
 *  worth and whether it has been spent — this page asks it on every request and
 *  renders the answer.
 */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicCoupon, couponQrUrl } from '../../../lib/crm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const money = (paise) => '₹' + Number(paise / 100).toLocaleString('en-IN')

function prettyDate(d) {
  if (!d) return ''
  const dt = new Date(d + 'T12:00')
  return isNaN(dt) ? d : dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function prettyTime(t) {
  if (!t) return ''
  const [h, m] = String(t).split(':')
  const dt = new Date(2000, 0, 1, Number(h), Number(m || 0))
  return isNaN(dt) ? t : dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function prettyWhen(d, t) {
  const day = prettyDate(d)
  const time = prettyTime(t)
  return time ? `${day} · ${time}` : day
}

export async function generateMetadata({ params }) {
  const { code } = await params
  return { title: `Coupon ${code} · The Veg Club`, robots: { index: false, follow: false } }
}

export default async function CouponPage({ params }) {
  const { code } = await params
  const r = await getPublicCoupon(code)
  if (!r.ok && r.status === 404) notFound()

  if (!r.ok) {
    return (
      <main className="wrap">
        <div className="done">
          <p className="code">{code}</p>
          <h2>We could not load this coupon</h2>
          <p>Please try again in a moment, or show this code at the restaurant — they can look it up.</p>
          <p className="small"><Link href="/">Back to The Veg Club</Link></p>
        </div>
      </main>
    )
  }

  const c = r.data
  const spent = c.status !== 'issued'

  return (
    <main className="wrap">
      <div className="done">
        {c.reservationRef ? <p className="code">{c.reservationRef}</p> : null}

        <div className="coupon" id="coupon">
          <p className="coupon-eyebrow">Your restaurant coupon</p>

          <p className="coupon-code-label">Coupon code</p>
          <p className="coupon-code">{c.code}</p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="coupon-qr" src={couponQrUrl(c.code)} alt={`QR code for coupon ${c.code}`} width={200} height={200} />

          <dl className="coupon-facts">
            <div><dt>Status</dt><dd>{spent ? c.status.toUpperCase() : 'VALID'}</dd></div>
            {c.outletName ? <div><dt>Restaurant</dt><dd>{c.outletName}</dd></div> : null}
            {c.reservationDate ? <div><dt>Date &amp; Time</dt><dd>{prettyWhen(c.reservationDate, c.reservationTime)}</dd></div> : null}
            <div><dt>Guests</dt><dd>{c.covers}</dd></div>
            {c.reservationRef ? <div><dt>Reservation</dt><dd>{c.reservationRef}</dd></div> : null}
            {c.offerSummary ? <div><dt>Offer</dt><dd>{c.offerSummary}</dd></div> : null}
          </dl>

          {c.redeemablePaise > 0 ? (
            <div className="coupon-redeem">
              <p className="coupon-redeem-label">Adjustable against restaurant bill</p>
              <p className="coupon-redeem-value">{money(c.redeemablePaise)}</p>
            </div>
          ) : null}

          <p className="coupon-note">
            {spent
              ? 'This coupon has already been used. Nothing further is needed.'
              : 'Show this coupon at the restaurant on arrival.'}
          </p>
          <p className="coupon-terms">
            ₹50 per payable guest · Non-refundable · Adjustable against your final restaurant bill at
            the hotel.
          </p>
        </div>

        <p>
          <button className="btn ghost" type="button" data-print-coupon>Save / print coupon</button>
        </p>
        <p className="small"><Link href="/">Back to The Veg Club</Link></p>
      </div>
      {/* A server component cannot carry an onClick, and this page must work
          without shipping a client bundle just to reach window.print(). */}
      <script dangerouslySetInnerHTML={{ __html: "document.querySelector('[data-print-coupon]').addEventListener('click',function(){window.print()})" }} />
    </main>
  )
}

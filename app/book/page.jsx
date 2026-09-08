import BookingCart from '../../components/BookingCart'
import { RACK, money } from '../../lib/pricing'
import { pageMeta } from '../../lib/seo'
import { parseBookingIntent } from '../../lib/booking-intent'

export const metadata = pageMeta({
  title: 'Book a Table — 64/6, Sahibabad',
  description: 'Reserve a table at 64/6, Sahibabad. Choose guests, meal and day — the bill updates itself. Pay ₹50 to hold your table, coupon on WhatsApp.',
  path: '/book',
  og: 'book',
  imageAlt: 'Book a vegetarian buffet table at 64/6, Sahibabad for ₹50',
})

export default async function Book({ searchParams }) {
  const p = await searchParams
  const isTatva = p?.r === 'tatva'
  const outlet = isTatva ? 'Tatva' : '64/6'
  /*  The deal the guest clicked, resolved here on the server. The date in
   *  particular has to be decided server-side: "the soonest Saturday" computed
   *  inside the client component would be a different string on the server
   *  than in the browser, and hydration would tear.  */
  const intent = parseBookingIntent(p || {})

  return (
    <main>
      <div className="wrap bk" style={{ paddingTop: 24 }}>
        <h1 style={{ fontSize: 'clamp(24px,5.6vw,32px)', letterSpacing: '-.02em' }}>
          Book a table at {outlet}
        </h1>
        {outlet !== 'Tatva' && (
          <p className="counterline">
            <span>Counter price</span>
            <s>{money(RACK.breakfast)} breakfast · {money(RACK.lunch)} lunch · {money(RACK.dinner)} dinner</s>
            <b>per guest</b>
          </p>
        )}
        <BookingCart outletName={outlet} intent={intent} />
      </div>
    </main>
  )
}

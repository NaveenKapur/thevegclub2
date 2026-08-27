import BookingCart from '../../components/BookingCart'
import { RACK, money } from '../../lib/pricing'

export const metadata = {
  title: 'Book a Table — 64/6, Sahibabad',
  description: 'Reserve a table at 64/6, Sahibabad. Choose guests, meal and day — the bill updates itself. Pay ₹50 to hold your table, coupon on WhatsApp.',
  alternates: { canonical: '/book' },
}

export default function Book() {
  return (
    <main>
      <div className="wrap bk" style={{ paddingTop: 24 }}>
        <h1 style={{ fontSize: 'clamp(24px,5.6vw,32px)', letterSpacing: '-.02em' }}>
          Book a table at 64/6
        </h1>
        <p className="counterline">
          <span>Counter price</span>
          <s>{money(RACK.breakfast)} breakfast · {money(RACK.lunch)} lunch · {money(RACK.dinner)} dinner</s>
          <b>per guest</b>
        </p>
        <BookingCart outletName="64/6" />
      </div>
    </main>
  )
}

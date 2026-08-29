import Link from 'next/link'
import { RESERVATION_FEE, money } from '../lib/pricing'

/*  "Deals starting as low as ₹1,399/person".
 *
 *  `at` names the restaurant the price belongs to. On a coming-soon page the
 *  box still shows — but it says the deals are at 64/6, because claiming
 *  ₹1,399 deals at a restaurant that is not selling any would be untrue.
 */
export default function DealBox({ from = 1399, compact = false, at = null }) {
  return (
    <aside className={'herocard dealbox' + (compact ? ' compact' : '')}>
      <span className="eyebrow">Deals starting as low as</span>

      <div className="bigline">
        <span className="bignum">{money(from)}</span>
        <span className="slashper">/person</span>
      </div>
      <div className="allin">All inclusive · no hidden charges</div>

      {at ? <p className="atline">Available at <b>{at}</b></p> : null}

      <ul className="dealpts">
        <li><b>Up to 50% off</b> the counter price</li>
        <li>{at ? <>Breakfast, lunch &amp; dinner buffets at <b>{at}</b></> : <>Breakfast, lunch &amp; dinner buffets</>}</li>
        <li>Children up to 5 years <b>free</b></li>
      </ul>

      <Link className="btn" href={`/book${at === 'Tatva' ? '?r=tatva' : ''}`} style={{ textDecoration: 'none' }}>
        Book from {money(from)}
      </Link>
      <p className="finep">
        Just {money(RESERVATION_FEE)} per person cover charge to book — redeemable against your restaurant bill.
      </p>
    </aside>
  )
}

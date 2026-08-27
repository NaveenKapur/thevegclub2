import Link from 'next/link'
import { RESTAURANTS } from '../../data/restaurants'
import { RACK, money } from '../../lib/pricing'
import DealBox from '../../components/DealBox'
import Faq from '../../components/Faq'
import Reveal from '../../components/Reveal'
import { JsonLd, faq, breadcrumbs, restaurant as rSchema } from '../../lib/schema'
import { SITE } from '../../lib/config'

export const metadata = {
  title: 'Vegetarian Restaurant Deals in Sahibabad & Ghaziabad',
  description: 'Pure vegetarian restaurant deals in Sahibabad, Ghaziabad and Indirapuram. Buffet coupons from ₹1,399 a head, 1+1 dinners at half the counter price. Book for ₹50.',
  alternates: { canonical: '/restaurants' },
}

const OCCASIONS = [
  { t: 'Kitty party deals', d: 'Weekday lunch buffet for a group, reserved seating, up to 20 guests. The 1+1 rate applies to every pair.', img: 's_hall' },
  { t: 'Birthday party deals', d: 'A private corner, cake arrangement on request and the full buffet. From 10 guests upward.', img: 'romance' },
  { t: 'Anniversary dinner deals', d: 'Dinner 1+1 at ₹3,299 for two on weekdays. Poolside and terrace tables available.', img: 'night' },
  { t: 'Family get-together deals', d: 'Sunday or weekday, breakfast through dinner. Children up to 5 years eat free.', img: 's_long' },
]

const FAQS = [
  { q: 'What are the best restaurant deals in Sahibabad right now?',
    a: 'The sharpest is the weekday 1+1 buffet at 64/6, Country Inn & Suites Sahibabad — two guests eat the full vegetarian buffet for ₹2,799 at lunch or ₹3,299 at dinner, against counter prices of ₹5,598 and ₹6,598. That is a 50% saving. A single guest pays ₹1,399 for breakfast, ₹1,699 for lunch or ₹1,899 for dinner.' },
  { q: 'Where can I find vegetarian restaurant deals in Ghaziabad and Indirapuram?',
    a: 'The Veg Club lists pure vegetarian coupons at Sahibabad, roughly ten minutes from Indirapuram, Vaishali and Vasundhara. Every deal is bookable online for a ₹50 reservation fee and the coupon arrives on WhatsApp.' },
  { q: 'Are these hotel restaurant deals cheaper than aggregator offers?',
    a: 'They are direct rates, so there is no aggregator commission built into the price. We publish the exact rupee amount you will pay rather than an "up to" percentage, and the price you see is the price the restaurant honours.' },
  { q: 'Do you have kitty party or birthday party deals?',
    a: 'Yes. Group bookings up to 20 guests use the same buffet coupons — the 1+1 rate applies to each pair, so a table of eight pays four pair rates. Cake and seating arrangements are made on request when you book.' },
  { q: 'What is the cheapest buffet deal in Ghaziabad?',
    a: 'Breakfast at 64/6 is ₹1,399 per guest, all inclusive, against a ₹2,599 counter price — a 46% saving and the lowest entry price we list.' },
  { q: 'Is there a coupon code, or do I pay online?',
    a: 'There is no code to hunt for. You book on this site, pay ₹50 to hold the table, and a coupon with your booking reference arrives on WhatsApp. Show it at the restaurant and the deal price is applied to your bill.' },
]

export default function Restaurants() {
  const live = RESTAURANTS.filter(r => r.status === 'live')

  return (
    <main>
      <JsonLd data={breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Restaurants', href: '/restaurants' }])} />
      <JsonLd data={faq(FAQS)} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'ItemList',
        name: 'Vegetarian restaurants with deals in Sahibabad, Ghaziabad',
        itemListElement: RESTAURANTS.map((r, i) => ({
          '@type': 'ListItem', position: i + 1, item: rSchema(r),
        })),
      }} />

      {/* ── hero ── */}
      <div className="wrap intro introgrid">
        <div>
          <p className="eyebrow">Sahibabad · Ghaziabad · Indirapuram</p>
          <h1>Vegetarian restaurant deals<br />worth leaving the house for.</h1>
          <p>
            Four pure vegetarian restaurants inside one hotel at Sahibabad — buffet, poolside,
            fine dining and a terrace for large gatherings. Counter prices run {money(RACK.breakfast)} to{' '}
            {money(RACK.dinner)} a head. Booked here, they start at {money(1399)}.
          </p>
          <div className="ctarow">
            <Link className="btn" href="/book" style={{ textDecoration: 'none' }}>Book from {money(1399)}</Link>
            <Link className="btn ghost" href="/deals" style={{ textDecoration: 'none' }}>See every deal</Link>
          </div>
        </div>
        <DealBox from={1399} />
      </div>

      {/* ── the restaurants ── */}
      <div className="wrap sec">
        <Reveal><h2>The restaurants</h2></Reveal>
        <Reveal><p className="sub">Coupons are live at 64/6. The others open shortly.</p></Reveal>
        <div className="cards">
          {RESTAURANTS.map((r, i) => (
            <Reveal key={r.slug} delay={i * 70}>
              <Link href={`/restaurants/${r.slug}`}
                className={'card lift' + (r.status === 'coming_soon' ? ' soon' : '')}
                style={{ textDecoration: 'none' }}>
                <div className="ph">
                  <img src={`/images/${r.photos[0]}.jpg`} alt={`${r.name}, vegetarian restaurant in Sahibabad`} loading="lazy" />
                  {r.status === 'coming_soon' ? <span className="status">COMING SOON</span> : null}
                  {r.status === 'enquiry' ? <span className="status enq">GROUPS OF 50+</span> : null}
                  {r.status === 'live' ? <span className="tag">FROM {money(1399)}</span> : null}
                </div>
                <div className="body">
                  <h3>{r.name}</h3>
                  <div className="meta">{r.kind}</div>
                  <div className="best">
                    {r.status === 'live' ? <>Buffet coupons, breakfast to dinner</>
                      : r.status === 'enquiry' ? <>Whole-terrace hire, minimum {r.minGroup} guests</>
                      : <>Coupons opening shortly</>}
                  </div>
                  <div className="go">{r.status === 'enquiry' ? 'Enquire →' : 'See the restaurant →'}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── occasions ── */}
      <div className="wrap sec">
        <Reveal><h2>Deals for the occasion</h2></Reveal>
        <Reveal><p className="sub">The same buffet coupons cover a table of two or a table of twenty. Tell us the occasion when you book.</p></Reveal>
        <div className="occs">
          {OCCASIONS.map((o, i) => (
            <Reveal key={o.t} delay={i * 70}>
              <article className="occ">
                <div className="occpic"><img src={`/images/${o.img}.jpg`} alt={o.t} loading="lazy" /></div>
                <div className="occbody">
                  <h3>{o.t}</h3>
                  <p>{o.d}</p>
                  <Link href="/book" className="occgo">Book this →</Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── honest comparison ── */}
      <div className="wrap sec">
        <Reveal><h2>Why book direct instead of an aggregator</h2></Reveal>
        <Reveal><p className="sub">Zomato, Swiggy Dineout, EazyDiner and Magicpin all list restaurants in Ghaziabad. Here is the honest difference.</p></Reveal>
        <Reveal>
          <div className="scrollx">
            <table className="cmp">
              <thead>
                <tr><th></th><th>Booking here</th><th>Through an aggregator</th></tr>
              </thead>
              <tbody>
                <tr><td>The price you see</td><td className="hi">An exact rupee figure — {money(2799)} for two</td><td>Usually "up to 20% off"</td></tr>
                <tr><td>Who sets it</td><td className="hi">The restaurant</td><td>The platform, after commission</td></tr>
                <tr><td>What you pay upfront</td><td className="hi">{money(50)} to hold the table</td><td>Varies by platform</td></tr>
                <tr><td>Where the coupon lives</td><td className="hi">WhatsApp, with your booking reference</td><td>Inside an app you must open</td></tr>
                <tr><td>These particular rates</td><td className="hi">Only on thevegclub.com</td><td>Not listed</td></tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>

      {/* ── SEO body copy that is actually useful ── */}
      <div className="wrap sec">
        <div className="longform">
          <Reveal><h2>Eating vegetarian in Sahibabad and Ghaziabad</h2></Reveal>
          <Reveal>
            <p>
              Sahibabad sits at the join between east Delhi and Ghaziabad, ten to fifteen minutes from
              Indirapuram, Vaishali, Vasundhara and Kaushambi, and a short drive from Noida sectors 62
              and 63. It is well served for street food and casual dining, and thin on pure vegetarian
              restaurants at the hotel end of the market — which is the gap these coupons fill.
            </p>
          </Reveal>
          <Reveal>
            <h3>What a buffet actually costs here</h3>
            <p>
              The counter price at 64/6 is {money(RACK.breakfast)} for breakfast, {money(RACK.lunch)} for
              lunch and {money(RACK.dinner)} for dinner, per guest, all taxes included. Booked through
              this site a single guest pays {money(1399)}, {money(1699)} or {money(1899)} respectively.
              Two guests on a weekday pay {money(2799)} at lunch or {money(3299)} at dinner for the
              1+1 — half the counter price. Saturday and Sunday rates differ: {money(3199)} for two at
              lunch, {money(3599)} at dinner.
            </p>
          </Reveal>
          <Reveal>
            <h3>Groups, kitty parties and celebrations</h3>
            <p>
              A coupon booking holds up to twenty guests. The bill pairs guests into 1+1 rates and
              charges any odd guest the single rate, so a table of eight pays four pair rates and a
              table of five pays two pairs plus one. Children up to five years are complimentary and
              are not counted on the bill at all. For gatherings above fifty, Skydeck — the open
              terrace — is hired whole and quoted per event rather than sold as a coupon.
            </p>
          </Reveal>
          <Reveal>
            <h3>No onion, no garlic</h3>
            <p>
              Sattvic dishes prepared without onion or garlic are available on request at every
              restaurant listed here. Mention it when you book and the kitchen prepares them fresh
              rather than setting them aside from the main line. This matters during Navratri,
              Shravan and other fasting periods, when most buffet menus in the area make no
              provision at all.
            </p>
          </Reveal>
          <Reveal>
            <h3>How the ₹50 works</h3>
            <p>
              The reservation fee holds your table and locks the coupon price. It is not refundable
              and is not adjusted against your restaurant bill — on a weekday dinner for two that is
              ₹50 spent to save {money(3299)}. Your coupon arrives on WhatsApp with a booking
              reference; show it at the table and the deal price is applied to your bill.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="wrap sec">
        <Reveal><h2>Questions</h2></Reveal>
        <Faq items={FAQS} />
      </div>

      <div className="wrap sec">
        <div className="endcta">
          <h2>Deals starting as low as {money(1399)} a person</h2>
          <p>All inclusive. Book in under a minute, pay {money(50)}, coupon on WhatsApp.</p>
          <div className="ctarow" style={{ justifyContent: 'center' }}>
            <Link className="btn" href="/book" style={{ textDecoration: 'none' }}>Book a table</Link>
            <a className="btn ghost" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi, I want to book a vegetarian buffet deal')}`}
               target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>WhatsApp us</a>
          </div>
        </div>
      </div>
    </main>
  )
}

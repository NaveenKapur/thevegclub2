import Link from 'next/link'
import { getDeals } from '../lib/crm'
import { RESTAURANTS, bySlug } from '../data/restaurants'
import { weekdayDeals } from '../data/deals'
import DealCard, { saving } from '../components/DealCard'
import Faq from '../components/Faq'
import DealBox from '../components/DealBox'
import { JsonLd, organization, website, offerList, faq } from '../lib/schema'
import { SITE } from '../lib/config'
import { RACK, money } from '../lib/pricing'

export const revalidate = 300

export const metadata = {
  title: 'Veg Buffet Deals in Ghaziabad — 1+1 from ₹2,799 | Veg Club',
  description: 'Vegetarian buffet coupons at 64/6, Sahibabad. Lunch 1+1 ₹2,799 for two against a ₹5,598 counter price. Dinner 1+1 ₹3,299. Book for ₹50.',
  alternates: { canonical: '/' },
}

const FAQS = [
  { q: 'What does a vegetarian buffet cost in Ghaziabad?',
    a: 'The counter price at 64/6, Sahibabad is ₹2,599 for breakfast, ₹2,799 for lunch and ₹3,299 for dinner per guest. Booked here, one guest pays ₹1,399 for breakfast, ₹1,699 for lunch and ₹1,899 for dinner — all taxes included.' },
  { q: 'How does the 1+1 work?',
    a: 'Two guests eat the full buffet for one deal price. Weekday lunch 1+1 is ₹2,799 for two against a ₹5,598 counter price — a 50% saving. Weekday dinner 1+1 is ₹3,299 for two against ₹6,598.' },
  { q: 'Are weekend rates the same?',
    a: 'No. On Saturday and Sunday, lunch for two is ₹3,199 and dinner for two is ₹3,599. Pick a weekend date in the booking form and the bill updates itself.' },
  { q: 'What if we are three, or five?',
    a: 'The bill pairs guests into 1+1 deals and charges any remaining guest the single rate — whichever combination is cheapest for you. Three at weekday lunch is ₹4,498; five at weekday dinner is ₹8,497.' },
  { q: 'Do children pay?',
    a: 'Children up to 5 years are complimentary and are not added to the bill at all. Children above 5 are counted as guests at the deal rate.' },
  { q: 'What is the ₹50 reservation fee?',
    a: 'It holds your table and locks the deal price. It is not refundable and is not adjusted against your restaurant bill.' },
  { q: 'Are these deals available on Zomato or Dineout?',
    a: 'No. These prices are available only on thevegclub.com.' },
  { q: 'Do the restaurants cook without onion and garlic?',
    a: 'Sattvic dishes without onion or garlic can be prepared on request. Mention it when you book so the kitchen is ready.' },
]

export default async function Home() {
  const { deals, source } = await getDeals()
  const shown = weekdayDeals(deals)
  const byOutlet = Object.fromEntries(RESTAURANTS.map(r => [r.slug, r]))
  const hero = bySlug('64-6')
  const lunch = shown.find(d => d.slug === 'lunch-1-plus-1')
  const dinner = shown.find(d => d.slug === 'dinner-1-plus-1')

  return (
    <main>
      <JsonLd data={organization()} />
      <JsonLd data={website()} />
      <JsonLd data={offerList(shown, byOutlet)} />
      <JsonLd data={faq(FAQS)} />

      {/* ── hero ── */}
      <div className="wrap intro introgrid">
        <div>
          <h1>Veg buffet deals.<br />One <em>₹{SITE.fee}</em> booking.</h1>
          <p>Two guests eat the full vegetarian buffet at 64/6, Sahibabad, for the price of one.
             Counter price {money(RACK.lunch * 2)} — you pay {money(2799)}.
             Pay ₹{SITE.fee}, get your coupon on WhatsApp, show it at the table.</p>
          <div className="ctarow">
            <Link className="btn" href="/deals/buffet" style={{ textDecoration: 'none' }}>See buffet deals</Link>
            <Link className="btn ghost" href="/restaurants" style={{ textDecoration: 'none' }}>Restaurants</Link>
          </div>
          <div className="steps">
            <span className="step"><b>1</b>Choose a deal</span>
            <span className="step"><b>2</b>Pay ₹{SITE.fee}</span>
            <span className="step"><b>3</b>Coupon on WhatsApp</span>
            <span className="step"><b>4</b>Show it at the table</span>
          </div>
        </div>
        <DealBox from={1399} />
      </div>

      {/* ── restaurants FIRST ── */}
      <div className="wrap sec">
        <h2>Our restaurants</h2>
        <p className="sub">Coupons are live at 64/6. The others are opening shortly.</p>
        <div className="cards">
          {RESTAURANTS.map(r => {
            const soon = r.status === 'coming_soon'
            const enq = r.status === 'enquiry'
            return (
              <Link key={r.slug} href={`/restaurants/${r.slug}`}
                className={'card' + (soon ? ' soon' : '')} style={{ textDecoration: 'none' }}>
                <div className="ph">
                  <img src={`/images/${r.photos[0]}.jpg`} alt={r.name} loading="lazy" />
                  {soon ? <span className="status">COMING SOON</span> : null}
                  {enq ? <span className="status enq">GROUPS OF 50+</span> : null}
                  {r.status === 'live' ? <span className="tag">50% OFF</span> : null}
                </div>
                <div className="body">
                  <h3>{r.name}</h3>
                  <div className="meta">{r.kind}{r.status === 'live' ? ' · ' + r.costForTwo : ''}</div>
                  {r.status === 'live'
                    ? <div className="best">Best deal: <b>Lunch 1+1</b> — {money(2799)} for two</div>
                    : enq
                      ? <div className="best">Whole-terrace hire, minimum 50 guests</div>
                      : <div className="best">Coupons opening shortly</div>}
                  <div className="go">{enq ? 'Enquire →' : soon ? 'See the restaurant →' : 'View photos & deals →'}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── the buffet feature ── */}
      <div className="wrap sec">
        <div className="feature">
          <div className="pic"><img src="/images/s_buffet.jpg" alt="The buffet spread at 64/6, Sahibabad" loading="lazy" /></div>
          <div className="body">
            <span className="tag">The one to book</span>
            <h2>64/6 — the full vegetarian buffet</h2>
            <p>Live counters, forty dishes and a dessert table, twice over. The weekday 1+1 is
             half the counter rate — the sharpest price on this site.</p>
            <dl>
              <dt>Lunch 1+1 · Mon–Fri</dt><dd>{money(2799)} <s style={{opacity:.55,fontWeight:400}}>{money(RACK.lunch*2)}</s></dd>
              <dt>Dinner 1+1 · Mon–Fri</dt><dd>{money(3299)} <s style={{opacity:.55,fontWeight:400}}>{money(RACK.dinner*2)}</s></dd>
              <dt>Breakfast · per guest</dt><dd>{money(1399)} <s style={{opacity:.55,fontWeight:400}}>{money(RACK.breakfast)}</s></dd>
            </dl>
            <div className="ctarow">
              <Link className="btn" href="/deals/buffet" style={{ textDecoration: 'none' }}>All buffet deals</Link>
              <Link className="btn ghost" href="/restaurants/64-6" style={{ textDecoration: 'none' }}>About 64/6</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── deals BELOW ── */}
      <div className="wrap sec">
        <h2>Weekday coupons at 64/6</h2>
        <p className="sub">
          Monday to Friday, all taxes included. Weekend rates differ and are listed on the{' '}
          <Link href="/restaurants/64-6">64/6 page</Link>.
          {source === 'fallback' ? ' Showing our published rates.' : null}
        </p>
        {shown.map(d => <DealCard key={d.slug} deal={d} restaurant={byOutlet[d.outlet]} />)}
        <div className="ctarow">
          <Link className="btn" href="/deals" style={{ textDecoration: 'none' }}>See every deal</Link>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="wrap sec">
        <h2>Questions</h2>
        <Faq items={FAQS} />
      </div>
    </main>
  )
}

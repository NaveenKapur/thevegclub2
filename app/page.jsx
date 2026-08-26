import Link from 'next/link'
import { getDeals } from '../lib/crm'
import { RESTAURANTS } from '../data/restaurants'
import DealCard, { saving } from '../components/DealCard'
import { JsonLd, organization, website, offerList, faq } from '../lib/schema'
import { SITE } from '../lib/config'

export const revalidate = 300

export const metadata = {
  title: 'Vegetarian Restaurant Deals in Delhi NCR | Veg Club',
  description: 'Every live vegetarian dining deal in Ghaziabad and Sahibabad — buffets from ₹1,399, 1+1 dinners, 20% off à la carte. Book for ₹50.',
  alternates: { canonical: '/' },
}

const FAQS = [
  { q: 'What does a vegetarian buffet cost in Ghaziabad?',
    a: 'At 64/6 in Sahibabad the lunch buffet is ₹1,700 per guest and dinner is ₹1,900 per guest, all taxes included. Breakfast is ₹1,399. The weekday 1+1 deals bring dinner down to ₹1,650 per guest.' },
  { q: 'What is the ₹50 reservation fee?',
    a: 'It holds your table and locks the deal price. It is not refundable and is not adjusted against your restaurant bill.' },
  { q: 'Are these deals available on Zomato or Dineout?',
    a: 'No. These prices are available only on thevegclub.com.' },
  { q: 'Do the restaurants cook without onion and garlic?',
    a: 'Sattvic dishes without onion or garlic can be prepared on request. Mention it when you book so the kitchen is ready.' },
]

export default async function Home() {
  const { deals, source } = await getDeals()
  const bySlug = Object.fromEntries(RESTAURANTS.map(r => [r.slug, r]))
  const live = deals.filter(d => d.status === 'live')
  const best = [...live].sort((a, b) => (saving(b) || 0) - (saving(a) || 0)).slice(0, 4)

  return (
    <main>
      <JsonLd data={organization()} />
      <JsonLd data={website()} />
      <JsonLd data={offerList(live, bySlug)} />
      <JsonLd data={faq(FAQS)} />

      <div className="wrap intro introgrid">
        <div>
          <h1>Vegetarian deals.<br />One <em>₹{SITE.fee}</em> booking.</h1>
          <p>Buffets, 1+1 dinners and à la carte discounts at pure vegetarian restaurants in Sahibabad and Ghaziabad. Pay ₹{SITE.fee}, get your coupon on WhatsApp, show it at the table.</p>
          <div className="ctarow">
            <Link className="btn" href="/deals" style={{ textDecoration: 'none' }}>See all deals</Link>
            <Link className="btn ghost" href="/restaurants" style={{ textDecoration: 'none' }}>Restaurants</Link>
          </div>
          <div className="steps">
            <span className="step"><b>1</b>Choose a deal</span>
            <span className="step"><b>2</b>Pay ₹{SITE.fee}</span>
            <span className="step"><b>3</b>Coupon on WhatsApp</span>
            <span className="step"><b>4</b>Show it at the table</span>
          </div>
        </div>
        <aside className="herocard">
          <h3>What the ₹{SITE.fee} does</h3>
          <p>It holds your table and locks the deal price. It is not refundable and is not adjusted against your bill — on a dinner 1+1 you still save ₹3,299.</p>
          <dl>
            <dt>Best saving</dt><dd>50% at 64/6</dd>
            <dt>Restaurants</dt><dd>{RESTAURANTS.length}</dd>
            <dt>To reserve</dt><dd>₹{SITE.fee}</dd>
          </dl>
        </aside>
      </div>

      <div className="wrap sec">
        <h2>Today’s best deals</h2>
        <p className="sub">
          Live prices, all taxes included.
          {source === 'fallback' ? ' Showing our published rates.' : null}
        </p>
        {best.map(d => <DealCard key={d.slug + d.outlet} deal={d} restaurant={bySlug[d.outlet]} />)}
        <div className="ctarow">
          <Link className="btn" href="/deals" style={{ textDecoration: 'none' }}>See every deal</Link>
        </div>
      </div>

      <div className="wrap sec">
        <h2>Our restaurants</h2>
        <p className="sub">Tap any restaurant for photos, menu and deals.</p>
        <div className="cards">
          {RESTAURANTS.map(r => (
            <Link key={r.slug} href={`/restaurants/${r.slug}`} className="card" style={{ textDecoration: 'none' }}>
              <div className="ph">
                <img src={`/images/${r.photos[0]}.jpg`} alt={r.name} loading="lazy" />
              </div>
              <div className="body">
                <h3>{r.name}</h3>
                <div className="meta">{r.kind} · {r.costForTwo}</div>
                <div className="go">View photos &amp; deals →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="wrap sec">
        <h2>Questions</h2>
        {FAQS.map(f => (
          <div key={f.q} style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 17 }}>{f.q}</h3>
            <p className="sub" style={{ margin: '6px 0 0' }}>{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

import { notFound } from 'next/navigation'
import { getDeals } from '../../../lib/crm'
import { RESTAURANTS } from '../../../data/restaurants'
import { HUBS, weekdayDeals } from '../../../data/deals'
import DealCard from '../../../components/DealCard'
import Link from 'next/link'
import { JsonLd, offerList, breadcrumbs } from '../../../lib/schema'
import { pageMeta } from '../../../lib/seo'
import { bookHref } from '../../../lib/booking-intent'

/*  Three of the six hubs are a single meal, and on those the Book a table
 *  button should not land on breakfast. The other three (buffet, 1+1, 50%
 *  off) span meals and carry no meal intent -- undefined, so the form keeps
 *  its default.  */
const MEAL_HUBS = { lunch: 'lunch', dinner: 'dinner', breakfast: 'breakfast' }

export const revalidate = 300

const META = {
  'lunch':          ['Veg Lunch Deals in Ghaziabad — 1+1 ₹2,799 for Two', 'Vegetarian lunch buffet at 64/6, Sahibabad. One guest ₹1,699, or 1+1 at ₹2,799 for two against a ₹5,598 counter price. ₹50 a person cover charge — non-refundable, adjusted against your bill.'],
  'dinner':         ['Veg Dinner Deals in Ghaziabad — 1+1 ₹3,299 for Two', 'Vegetarian dinner buffet at 64/6, Sahibabad. One guest ₹1,899, or 1+1 at ₹3,299 for two against a ₹6,598 counter price. ₹50 a person cover charge — non-refundable, adjusted against your bill.'],
  'breakfast':      ['Breakfast Deals in Ghaziabad — Veg Buffet ₹1,399', 'Vegetarian breakfast buffet at 64/6, Sahibabad. ₹1,399 per guest all inclusive against a ₹2,599 counter price — 46% off. ₹50 a person cover charge — non-refundable, adjusted against your bill.'],
  'buffet':         ['Veg Buffet Deals in Ghaziabad — From ₹1,399 a Head', 'Vegetarian buffet offers in Sahibabad. Breakfast ₹1,399, lunch ₹1,700, dinner ₹1,900 per guest, all inclusive. Up to 50% off with 1+1.'],
  '1-plus-1':       ['1+1 Buffet Deals in Ghaziabad — Two Eat for One', 'Buy one get one free at 64/6, Sahibabad. Weekday lunch 1+1 ₹2,799 for two, dinner 1+1 ₹3,299 — half the counter price. ₹50 a person cover charge — non-refundable, adjusted against your bill.'],
  '50-percent-off': ['50% Off Veg Buffet Deals in Ghaziabad — 1+1', 'Half-price vegetarian buffets at 64/6, Sahibabad. Weekday lunch 1+1 ₹2,799 and dinner 1+1 ₹3,299 — a full 50% off the counter rate.'],
  'buffet':         ['Veg Buffet Deals in Ghaziabad — From ₹1,399 a Head', 'Vegetarian buffet at 64/6, Sahibabad. Breakfast ₹1,399, lunch ₹1,699, dinner ₹1,899 per guest. Weekday 1+1 from ₹2,799 for two. ₹50 a person cover charge — non-refundable, adjusted against your bill.'],
}

export function generateStaticParams() {
  return Object.keys(HUBS).map(slug => ({ slug }))
}

export function generateMetadata({ params }) {
  const m = META[params.slug]
  if (!m) return {}
  /*  One card per hub — public/og/deals-<slug>.jpg, built by scripts/generate-og.mjs. */
  return pageMeta({
    title: m[0],
    description: m[1],
    path: `/deals/${params.slug}`,
    og: `deals-${params.slug}`,
    imageAlt: m[0],
  })
}

export default async function Hub({ params }) {
  const hub = HUBS[params.slug]
  if (!hub) notFound()

  const { deals } = await getDeals()
  const bySlug = Object.fromEntries(RESTAURANTS.map(r => [r.slug, r]))
  const matched = weekdayDeals(deals).filter(hub.filter)
  const [title, description] = META[params.slug] || [hub.title, '']

  return (
    <main>
      <JsonLd data={offerList(matched, bySlug)} />
      <JsonLd data={breadcrumbs([
        { name: 'Home', href: '/' },
        { name: 'Deals', href: '/deals' },
        { name: hub.title, href: `/deals/${params.slug}` },
      ])} />

      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/deals">All deals</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{hub.title}</span>
        </nav>
      </div>

      <div className="wrap intro">
        <h1>{hub.title} in Ghaziabad &amp; Sahibabad</h1>
        <p className="offbanner">Get up to <b>50% off</b> the counter price</p>
        <p>{description}</p>
      </div>

      <div className="wrap sec">
        {matched.length
          ? matched.map(d => <DealCard key={d.slug + d.outlet} deal={d} restaurant={bySlug[d.outlet]} />)
          : <p className="sub">No live deals in this category right now.</p>}

        <div className="ctarow" style={{ marginTop: 22 }}>
          <Link className="btn" href={bookHref({ meal: MEAL_HUBS[params.slug] })} style={{ textDecoration: 'none' }}>Book a table</Link>
          <Link className="btn ghost" href="/deals" style={{ textDecoration: 'none' }}>← Back to all deals</Link>
        </div>

        <div className="otherhubs">
          <span className="oh-lab">Other deals</span>
          <div className="chipsrow">
            {Object.entries(HUBS).filter(([s]) => s !== params.slug).map(([s, h]) => (
              <Link key={s} className="pill" href={`/deals/${s}`} style={{ textDecoration: 'none' }}>{h.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

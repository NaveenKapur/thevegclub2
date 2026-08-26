import { notFound } from 'next/navigation'
import { getDeals } from '../../../lib/crm'
import { RESTAURANTS } from '../../../data/restaurants'
import { HUBS } from '../../../data/deals'
import DealCard from '../../../components/DealCard'
import { JsonLd, offerList, breadcrumbs } from '../../../lib/schema'

export const revalidate = 300

const META = {
  'lunch':          ['Lunch Deals in Ghaziabad & Indirapuram — From ₹1,399', 'Vegetarian lunch offers in Sahibabad. Buffet ₹1,700 per guest, or 1+1 at ₹2,800 for two, Monday to Friday. Book your table for ₹50.'],
  'dinner':         ['Dinner Deals in Delhi NCR — 1+1 and 20% Off Veg', 'Vegetarian dinner offers in Sahibabad: buffet 1+1 at ₹3,300 for two, or 20% off à la carte across three restaurants. Reserve for ₹50.'],
  'breakfast':      ['Breakfast Deals in Ghaziabad — Veg Buffet ₹1,399', 'All-day vegetarian breakfast buffet in Sahibabad at ₹1,399 per guest, all inclusive. Weekend 1+1 at ₹2,600 for two. Reserve for ₹50.'],
  'buffet':         ['Veg Buffet Deals in Ghaziabad — From ₹1,399 a Head', 'Vegetarian buffet offers in Sahibabad. Breakfast ₹1,399, lunch ₹1,700, dinner ₹1,900 per guest, all inclusive. Up to 50% off with 1+1.'],
  '1-plus-1':       ['1+1 Restaurant Deals in Delhi NCR — Two Eat for One', 'Buy one get one free at vegetarian restaurants in Sahibabad. Dinner 1+1 ₹3,300 for two, lunch ₹2,800. Half the counter price. Book for ₹50.'],
  '50-percent-off': ['50% Off Restaurant Deals in Delhi NCR — Pure Veg', 'Half-price vegetarian dining in Ghaziabad. Weekday 1+1 buffets save a full 50% on the counter rate. Verified prices, no membership needed.'],
  'sunday-brunch':  ['Sunday Brunch in Ghaziabad — Veg Buffet 1+1 ₹2,600', 'Weekend vegetarian brunch in Sahibabad. Two guests for ₹2,600 all inclusive — 50% off the counter rate. Saturdays and Sundays. Book for ₹50.'],
}

export function generateStaticParams() {
  return Object.keys(HUBS).map(slug => ({ slug }))
}

export function generateMetadata({ params }) {
  const m = META[params.slug]
  if (!m) return {}
  return { title: m[0], description: m[1], alternates: { canonical: `/deals/${params.slug}` } }
}

export default async function Hub({ params }) {
  const hub = HUBS[params.slug]
  if (!hub) notFound()

  const { deals } = await getDeals()
  const bySlug = Object.fromEntries(RESTAURANTS.map(r => [r.slug, r]))
  const matched = deals.filter(d => d.status === 'live').filter(hub.filter)
  const [title, description] = META[params.slug] || [hub.title, '']

  return (
    <main>
      <JsonLd data={offerList(matched, bySlug)} />
      <JsonLd data={breadcrumbs([
        { name: 'Home', href: '/' },
        { name: 'Deals', href: '/deals' },
        { name: hub.title, href: `/deals/${params.slug}` },
      ])} />

      <div className="wrap intro">
        <h1>{hub.title} in Ghaziabad &amp; Sahibabad</h1>
        <p>{description}</p>
      </div>

      <div className="wrap sec">
        {matched.length
          ? matched.map(d => <DealCard key={d.slug + d.outlet} deal={d} restaurant={bySlug[d.outlet]} />)
          : <p className="sub">No live deals in this category right now. <a href="/deals">See every deal</a>.</p>}
      </div>
    </main>
  )
}

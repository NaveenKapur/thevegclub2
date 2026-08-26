import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RESTAURANTS, bySlug } from '../../../data/restaurants'
import { getDeals } from '../../../lib/crm'
import DealCard from '../../../components/DealCard'
import { JsonLd, restaurant as restaurantSchema, offer, breadcrumbs } from '../../../lib/schema'
import { SITE, phoneDisplay } from '../../../lib/config'

export const revalidate = 300

export function generateStaticParams() {
  return RESTAURANTS.map(r => ({ slug: r.slug }))
}

const META = {
  '64-6': ['64/6 Buffet Sahibabad — Lunch & Dinner from ₹1,399', 'Breakfast, lunch and dinner buffet at 64/6, Sahibabad. Lunch 1+1 at ₹2,800 for two. Book for ₹50, coupon on WhatsApp.'],
  '3bs': ["3B’s Poolside Restaurant Sahibabad — 20% Off Food", 'Open-air poolside vegetarian dining in Sahibabad. North Indian, Chinese, Italian and Thai. 20% off the food bill. Reserve for ₹50.'],
  'tatva': ['Tatva Fine Dining Sahibabad — 20% Off the Food Bill', 'Indoor à la carte vegetarian fine dining in Sahibabad. 20% off food, all days. Book your table for ₹50.'],
  'little-italy': ['Little Italy Sahibabad — Italian Restaurant, 20% Off', 'Hand-tossed pizza and artisanal pasta on the terrace at Sahibabad. 20% off food. Reserve for ₹50.'],
}

export function generateMetadata({ params }) {
  const m = META[params.slug]
  const r = bySlug(params.slug)
  if (!r) return {}
  return {
    title: m?.[0] || `${r.name} — Sahibabad`,
    description: m?.[1] || r.about.slice(0, 150),
    alternates: { canonical: `/restaurants/${r.slug}` },
    openGraph: { images: [{ url: `/images/${r.photos[0]}.jpg`, width: 1100, height: 700 }] },
  }
}

export default async function RestaurantPage({ params }) {
  const r = bySlug(params.slug)
  if (!r) notFound()

  const { deals } = await getDeals()
  const mine = deals.filter(d => d.outlet === r.slug)

  return (
    <main>
      <JsonLd data={{ ...restaurantSchema(r), makesOffer: mine.map(d => offer(d, r)) }} />
      <JsonLd data={breadcrumbs([
        { name: 'Home', href: '/' },
        { name: 'Restaurants', href: '/restaurants' },
        { name: r.name, href: `/restaurants/${r.slug}` },
      ])} />

      <div className="wrap">
        <Link className="back" href="/restaurants" style={{ display: 'inline-block', textDecoration: 'none' }}>← All restaurants</Link>
        <div className="gal">
          <a><img src={`/images/${r.photos[0]}.jpg`} alt={r.about.slice(0, 80)} /></a>
        </div>
        <div className="galmore">
          {r.photos.slice(1).map(p => <img key={p} src={`/images/${p}.jpg`} alt="" loading="lazy" />)}
        </div>

        <div className="rhead">
          <h1>{r.name}</h1>
          <div className="chips">
            {['Pure vegetarian', ...r.cuisines.slice(0, 6)].map(c => <span key={c} className="chip">{c}</span>)}
          </div>
          <div className="facts">
            <div className="fact"><div className="k">Cost for two</div><div className="v">{r.costForTwo}</div></div>
            <div className="fact"><div className="k">Timings</div><div className="v">{r.hours}</div></div>
            <div className="fact"><div className="k">Group size</div><div className="v">Maximum {r.maxGuests} guests</div></div>
            <div className="fact"><div className="k">Good for</div><div className="v">{r.facilities.join(' · ')}</div></div>
          </div>
          <p className="about">{r.about}</p>
          <div className="ctarow">
            <Link className="btn" href="/book" style={{ textDecoration: 'none' }}>Book a table</Link>
            <a className="btn ghost" href={`tel:+${SITE.phone}`} style={{ textDecoration: 'none' }}>Call {phoneDisplay()}</a>
          </div>
        </div>

        <div className="sec">
          <h2>Deals at {r.name}</h2>
          <p className="sub">All prices include taxes. The ₹{SITE.fee} reservation fee is charged separately.</p>
          {mine.map(d => <DealCard key={d.slug} deal={d} restaurant={r} />)}
        </div>

        <div className="sec">
          <h2>Before you book</h2>
          <div className="tc">
            <h3>How to use this offer</h3>
            <ul>
              <li>Carry your voucher — a digital copy on your phone is fine.</li>
              <li>Prior reservation is mandatory.</li>
              <li>Maximum group size of {r.maxGuests} guests per reservation.</li>
              <li>This offer cannot be combined with any other discount or promotion.</li>
              <li>The ₹{SITE.fee} reservation fee is non-refundable and is not adjusted against your bill.</li>
              <li>Children under 5 eat free. Children 5 and above are charged at the adult deal rate.</li>
              <li>Sattvic dishes without onion or garlic on request — mention it when booking.</li>
            </ul>
            <p style={{ margin: '12px 0 0', fontSize: '13.5px' }}>
              Questions? Call <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

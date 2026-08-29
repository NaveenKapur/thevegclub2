import Link from 'next/link'
import { getDeals } from '../../lib/crm'
import { RESTAURANTS } from '../../data/restaurants'
import { HUBS, weekdayDeals } from '../../data/deals'
import DealCard from '../../components/DealCard'
import { JsonLd, offerList, breadcrumbs } from '../../lib/schema'
import { pageMeta } from '../../lib/seo'

export const revalidate = 300

export const metadata = pageMeta({
  title: 'Vegetarian Restaurant Deals in Delhi NCR',
  description: 'Every live vegetarian dining deal in Ghaziabad and Sahibabad — buffets from ₹1,399, 1+1 dinners, 20% off à la carte. ₹50 a person cover charge, redeemable.',
  path: '/deals',
  og: 'deals',
  imageAlt: 'Live vegetarian buffet coupons in Ghaziabad — up to 50% off the counter price',
})

export default async function Deals() {
  const { deals } = await getDeals()
  const bySlug = Object.fromEntries(RESTAURANTS.map(r => [r.slug, r]))
  const live = weekdayDeals(deals)

  return (
    <main>
      <JsonLd data={offerList(live, bySlug)} />
      <JsonLd data={breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Deals', href: '/deals' }])} />

      <div className="wrap intro">
        <h1>Veg buffet coupons in Ghaziabad</h1>
        <p className="offbanner">Get up to <b>50% off</b> the counter price</p>
        <p>Every weekday coupon at 64/6, Sahibabad. All prices include taxes; the ₹50 reservation fee is charged separately. Weekend rates differ and are listed on the <a href="/restaurants/64-6">64/6 page</a>.</p>
        <div className="chipsrow" style={{ marginTop: 16 }}>
          {Object.entries(HUBS).map(([slug, h]) => (
            <Link key={slug} className="pill" href={`/deals/${slug}`} style={{ textDecoration: 'none' }}>
              {h.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="wrap sec">
        {live.map(d => <DealCard key={d.slug + d.outlet} deal={d} restaurant={bySlug[d.outlet]} />)}
      </div>

      <div className="wrap sec">
        <h2>How the ₹50 works</h2>
        <p className="sub">Get up to 50% off the counter price. Choose a deal and fill the booking form — ₹50 per person cover charge, which is redeemable against your restaurant bill. Your coupon arrives on WhatsApp with a code; show it at the restaurant and the deal price is applied.</p>
      </div>
    </main>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RESTAURANTS, bySlug } from '../../../data/restaurants'
import { weekdayDeals, weekendDeals } from '../../../data/deals'
import { getDeals } from '../../../lib/crm'
import DealCard from '../../../components/DealCard'
import Faq from '../../../components/Faq'
import DealBox from '../../../components/DealBox'
import { JsonLd, restaurant as restaurantSchema, offer, breadcrumbs } from '../../../lib/schema'
import { SITE, phoneDisplay } from '../../../lib/config'

export const revalidate = 300

export function generateStaticParams() {
  return RESTAURANTS.map(r => ({ slug: r.slug }))
}

const META = {
  '64-6': ['64/6 Buffet Sahibabad — Lunch 1+1 ₹2,799 for Two', 'Vegetarian buffet at 64/6, Sahibabad. Weekday lunch 1+1 ₹2,799 for two, dinner 1+1 ₹3,299. Weekend rates listed separately. Book for ₹50.'],
  '3bs': ["3B's Poolside Restaurant, Sahibabad — Opening Soon", 'Open-air poolside vegetarian dining at Sahibabad. North Indian, Chinese, Italian and Thai. Coupons opening shortly.'],
  'tatva': ['Tatva Fine Dining, Sahibabad — Opening Soon', 'Indoor à la carte vegetarian fine dining with a full bar at Sahibabad. Coupons opening shortly.'],
  'skydeck': ['Skydeck Sahibabad — Terrace Venue for 50+ Guests', 'The open terrace at Sahibabad, hired whole for gatherings of 50 or more. Birthdays, anniversaries, corporate evenings. Quoted per event.'],
}

export function generateMetadata({ params }) {
  const r = bySlug(params.slug)
  if (!r) return {}
  const m = META[params.slug]
  return {
    title: m?.[0] || `${r.name} — Sahibabad`,
    description: m?.[1] || r.about.slice(0, 150),
    alternates: { canonical: `/restaurants/${r.slug}` },
    openGraph: { images: [{ url: `/images/${r.photos[0]}.jpg`, width: 1100, height: 700 }] },
  }
}

const TERMS = (r) => [
  { q: 'How do I use the coupon?', a: 'Carry your voucher — a digital copy on your phone is fine. Prior reservation is mandatory.' },
  { q: 'How many guests can I bring?', a: r.status === 'enquiry'
      ? `Skydeck is hired as a whole terrace, minimum ${r.minGroup} guests, up to ${r.maxGuests}.`
      : `Maximum ${r.maxGuests} guests per reservation under a coupon. Larger groups are quoted separately.` },
  { q: 'Can it be combined with another offer?', a: 'No. A coupon cannot be combined with any other discount or promotion.' },
  { q: 'What about children?', a: 'Children up to 5 years are complimentary and are not added to the bill at all. Children above 5 are counted as guests at the deal rate.' },
  { q: 'Can the kitchen cook without onion and garlic?', a: 'Yes — sattvic dishes without onion or garlic are prepared on request. Mention it when booking so the kitchen is ready.' },
  { q: 'Is the ₹50 refundable?', a: 'No. The ₹50 reservation fee is non-refundable and is not adjusted against your restaurant bill. It holds the table and locks the price.' },
]

export default async function RestaurantPage({ params }) {
  const r = bySlug(params.slug)
  if (!r) notFound()

  const { deals } = await getDeals()
  const mine = weekdayDeals(deals).filter(d => d.outlet === r.slug)
  const weekend = weekendDeals(deals).filter(d => d.outlet === r.slug)
  const live = r.status === 'live'
  const enquiry = r.status === 'enquiry'

  return (
    <main>
      <JsonLd data={{ ...restaurantSchema(r), ...(live ? { makesOffer: mine.map(d => offer(d, r)) } : {}) }} />
      <JsonLd data={breadcrumbs([
        { name: 'Home', href: '/' },
        { name: 'Restaurants', href: '/restaurants' },
        { name: r.name, href: `/restaurants/${r.slug}` },
      ])} />

      <div className="wrap">
        <Link className="back" href="/restaurants" style={{ display: 'inline-block', textDecoration: 'none' }}>← All restaurants</Link>
        <div className="gal"><a><img src={`/images/${r.photos[0]}.jpg`} alt={r.about.slice(0, 80)} /></a></div>
        <div className="galmore">
          {r.photos.slice(1).map(p => <img key={p} src={`/images/${p}.jpg`} alt="" loading="lazy" />)}
        </div>

        <div className="rhead">
          <div className="rtop">
            <div className="rtopmain">
              <h1>{r.name}</h1>
          <div className="chips">
            {r.status === 'coming_soon' ? <span className="chip" style={{ color: 'var(--brass)', fontWeight: 700 }}>Coupons coming soon</span> : null}
            {enquiry ? <span className="chip" style={{ color: 'var(--brass)', fontWeight: 700 }}>Minimum {r.minGroup} guests</span> : null}
            <span className="chip">Pure vegetarian</span>
            {r.cuisines.slice(0, 5).map(c => <span key={c} className="chip">{c}</span>)}
          </div>
          <div className="facts">
            <div className="fact"><div className="k">{enquiry ? 'Pricing' : 'Cost for two'}</div><div className="v">{r.costForTwo}</div></div>
            <div className="fact"><div className="k">Timings</div><div className="v">{r.hours}</div></div>
            <div className="fact"><div className="k">Group size</div>
              <div className="v">{enquiry ? `${r.minGroup}–${r.maxGuests} guests` : `Up to ${r.maxGuests} guests`}</div></div>
            <div className="fact"><div className="k">Good for</div><div className="v">{r.facilities.join(' · ')}</div></div>
          </div>
          <p className="about">{r.about}</p>

          <div className="ctarow">
            {live ? <Link className="btn" href="/book" style={{ textDecoration: 'none' }}>Book a table</Link> : null}
            {enquiry ? <Link className="btn" href={`/book?enquiry=${r.slug}`} style={{ textDecoration: 'none' }}>Enquire about a date</Link> : null}
            <a className="btn ghost" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to ask about ${r.name}`)}`}
               target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>Ask on WhatsApp</a>
          </div>
            </div>
            <DealBox from={1399} compact at={live ? null : '64/6'} />
          </div>
        </div>

        {/* ── weekday deals ── */}
        {live && mine.length ? (
          <div className="sec">
            <h2>Weekday coupons</h2>
            <p className="sub">Monday to Friday. All prices include taxes. The ₹{SITE.fee} reservation fee is charged separately.</p>
            {mine.map(d => <DealCard key={d.slug} deal={d} restaurant={r} />)}
          </div>
        ) : null}

        {/* ── weekend deals, kept apart because the rates differ ── */}
        {live && weekend.length ? (
          <div className="sec">
            <h2>Weekend coupons</h2>
            <p className="sub">Saturday and Sunday rates are different from weekdays — these apply only on those two days.</p>
            <div className="weekend">
              {weekend.map(d => <DealCard key={d.slug} deal={d} restaurant={r} />)}
            </div>
          </div>
        ) : null}

        {/* ── coming soon ── */}
        {r.status === 'coming_soon' ? (
          <div className="sec">
            <h2>Coupons coming soon</h2>
            <p className="sub">{r.name} is not selling coupons yet. Message us on WhatsApp and we will tell you the day it opens — or book at 64/6 in the meantime.</p>
            <div className="ctarow">
              <Link className="btn" href="/restaurants/64-6" style={{ textDecoration: 'none' }}>See 64/6 deals</Link>
              <a className="btn ghost" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Tell me when ${r.name} coupons open`)}`}
                 target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>Notify me</a>
            </div>
          </div>
        ) : null}

        {/* ── enquiry-only venue ── */}
        {enquiry ? (
          <div className="sec">
            <h2>Hiring Skydeck</h2>
            <p className="sub">Skydeck is not sold as a ₹{SITE.fee} coupon. The terrace is taken as a whole for gatherings of {r.minGroup} or more, and priced per event — menu, bar, duration and headcount all change the quote.</p>
            <div className="tc">
              <h3>Tell us four things and we will quote</h3>
              <ul>
                <li>Your date, and whether it is flexible</li>
                <li>Expected headcount — minimum {r.minGroup}, up to {r.maxGuests}</li>
                <li>The occasion: birthday, anniversary, corporate evening, reception</li>
                <li>Whether you want the bar open, and any music or DJ</li>
              </ul>
              <div className="ctarow">
                <Link className="btn" href={`/book?enquiry=${r.slug}`} style={{ textDecoration: 'none' }}>Send an enquiry</Link>
                <a className="btn ghost" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi, I want to enquire about hiring Skydeck')}`}
                   target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>WhatsApp us</a>
              </div>
            </div>
          </div>
        ) : null}

        <div className="sec">
          <h2>Before you book</h2>
          <Faq items={TERMS(r)} />
          <p className="sub" style={{ marginTop: 16 }}>
            Questions? Call <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>
          </p>
        </div>
      </div>
    </main>
  )
}

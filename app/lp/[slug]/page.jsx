import './lp.css'
import { notFound } from 'next/navigation'
import { LANDING, GALLERY } from './config'
import LandingClient from './LandingClient'

/*  Ad landing pages.
 *
 *  noindex on purpose — see the SEO blueprint. These are near-duplicates of the
 *  /deals pages; if Google indexed them they would compete with the pages that
 *  are meant to rank, and get flagged as thin duplicates.
 */
export const dynamic = 'force-static'

export function generateStaticParams() {
  return Object.keys(LANDING).map(slug => ({ slug }))
}

export function generateMetadata({ params }) {
  const lp = LANDING[params.slug]
  if (!lp) return {}
  return {
    title: `${lp.offer} — ₹${lp.price.toLocaleString('en-IN')} for two | Sahibabad`,
    description: lp.sub,
    robots: { index: false, follow: true },   // never indexed
    alternates: {},
  }
}

const money = n => Number(n).toLocaleString('en-IN')

export default function Landing({ params }) {
  const lp = LANDING[params.slug]
  if (!lp) notFound()

  return (
    <div className="lp">
      <header className="hero">
        <div className="bg"><img src={`/images/${lp.hero}.jpg`} alt="" /></div>
        <div className="scrim" />
        <div className="wrap">
          <p className="eyebrow r d1"><span className="dot" />{lp.eyebrow}</p>
          <h1 className="r d2">{lp.h1a}<br /><em>{lp.h1b}</em></h1>
          <p className="sub r d3">{lp.sub}</p>

          <div className="price r d4">
            <span className="now">₹{money(lp.price)}</span>
            <div className="col">
              <span className="was">Counter price ₹{money(lp.was)}</span>
              <span className="per">₹{money(lp.perGuest)} per guest · all taxes included</span>
            </div>
            <span className="save">SAVE {lp.savePct}%</span>
          </div>

          <div className="ctas r d5">
            <a className="cta" href="#book">Book for ₹50 →</a>
            <a className="cta ghost" href="tel:+919988119793">Call to book</a>
          </div>

          <div className="trust r d6">
            <span>Pure vegetarian</span>
            <span>No onion no garlic on request</span>
            <span>Coupon on WhatsApp</span>
            <span>Not on Zomato or Dineout</span>
          </div>
        </div>
      </header>

      <LandingClient lp={{ ...lp, key: params.slug }} gallery={GALLERY} />

      <footer>
        <div className="wrap">
          <b>{lp.outlet} at Country Inn &amp; Suites by Radisson, Sahibabad, Ghaziabad</b> · +91 99881 19793
          <p>{lp.terms} Children under 5 complimentary; 5 and above at the adult deal rate. The ₹50 reservation fee is non-refundable and is not adjusted against the restaurant bill.</p>
        </div>
      </footer>
    </div>
  )
}

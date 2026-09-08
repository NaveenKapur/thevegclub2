'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* The announcement strip and footer belong to the website, not to an ad
   landing page. On /lp/* the page stands alone. */
/*  The announcement strip was removed on Sir's instruction (28 Aug 2026).
 *  Kept as a no-op export so nothing that still imports it breaks.
 */
export function TopStrip() { return null }

const LEGAL_LINKS = [
  ['/terms', 'Terms & Conditions'],
  ['/privacy', 'Privacy Policy'],
  ['/refunds', 'Cancellation & Refund Policy'],
  ['/booking-policy', 'Booking Policy'],
  ['/contact', 'Contact Us'],
  ['/shipping', 'Shipping / Delivery Policy'],
  ['/about', 'About'],
]

/*  The footer carries the merchant's legal identity, because it is the one
 *  thing on every page and the first place a payment provider's reviewer
 *  looks. `legal` is fetched server-side in the root layout and handed down —
 *  this component stays a client component only because it needs the pathname
 *  to stand aside on /lp/*, and a client component must not be doing network
 *  calls for a footer.
 *
 *  An identifier the CRM has not been given renders as nothing at all. There
 *  is deliberately no "N/A" branch anywhere below.
 */
export function SiteFooter({ legal }) {
  const path = usePathname()
  if (path?.startsWith('/lp/')) return null

  const addressLines = String(legal?.address || '').split('\n').map(s => s.trim()).filter(Boolean)
  const registration = [
    legal?.gstin ? `GSTIN: ${legal.gstin}` : '',
    legal?.cin ? `CIN: ${legal.cin}` : '',
  ].filter(Boolean).join(' · ')

  return (
    <footer>
      <div className="wrap ftr">
        <div className="ftr-id">
          <p className="ftr-name">
            <b>{legal?.tradingName || 'The Veg Club'}</b>
            {legal?.relationship ? <> — {legal.relationship}</> : null}
          </p>
          {addressLines.length ? (
            <address className="ftr-addr">
              {addressLines.map((l, i) => <span key={i}>{l}<br /></span>)}
            </address>
          ) : null}
          {registration ? <p className="ftr-reg">{registration}</p> : null}
          <p className="ftr-outlets">64/6 · 3B’s · Tatva · Skydeck — Sahibabad, Ghaziabad</p>
        </div>

        <nav className="ftr-links" aria-label="Legal and policy">
          {LEGAL_LINKS.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        {/*  A technology credit, not a merchant identity. Kept small and set
            apart so it can never be mistaken for the entity behind the
            payment.  */}
        <p className="ftr-credit">
          <a
            href="https://www.cabainnovatives.net"
            target="_blank"
            rel="noopener"
            title="Software Development & Digital Marketing Company"
            aria-label="Powered by CABA Innovatives — Software Development & Digital Marketing Company"
          >
            Powered by CABA Innovatives
          </a>
        </p>
      </div>
    </footer>
  )
}

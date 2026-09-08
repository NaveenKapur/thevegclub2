import Link from 'next/link'
import { getLegal, addressLines, registrationLine } from '../lib/legal'
import { CHARGE_TERMS } from '../lib/pricing'

/*  The shell every legal and compliance page sits in.
 *
 *  Seven pages that a payment provider, and occasionally a regulator, will
 *  read side by side. They must agree with each other, so they share one
 *  layout, one type scale, and — crucially — one source for the merchant
 *  identity block at the foot of each: whatever the CRM says today.
 */

export function ChargeRule() {
  return (
    <p className="legal-rule">
      <b>{CHARGE_TERMS.headline}</b>
    </p>
  )
}

/*  Who you are contracting with. Rendered on every legal page so a reviewer
 *  landing on any single one of them can identify the merchant without
 *  hunting. An identifier the CRM has not been given prints nothing — never
 *  a dash, never "N/A". */
export function MerchantIdentity({ legal, heading = 'Merchant details' }) {
  const lines = addressLines(legal)
  const registration = registrationLine(legal)
  return (
    <section className="legal-merchant">
      <h2>{heading}</h2>
      <p className="legal-merchant-name">
        <b>{legal.tradingName}</b>
        <br />
        {legal.relationship}
      </p>
      {lines.length ? (
        <address>
          {lines.map((l, i) => (
            <span key={i}>
              {l}
              <br />
            </span>
          ))}
        </address>
      ) : null}
      {registration ? <p className="legal-reg">{registration}</p> : null}
    </section>
  )
}

export default async function LegalPage({ title, lede, updated, children }) {
  const legal = await getLegal()
  return (
    <main className="wrap legal">
      <p className="legal-eyebrow">{legal.tradingName} · Legal &amp; Compliance</p>
      <h1>{title}</h1>
      {lede ? <p className="legal-lede">{lede}</p> : null}
      <div className="legal-body">{children}</div>
      <MerchantIdentity legal={legal} />
      {updated ? <p className="legal-updated">Last updated {updated}.</p> : null}
      <p className="legal-back">
        <Link href="/">Back to The Veg Club</Link>
      </p>
    </main>
  )
}

import Link from 'next/link'
import { money } from '../lib/pricing'

export function saving(d) { return d.savingPct ?? null }

export default function DealCard({ deal, restaurant }) {
  const off = deal.savingPct
  const pair = deal.type === 'one_plus_one'
  return (
    <div className="deal">
      <div className="nm">
        {deal.name}
        {off ? <span className={'badge' + (off >= 50 ? '' : ' q')}>{off}% off</span> : null}
      </div>

      <div className="mt">
        <span>{restaurant?.name || deal.outlet}</span>
        <span>{deal.note}</span>
      </div>

      <div className="pr">
        <span className="a">{money(pair ? deal.priceTotal : deal.pricePerGuest)}</span>
        <span className="b">{pair ? `${money(deal.pricePerGuest)} per guest` : 'per guest'}</span>
      </div>

      {/* Rack comparison — this is what makes the deal feel like a deal. */}
      <div className="rack" style={{ gridColumn: '1 / -1' }}>
        <span>Counter price <s>{money(deal.rackTotal)}</s></span>
        <b>You save {money(deal.saving)}{off ? <em> ({off}% Discount)</em> : null}</b>
      </div>

      <div className="cta">
        <Link className="btn ghost" href="/book" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Book this deal
        </Link>
      </div>
    </div>
  )
}

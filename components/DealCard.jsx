import Link from 'next/link'

const money = n => '₹' + Number(n).toLocaleString('en-IN')

export function saving(d) {
  if (d.percentOff) return d.percentOff
  if (d.rack && d.pricePerGuest) return Math.round((1 - d.pricePerGuest / d.rack) * 100)
  return null
}

export default function DealCard({ deal, restaurant }) {
  const off = saving(deal)
  return (
    <div className="deal">
      <div className="nm">
        {deal.name}
        {off ? <span className={'badge' + (off >= 50 ? '' : ' q')}>{off}% off</span> : null}
      </div>
      <div className="mt">
        <span>{restaurant?.name || deal.outlet}</span>
        <span>{deal.note}</span>
        <span>Min {deal.minGuests} guest{deal.minGuests > 1 ? 's' : ''}</span>
      </div>
      <div className="pr">
        {deal.priceTotal ? (
          <><span className="a">{money(deal.priceTotal)}</span><span className="b">{money(deal.pricePerGuest)} per guest</span></>
        ) : deal.pricePerGuest ? (
          <><span className="a">{money(deal.pricePerGuest)}</span><span className="b">per guest</span></>
        ) : (
          <><span className="a">{deal.percentOff}%</span><span className="b">off food</span></>
        )}
      </div>
      <div className="cta">
        <Link className="btn ghost" href={`/book?deal=${deal.slug}`} style={{ textDecoration: 'none', display: 'inline-block' }}>
          Book this deal
        </Link>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { RESTAURANTS } from '../../data/restaurants'

export const metadata = {
  title: 'Vegetarian Restaurants in Ghaziabad — Menus & Prices',
  description: 'Four pure vegetarian restaurants at Sahibabad — buffet, poolside, fine dining and Italian. Menus, prices and live deals.',
  alternates: { canonical: '/restaurants' },
}

export default function Restaurants() {
  return (
    <main>
      <div className="wrap intro">
        <h1>Vegetarian restaurants in Ghaziabad</h1>
        <p>Four pure vegetarian restaurants in Sahibabad. Tap any one for photos, menu and its live deals.</p>
      </div>
      <div className="wrap sec">
        <div className="cards">
          {RESTAURANTS.map(r => (
            <Link key={r.slug} href={`/restaurants/${r.slug}`} className="card" style={{ textDecoration: 'none' }}>
              <div className="ph"><img src={`/images/${r.photos[0]}.jpg`} alt={r.name} loading="lazy" /></div>
              <div className="body">
                <h3>{r.name}</h3>
                <div className="meta">{r.kind} · {r.costForTwo}</div>
                <div className="go">View photos &amp; deals →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

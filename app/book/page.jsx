import { getDeals } from '../../lib/crm'
import { LIVE } from '../../data/restaurants'
import { weekdayDeals, weekendDeals } from '../../data/deals'
import BookingForm from '../../components/BookingForm'
import { SITE } from '../../lib/config'

export const revalidate = 300

export const metadata = {
  title: 'Book a Table — The Veg Club, Sahibabad',
  description: 'Reserve a table at a vegetarian restaurant in Sahibabad. Pay ₹50 to hold your table, get your coupon on WhatsApp, show it at the restaurant.',
  alternates: { canonical: '/book' },
  robots: { index: true, follow: true },
}

export default async function Book({ searchParams }) {
  const { deals } = await getDeals()
  const sp = await searchParams
  return (
    <main>
      <div className="formwrap">
        <div className="wrap bk">
          <h1 style={{ fontSize: 'clamp(24px,5.6vw,32px)', letterSpacing: '-.02em', color: 'var(--on-forest)' }}>
            Book a table
          </h1>
          <div className="slip" style={{ marginTop: 18 }}>
            <BookingForm
              deals={[...weekdayDeals(deals), ...weekendDeals(deals)]}
              restaurants={LIVE()}
              preselect={sp?.deal || ''}
              fee={SITE.fee}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

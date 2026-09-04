/*  /book/status/[ref] — server wrapper.
 *
 *  Kept deliberately thin: the reference comes from the path, everything else
 *  is decided by the CRM through our own server route. Not indexed — a booking
 *  reference is not a public page.
 */
import StatusClient from './StatusClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your reservation · The Veg Club',
  robots: { index: false, follow: false },
}

export default async function BookingStatusPage({ params }) {
  const { ref } = await params
  return (
    <main className="wrap">
      <StatusClient reference={ref} />
    </main>
  )
}

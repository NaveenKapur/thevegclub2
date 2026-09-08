import LegalPage from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'

export const metadata = pageMeta({
  title: 'Shipping & Delivery Policy',
  description:
    'The Veg Club provides restaurant reservations and dining offers. No physical goods are shipped; confirmations, receipts and coupons are delivered electronically.',
  path: '/shipping',
})

export default function Shipping() {
  return (
    <LegalPage
      title="Shipping & Delivery Policy"
      lede="This page exists because payment providers expect one. The short answer is that nothing is shipped."
      updated="8 September 2026"
    >
      <h2>No physical goods are shipped</h2>
      <p>
        thevegclub.com provides <b>restaurant reservations and dining-related offers</b> for
        participating hotel restaurants. The transaction you complete on this website is a table
        reservation and its booking charge.
      </p>
      <p>
        <b>No physical goods are sold or shipped as part of that transaction.</b> Shipping and delivery
        of physical goods is therefore not applicable to this service, and no shipping charge, courier,
        tracking or delivery timeline arises.
      </p>

      <h2>What you receive, and how</h2>
      <p>Everything is delivered electronically, immediately after your payment is confirmed:</p>
      <ul>
        <li>your <b>reservation reference</b>, shown on screen;</li>
        <li>your <b>receipt</b>, which you can view, print or save from the confirmation page;</li>
        <li>
          your <b>coupon</b>, where one applies — shown on screen with its own page and QR code, so it
          can be presented at the restaurant from your phone.
        </li>
      </ul>
      <p>
        Booking updates are also sent to the mobile number on the reservation, and to your email
        address if you gave one, through our configured communication channels.
      </p>

      <h2>Taking delivery of the service itself</h2>
      <p>
        The dining service is provided in person at the restaurant, at the hotel, on the date, session
        and time of your reservation. Please see our{' '}
        <a href="/booking-policy">Booking &amp; Reservation Policy</a>.
      </p>

      <h2>If something does not arrive</h2>
      <p>
        If your confirmation, receipt or coupon does not appear, you can return to your booking at any
        time using your reservation reference, or contact us — see{' '}
        <a href="/contact">Contact Us &amp; Grievance</a>.
      </p>
    </LegalPage>
  )
}

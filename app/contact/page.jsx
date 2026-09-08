import LegalPage from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'
import { SITE, phoneDisplay } from '../../lib/config'

export const metadata = pageMeta({
  title: 'Contact Us & Grievance',
  description:
    'How to reach The Veg Club, a unit of Magnum Ventures Ltd. — telephone, WhatsApp and registered address — and how to raise a grievance.',
  path: '/contact',
})

export default function Contact() {
  const wa = `https://wa.me/${SITE.whatsapp}`
  return (
    <LegalPage
      title="Contact Us & Grievance"
      lede="For anything about a reservation, a payment, a coupon or a complaint, these are the ways to reach us."
      updated="8 September 2026"
    >
      <h2>Talk to us</h2>
      <ul>
        <li>
          <b>Telephone:</b> <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>
        </li>
        <li>
          <b>WhatsApp:</b>{' '}
          <a href={wa} target="_blank" rel="noopener">
            {phoneDisplay(SITE.whatsapp)}
          </a>
        </li>
      </ul>
      <p>
        Please have your <b>reservation reference</b> ready — it is the fastest way for us to find your
        booking, your payment and your coupon.
      </p>

      <h2>Write to us</h2>
      <p>Our registered address is set out under Merchant details below.</p>

      <h2>Raising a grievance</h2>
      <p>
        If something has gone wrong — a payment you cannot account for, a coupon that was not honoured,
        a reservation that was not held, or the way your personal information has been handled — please
        raise it with us directly on the number above, or in writing to the address below.
      </p>
      <p>Please include:</p>
      <ul>
        <li>your reservation reference;</li>
        <li>the date and restaurant of the booking;</li>
        <li>the mobile number the booking was made with;</li>
        <li>what happened, and what you would like us to do.</li>
      </ul>
      <p>
        We will acknowledge your grievance and work to resolve it. If it concerns a payment, we may
        need to trace the transaction with our payment provider before we can respond fully.
      </p>

      <h2>Related pages</h2>
      <ul>
        <li>
          <a href="/refunds">Cancellation &amp; Refund Policy</a> — what happens to the booking charge.
        </li>
        <li>
          <a href="/booking-policy">Booking &amp; Reservation Policy</a> — how a reservation works.
        </li>
        <li>
          <a href="/privacy">Privacy Policy</a> — what we hold about you and your choices.
        </li>
      </ul>
    </LegalPage>
  )
}

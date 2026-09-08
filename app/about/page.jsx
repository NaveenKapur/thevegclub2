import LegalPage, { ChargeRule } from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'
import { SITE, phoneDisplay } from '../../lib/config'

export const metadata = pageMeta({
  title: 'About & Merchant Information',
  description:
    'The Veg Club is a unit of Magnum Ventures Ltd. — a restaurant reservation and dining-offers platform for participating hotel restaurants in Delhi NCR.',
  path: '/about',
})

export default function About() {
  return (
    <LegalPage
      title="About & Merchant Information"
      lede="Who we are, what this website does, and how to verify us."
      updated="8 September 2026"
    >
      <h2>The Veg Club is a unit of Magnum Ventures Ltd.</h2>
      <p>
        The Veg Club is the brand under which Magnum Ventures Ltd. operates this website. Magnum
        Ventures Ltd. is the legal entity you contract with when you make a reservation here, and it is
        the merchant of record for any payment you make. Its registered details appear under Merchant
        details below.
      </p>

      <h2>What we do</h2>
      <p>
        The Veg Club is a <b>restaurant reservation and dining-offers platform</b> for participating
        hotel restaurants in Delhi NCR. Through it you can:
      </p>
      <ul>
        <li>see the vegetarian buffet and dining offers currently running;</li>
        <li>compare an offer against the restaurant’s counter price;</li>
        <li>
          reserve a table at a participating restaurant for a specific date, meal session and time;
        </li>
        <li>pay the booking charge and receive a reference, a receipt and, where applicable, a coupon.</li>
      </ul>
      <p>
        We are not a food delivery or takeaway service, and we do not sell physical goods. The meal
        itself is prepared and served by the restaurant at the hotel, which bills you for what you
        consume at the table.
      </p>

      <h2>What you pay us</h2>
      <ChargeRule />
      <p>
        That is the only amount this website charges. Everything else is settled with the restaurant.
        Full details are in our <a href="/booking-policy">Booking &amp; Reservation Policy</a> and{' '}
        <a href="/refunds">Cancellation &amp; Refund Policy</a>.
      </p>

      <h2>Where we operate</h2>
      <p>
        Our participating restaurants are in Sahibabad, Ghaziabad, in the Delhi NCR region. Each
        restaurant’s page on this website sets out its own sessions, service windows and offers.
      </p>

      <h2>Getting in touch</h2>
      <p>
        Call <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>, or see{' '}
        <a href="/contact">Contact Us &amp; Grievance</a>. Our full legal identity, registered address,
        GSTIN and CIN are shown below.
      </p>
    </LegalPage>
  )
}

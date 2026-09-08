import LegalPage, { ChargeRule } from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'
import { SITE, phoneDisplay } from '../../lib/config'

export const metadata = pageMeta({
  title: 'Terms & Conditions',
  description:
    'The terms on which The Veg Club, a unit of Magnum Ventures Ltd., accepts restaurant reservations and the ₹50 per payable guest cover charge.',
  path: '/terms',
})

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lede="These terms govern your use of thevegclub.com and any reservation you make through it. Please read them before you book."
      updated="8 September 2026"
    >
      <h2>1. Who you are dealing with</h2>
      <p>
        The Veg Club is a unit of Magnum Ventures Ltd. References to “we”, “us” and “our” on this
        website mean Magnum Ventures Ltd. trading as The Veg Club. Full merchant details appear at the
        foot of this page.
      </p>

      <h2>2. What this website does</h2>
      <p>
        This website is a reservation and dining-offers platform for participating hotel restaurants.
        Through it you can view current dining offers, choose a restaurant, date, meal session and
        time, and reserve a table. It is not a food-ordering, delivery or takeaway service, and no
        physical goods are sold through it.
      </p>
      <p>
        Your meal itself is prepared and served by the restaurant at the hotel, and your consumption
        at the table is billed to you there.
      </p>

      <h2>3. The booking charge</h2>
      <ChargeRule />
      <ul>
        <li>The charge is <b>₹50 for each payable guest</b> on the reservation.</li>
        <li>
          Children up to 5 years of age are complimentary under the current reservation policy. They
          are not counted as payable guests and no cover charge is taken for them.
        </li>
        <li>The charge is <b>non-refundable</b>. It has no cash value and is not redeemable for cash.</li>
        <li>
          It is <b>adjustable only against your final restaurant bill at the hotel</b>, for the
          reservation it was paid for.
        </li>
        <li>
          It is not a separate purchase of food, and it is not a physical product. It secures your
          table and the price shown at the time of booking.
        </li>
        <li>
          It is not transferable to another booking or another person. If a published offer expressly
          permits otherwise, the terms of that offer apply.
        </li>
      </ul>
      <p>
        The amount payable is calculated and confirmed by our reservation system at the time you book,
        and the figure shown to you before payment is the figure charged.
      </p>

      <h2>4. Reservations</h2>
      <p>
        Every reservation is subject to availability for the restaurant, date, meal session and time
        you select. A reservation is confirmed only when payment of the booking charge has been
        successfully received and our system has recorded it. Until then your table is held but not
        confirmed.
      </p>
      <p>
        On arrival you may be asked to present your reservation reference or coupon. Where a coupon is
        issued, it remains subject to validation by our system at the restaurant; scanning a coupon
        does not by itself redeem it.
      </p>

      <h2>5. Offers and deals</h2>
      <p>
        Individual offers may carry their own conditions — days of the week, meal sessions, minimum or
        maximum guest counts, validity dates or a specific restaurant. Where an offer’s stated
        conditions differ from these general terms, the offer’s conditions apply to that booking.
        Prices and offers may change, and menus and counter prices are set by the restaurant.
      </p>

      <h2>6. Your conduct</h2>
      <p>
        You agree to give accurate booking details and to use this website only for genuine
        reservations. We may cancel a reservation, decline future bookings, or void a coupon where we
        reasonably believe there has been fraud, misuse of an offer or coupon, abusive behaviour
        towards our staff or the restaurant’s staff, or an attempt to interfere with this website or
        our systems.
      </p>

      <h2>7. Availability of the website and payments</h2>
      <p>
        We aim to keep this website and the payment process available, but we cannot guarantee
        uninterrupted access. Maintenance, technical faults, network problems and interruptions at our
        payment provider can all prevent a booking or a payment from completing. Where a payment does
        not complete, your table is not confirmed and you may attempt payment again on the same
        reservation.
      </p>

      <h2>8. Payments</h2>
      <p>
        Payments are taken through our payment provider’s own secure hosted page. Your card or account
        credentials are entered with that provider and are not collected or stored by The Veg Club.
        See our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by and construed in accordance with the laws of India. Subject to any
        right you have under applicable consumer law to proceed elsewhere, the courts having
        jurisdiction over Ghaziabad, Uttar Pradesh shall have jurisdiction over any dispute arising
        out of them.
      </p>

      <h2>10. Contacting us</h2>
      <p>
        For any question, complaint or grievance about a reservation, a payment or these terms, please
        see <a href="/contact">Contact Us &amp; Grievance</a>, or call us on{' '}
        <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these terms. The version published on this page at the time you make a booking is
        the version that applies to it.
      </p>
    </LegalPage>
  )
}

import LegalPage from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'
import { SITE, phoneDisplay } from '../../lib/config'

export const metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'What The Veg Club, a unit of Magnum Ventures Ltd., collects when you reserve a table, why, who it is shared with, and how to contact us about it.',
  path: '/privacy',
})

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lede="This policy describes what we collect when you reserve a table through thevegclub.com, why we collect it, and who else sees it."
      updated="8 September 2026"
    >
      <h2>1. What we collect</h2>
      <p>When you make a reservation we collect:</p>
      <ul>
        <li><b>Your name</b>, as given for the booking.</li>
        <li><b>Your mobile number</b>, which is also where booking updates are sent.</li>
        <li><b>Your email address</b>, only if you choose to give one — it is optional.</li>
        <li>
          <b>Your booking details</b> — restaurant, date, meal session, time, number of adults and
          children, and any special request you type in.
        </li>
        <li>
          <b>Payment status and reference</b> returned to us by our payment provider, so we know
          whether your booking is paid and can produce your receipt.
        </li>
        <li>
          <b>Basic technical and referral data</b> — whether you are on a mobile or desktop browser,
          the page that referred you, and campaign parameters present in the link you arrived on.
        </li>
      </ul>
      <p>
        We do <b>not</b> collect or store your card number, CVV, UPI PIN, net-banking credentials or
        any other payment credential. Those are entered on our payment provider’s own secure hosted
        page and never reach The Veg Club.
      </p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To create, hold, confirm and administer your reservation.</li>
        <li>To take and verify payment of the booking charge, and to issue your receipt.</li>
        <li>To issue and validate the coupon associated with a paid reservation.</li>
        <li>
          To send you service messages about your own booking — confirmation, your coupon, changes,
          and reminders.
        </li>
        <li>To answer your questions and handle complaints.</li>
        <li>To keep our own records of bookings, payments and coupon redemptions.</li>
      </ul>
      <p>
        <b>Promotional messages are separate.</b> We send marketing or promotional communication only
        where the applicable consent has been recorded for your contact details. Service messages about
        a booking you have actually made are not promotional messages.
      </p>

      <h2>3. Who we share it with</h2>
      <ul>
        <li>
          <b>The restaurant at the hotel</b> that is serving your reservation, so your table is ready
          and your coupon can be honoured.
        </li>
        <li>
          <b>Our payment provider</b>, to raise and verify your payment. What is exchanged is what is
          needed to process and confirm that payment.
        </li>
        <li>
          <b>Service providers</b> who operate our booking system and messaging on our behalf, under
          our instructions.
        </li>
        <li>
          Where we are required to do so by law, or by a lawful request from a public authority.
        </li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>4. Security</h2>
      <p>
        Traffic between your browser and this website, and between this website and our booking system,
        is encrypted in transit. Access to booking records is restricted to accounts that need it, and
        actions taken on those records are logged. No system can be guaranteed absolutely secure, but
        keeping payment credentials out of our systems entirely is a deliberate part of how we reduce
        that risk.
      </p>

      <h2>5. How long we keep it</h2>
      <p>
        We keep reservation, payment and coupon records for as long as needed to administer your
        booking and any question arising from it, and thereafter for the period required for our
        accounting, tax and legal obligations, or to defend a legal claim. Records we no longer need
        for those purposes are not kept indefinitely.
      </p>

      <h2>6. Your choices</h2>
      <p>
        You can ask us what we hold about you, ask us to correct it, ask us to stop sending promotional
        messages, or raise a concern about how we have handled it. Please use the details on our{' '}
        <a href="/contact">Contact Us &amp; Grievance</a> page, or call{' '}
        <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>. We may need to confirm your identity
        against the booking before we act on a request.
      </p>
      <p>
        Withdrawing consent for promotional messages does not stop service messages about a live
        booking, and does not undo processing already carried out.
      </p>

      <h2>7. Children</h2>
      <p>
        This website is intended for adults making a reservation. We do not knowingly collect personal
        information directly from children. Where a booking includes children, we hold only the number
        of children on the reservation, so the table and the complimentary under-5 rule are correct.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this policy. The version published here is the current one, and the date below
        shows when it last changed.
      </p>
    </LegalPage>
  )
}

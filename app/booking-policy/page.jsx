import LegalPage, { ChargeRule } from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'

export const metadata = pageMeta({
  title: 'Booking & Reservation Policy',
  description:
    'How a table is reserved at The Veg Club: availability, payable guests, the ₹50 per payable guest charge, your coupon, and what happens at the restaurant.',
  path: '/booking-policy',
})

export default function BookingPolicy() {
  return (
    <LegalPage
      title="Booking & Reservation Policy"
      lede="How a reservation is made, what you pay now, and what happens when you arrive."
      updated="8 September 2026"
    >
      <h2>1. Availability</h2>
      <p>
        Every reservation is subject to availability. When you book you choose the restaurant, the
        date, the meal session and a time slot within that session’s service window. If the
        combination you want is not available, it cannot be booked.
      </p>

      <h2>2. Guests</h2>
      <ul>
        <li>You tell us the number of adults and the number of children up to 5 years of age.</li>
        <li>
          <b>Payable guests</b> are the adults on the reservation. The booking charge is calculated on
          payable guests only.
        </li>
        <li>
          <b>Children up to 5 years are complimentary</b> under the current reservation policy. They
          are counted for the table, not for the charge, and no cover charge is taken for them.
        </li>
      </ul>

      <h2>3. What you pay at the time of booking</h2>
      <ChargeRule />
      <p>
        The amount is ₹50 for each payable guest. The figure is calculated and confirmed by our
        reservation system, and the amount shown to you before you pay is the amount charged.
      </p>

      <h2>4. Confirmation</h2>
      <p>
        Your table is held as soon as you submit the booking, and your reservation is{' '}
        <b>confirmed once the payment has been successfully received</b> and recorded by our system.
        A payment page that has closed, or a link that says a payment succeeded, is not confirmation
        on its own — our system’s record is.
      </p>
      <p>
        On confirmation you receive your reservation reference, a receipt you can view or print, and,
        where applicable, your coupon.
      </p>

      <h2>5. Your coupon and reference</h2>
      <ul>
        <li>Show your coupon or quote your reservation reference at the restaurant on arrival.</li>
        <li>
          A coupon remains subject to validation by our system at the restaurant. <b>Scanning a coupon
          does not by itself redeem it</b> — the restaurant’s till confirms the redemption.
        </li>
        <li>
          The amount you paid is then <b>adjusted against your final restaurant bill at the hotel</b>{' '}
          for that reservation.
        </li>
      </ul>

      <h2>6. If the payment does not go through</h2>
      <p>
        Your booking is not lost. The same reservation stays held and you can attempt payment again on
        it — it remains the same booking, not a new one. An unpaid reservation is not a confirmed
        table and may lapse.
      </p>

      <h2>7. No-show and non-refundable rule</h2>
      <p>
        The booking charge is non-refundable, including if you do not arrive. See our{' '}
        <a href="/refunds">Cancellation &amp; Refund Policy</a>.
      </p>

      <h2>8. Offer conditions</h2>
      <p>
        Where a specific deal or offer is clearly displayed with its own conditions — days, sessions,
        guest counts, validity or restaurant — those conditions apply to a booking made under it and
        prevail over the general position described here.
      </p>

      <h2>9. At the restaurant</h2>
      <p>
        Your meal is prepared and served by the restaurant at the hotel, and what you consume is billed
        to you there. Menus, counter prices and service are the restaurant’s.
      </p>
    </LegalPage>
  )
}

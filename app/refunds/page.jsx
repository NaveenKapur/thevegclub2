import LegalPage, { ChargeRule } from '../../components/LegalPage'
import { pageMeta } from '../../lib/seo'
import { SITE, phoneDisplay } from '../../lib/config'

export const metadata = pageMeta({
  title: 'Cancellation & Refund Policy',
  description:
    'The ₹50 per payable guest booking charge is non-refundable and is adjustable only against your final restaurant bill at the hotel.',
  path: '/refunds',
})

export default function Refunds() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      lede="Please read this before you pay. It explains exactly what happens to the booking charge."
      updated="8 September 2026"
    >
      <h2>Amounts paid as the booking charge are non-refundable</h2>
      <ChargeRule />
      <p>
        The ₹50 per payable guest booking charge is taken to hold your table and lock the price shown
        to you. It is <b>not refundable</b>.
      </p>

      <h2>What the charge can be used for</h2>
      <ul>
        <li>
          It is <b>adjustable only against your final restaurant bill at the hotel</b>, for the
          reservation it was paid for.
        </li>
        <li>It has <b>no cash value</b>. It cannot be paid out in cash or returned to your card as cash.</li>
        <li>
          It is <b>not transferable</b> to another booking, another date or another person, unless a
          published offer expressly says otherwise, in which case that offer’s terms apply.
        </li>
        <li>It is not a purchase of food and it is not a physical product.</li>
      </ul>

      <h2>Cancellation by you</h2>
      <p>
        You may choose not to attend, or ask us to cancel your reservation, at any time. The booking
        charge is not refunded in either case.
      </p>

      <h2>No-show</h2>
      <p>
        If you do not arrive for your reservation, the booking charge is not refunded and the amount is
        not carried over to a future booking.
      </p>

      <h2>Choosing not to dine</h2>
      <p>
        If you arrive and decide not to dine, the booking charge is not refunded. It can only be
        adjusted against a restaurant bill that is actually raised for that reservation.
      </p>

      <h2>Failed or incomplete payments</h2>
      <p>
        If a payment does not complete, no reservation is confirmed and there is nothing to refund. If
        your bank shows an amount debited for a payment our system did not record as successful, please
        contact us with your reservation reference and the payment details, and we will trace it with
        our payment provider.
      </p>

      <h2>Exceptional cases</h2>
      <p>
        Where a refund is required by applicable law, or is expressly approved by us in a particular
        case, it will be handled in accordance with that legal requirement or approval and processed
        through the original payment method via our payment provider’s process.
      </p>

      <h2>If we cannot honour your reservation</h2>
      <p>
        If circumstances on our side or the restaurant’s side mean your reservation cannot be honoured,
        please contact us and we will work with you to resolve it.
      </p>

      <h2>How to reach us</h2>
      <p>
        Please quote your reservation reference. See{' '}
        <a href="/contact">Contact Us &amp; Grievance</a>, or call{' '}
        <a href={`tel:+${SITE.phone}`}>{phoneDisplay()}</a>.
      </p>
    </LegalPage>
  )
}

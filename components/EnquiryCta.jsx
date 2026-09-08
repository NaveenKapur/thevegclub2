'use client'
import { useState } from 'react'
import Link from 'next/link'
import EnquiryDialog from './EnquiryDialog'

/*  The CTA row a restaurant page carries:
 *
 *      Book a table  |  Enquire Now  |  Ask on WhatsApp
 *
 *  "Book a table" is restaurant-aware and never generic. If this restaurant has
 *  live coupons it goes to THIS restaurant's own coupon list and nowhere else —
 *  showing 64/6's deals on the Tatva page would be a lie about what is bookable.
 *  If it has none, there is no coupon list to send anyone to, so it opens the
 *  enquiry form with the restaurant already chosen rather than dropping the
 *  guest on an empty page or on a generic breakfast booking.
 */
export function RestaurantCtas({ restaurant, hasDeals, dealsAnchor = '#coupons', restaurants, whatsapp }) {
  const [open, setOpen] = useState(false)
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hi, I would like to enquire about ${restaurant.name} at The Veg Club.`,
  )}`

  return (
    <>
      <div className="ctarow ctarow-3">
        {hasDeals ? (
          <a className="btn" href={dealsAnchor}>Book a table</a>
        ) : (
          <button type="button" className="btn" onClick={() => setOpen(true)}>Book a table</button>
        )}
        <button type="button" className="btn ghost" onClick={() => setOpen(true)}>Enquire Now</button>
        <a className="btn ghost" href={wa} target="_blank" rel="noopener">Ask on WhatsApp</a>
      </div>

      <EnquiryDialog
        open={open}
        onClose={() => setOpen(false)}
        restaurants={restaurants}
        presetRestaurant={restaurant.slug}
        presetRestaurantName={restaurant.name}
        context={{ dealSlug: null, occasionCard: null }}
      />
    </>
  )
}

/*  The occasion cards under "Deals for the occasion".
 *
 *  "Book this" keeps its direct booking route wherever a real deal backs the
 *  card — replacing a working booking path with a form would be a downgrade.
 *  "Enquire" sits beside it for the group bookings these cards are mostly
 *  about, and arrives with the occasion already chosen.
 */
export function OccasionCtas({ occasionLabel, bookHref, restaurants, presetRestaurant = '' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="occacts">
        {bookHref ? <Link href={bookHref} className="occgo">Book this →</Link> : null}
        <button type="button" className="occenq" onClick={() => setOpen(true)}>Enquire</button>
      </div>
      <EnquiryDialog
        open={open}
        onClose={() => setOpen(false)}
        restaurants={restaurants}
        presetRestaurant={presetRestaurant}
        presetOccasion={occasionLabel}
        context={{ occasionCard: occasionLabel }}
      />
    </>
  )
}

/*  A standalone Enquire Now button for pages with no single restaurant — the
 *  selector is shown rather than preset. */
export function EnquireButton({ restaurants, className = 'btn ghost', label = 'Enquire Now' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{label}</button>
      <EnquiryDialog open={open} onClose={() => setOpen(false)} restaurants={restaurants} />
    </>
  )
}

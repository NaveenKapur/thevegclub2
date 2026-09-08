import { SERVICE } from './pricing'
import { istToday, addDays, isWeekendDate } from './date-ist'

/*  Carrying a deal click through to the booking form.
 *
 *  Every "Book this deal" on the site used to link at a bare /book, which
 *  opens on Breakfast because that is the form's default. So a guest who
 *  clicked a weekend dinner deal was shown a weekday breakfast bill and had to
 *  rebuild their own intent by hand — and the price they had just been sold
 *  was not the price on the screen.
 *
 *  The fix is a query string, not a second booking page: one /book, which
 *  initialises itself from whatever context arrived with the click. Absent or
 *  unrecognised context falls through to the existing default, so a bare /book
 *  behaves exactly as it always did.
 *
 *  Deliberately NOT part of this: what gets sent to the CRM. offerSlug is
 *  still derived inside the form from meal + weekday/weekend + guests exactly
 *  as before. Pre-selecting a control is not the same as changing what a
 *  booking means, and the coupon/promotion side must not notice this change
 *  at all.
 */

const MEALS = Object.keys(SERVICE)          // breakfast | lunch | dinner
const DAYS = ['weekday', 'weekend']
const MAX_GUESTS = 20

/*  The soonest day that actually matches the deal the guest clicked, counting
 *  today. A weekend deal has to arrive on a weekend date or the bill cannot
 *  show the weekend rate it was just advertised at.
 *
 *  Everything here counts days in the Indian calendar (lib/date-ist.js), not
 *  the browser's, because the table being booked is in Ghaziabad whatever
 *  timezone the phone is set to. */
export function soonestDateFor(day) {
  if (day !== 'weekday' && day !== 'weekend') return ''
  let d = istToday()
  for (let i = 0; i < 8; i++) {
    if (isWeekendDate(d) === (day === 'weekend')) return d
    d = addDays(d, 1)
  }
  return ''
}

/*  A headline deal (lib/pricing.js) turned into the state it should open. */
export function dealIntent(deal) {
  if (!deal) return {}
  return {
    meal: MEALS.includes(deal.session) ? deal.session : undefined,
    // 'all' means the deal runs every day — it carries no day intent, so the
    // guest picks, and the form keeps its normal empty date.
    day: deal.days === 'weekend' || deal.days === 'weekday' ? deal.days : undefined,
    guests: deal.covers > 1 ? deal.covers : undefined,
    deal: deal.slug,
  }
}

/*  Intent → /book URL. Only keys that are actually set are written, so a link
 *  never carries a parameter that means "no opinion". */
export function bookHref(intent = {}) {
  const q = new URLSearchParams()
  if (intent.outlet === 'Tatva') q.set('r', 'tatva')
  if (MEALS.includes(intent.meal)) q.set('meal', intent.meal)
  if (DAYS.includes(intent.day)) q.set('day', intent.day)
  if (Number(intent.guests) > 1) q.set('guests', String(Math.min(MAX_GUESTS, Number(intent.guests))))
  if (intent.deal) q.set('deal', String(intent.deal))
  const s = q.toString()
  return s ? `/book?${s}` : '/book'
}

/*  /book URL → the state the form should open in. Everything is validated
 *  against the same lists the form itself uses, so a hand-typed or stale link
 *  degrades to the default rather than producing a form in an impossible
 *  state. Returns `date` already resolved, computed on the server and passed
 *  down as a prop — computing "next Saturday" inside the client component
 *  would make the server and client disagree on hydration. */
export function parseBookingIntent(params = {}) {
  const one = (v) => (Array.isArray(v) ? v[0] : v)
  const meal = MEALS.includes(one(params.meal)) ? one(params.meal) : undefined
  const day = DAYS.includes(one(params.day)) ? one(params.day) : undefined
  const n = Number(one(params.guests))
  const guests = Number.isFinite(n) && n >= 1 ? Math.min(MAX_GUESTS, Math.floor(n)) : undefined
  const deal = one(params.deal) ? String(one(params.deal)).slice(0, 64) : undefined
  return { meal, day, guests, deal, date: soonestDateFor(day) }
}

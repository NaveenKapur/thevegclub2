/*  Calendar dates for a restaurant in New Delhi.
 *
 *  Every booking on this site is for a table in Sahibabad, Ghaziabad. The date
 *  a guest picks is an Indian calendar date and it must reach the CRM as that
 *  exact date, unchanged.
 *
 *  `new Date().toISOString().slice(0,10)` does not do that. It converts to UTC
 *  first, and IST is UTC+5:30, so between 00:00 and 05:29 IST it returns
 *  YESTERDAY. A guest tapping "Today" at 1 a.m. was sending the CRM the
 *  previous day — a date that is also below the picker's own minimum, so the
 *  form could reject a date it had just filled in itself.
 *
 *  Reading the browser's local date parts is not enough either: the guest's
 *  phone may be set to any timezone, and the restaurant is still in India. So
 *  the zone is named explicitly. `en-CA` is the locale whose short date format
 *  is exactly YYYY-MM-DD, which is what the CRM contract wants.
 *
 *  A useful side effect: server and browser now produce the same string for the
 *  same instant, so a date rendered on the server cannot disagree with the one
 *  the client computes and tear on hydration.
 */

export const IST = 'Asia/Kolkata'

/** The Indian calendar date of an instant, as YYYY-MM-DD. */
export function istDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: IST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** Today in India. */
export const istToday = () => istDate(new Date())

/*  Day arithmetic done on the calendar date itself rather than by adding
 *  86,400,000 milliseconds to an instant — the latter drifts across a DST or
 *  UTC boundary, and "tomorrow" is a calendar idea, not a duration. */
export function addDays(dateStr, n) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d))
  t.setUTCDate(t.getUTCDate() + n)
  const p = (x) => String(x).padStart(2, '0')
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`
}

/** N days from today in India. */
export const istPlusDays = (n) => addDays(istToday(), n)

/** The weekday of an Indian calendar date string, 0 = Sunday … 6 = Saturday. */
export function weekdayOf(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** Saturday or Sunday, decided from the date string — never from a Date object
 *  parsed in the browser's own timezone. */
export function isWeekendDate(dateStr) {
  if (!dateStr) return false
  const wd = weekdayOf(dateStr)
  return wd === 0 || wd === 6
}

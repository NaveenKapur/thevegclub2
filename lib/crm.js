/*  CRM adapter — RadissonVeg CRM (cis on pct211, public https://crm.radissonveg.com)
 *
 *  EVERY call in this file runs SERVER-SIDE ONLY. A guest's browser never sees
 *  the CRM address. The public booking endpoints need no API key, so none is
 *  sent; CRM_API_KEY is still honoured if it is ever set.
 *
 *  04 Sep 2026 — rewired to the REAL, live CRM contract. This file previously
 *  posted snake_case fields to /api/enquiries and read back `reference` /
 *  `payment_url`. None of that existed on the CRM, so every booking failed.
 *  The live contract is documented in the CRM repo at
 *  docs/WEBSITE-BOOKING-CONTRACT.md and proven end to end.
 *
 *  The CRM is the single source of truth for the reservation AND for the money.
 *  This site never computes the amount it charges — it displays what the CRM
 *  returns.
 */
import 'server-only'
import { CRM } from './config'

const headers = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  ...(CRM.key ? { Authorization: `Bearer ${CRM.key}` } : {}),
})

async function call(path, { method = 'GET', body, revalidate } = {}) {
  if (!CRM.base) return { ok: false, offline: true, error: 'CRM_BASE_URL not set' }

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), CRM.timeout)
  try {
    const res = await fetch(CRM.base + path, {
      method,
      headers: headers(),
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      ...(revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' }),
    })
    const text = await res.text()
    let json = null
    try { json = text ? JSON.parse(text) : null } catch { /* non-JSON response */ }
    if (!res.ok) return { ok: false, status: res.status, error: json?.error || json?.message || text?.slice(0, 300) }
    return { ok: true, status: res.status, data: json }
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? 'CRM timeout' : e.message }
  } finally {
    clearTimeout(timer)
  }
}

/* ── Reads ──────────────────────────────────────────────────────────── */

/** Live deals. Falls back to the bundled file so the site never goes blank. */
export async function getDeals() {
  const r = await call(`${CRM.dealsPath}?status=live`, { revalidate: 300 })
  if (r.ok && Array.isArray(r.data?.data || r.data)) {
    return { source: 'crm', deals: (r.data.data || r.data).map(fromCrmDeal) }
  }
  const { DEALS } = await import('../data/deals.js')
  return { source: 'fallback', deals: DEALS, error: r.error }
}

/* ── Writes ─────────────────────────────────────────────────────────── */

/**
 * Create the reservation in the CRM.
 *
 * Returns the CRM's own numbers — never ours:
 *   reservationRef   the guest-quotable booking reference (RVR-YYYY-NNNNNN)
 *   amountPaise      what to charge, decided by the CRM
 *   payableCovers    how many guests that amount covers
 *   chargeDescription guest-facing wording for the amount
 *   payUrl           where to send the guest to pay (may legitimately be null)
 */
export async function createReservation(p) {
  const r = await call(CRM.bookingPath, { method: 'POST', body: toCrmBooking(p) })
  if (!r.ok) return { ok: false, error: r.error, offline: r.offline, status: r.status }
  const d = r.data || {}
  return {
    ok: true,
    reservationRef: d.reservationRef || null,
    amountPaise: typeof d.amountPaise === 'number' ? d.amountPaise : null,
    payableCovers: typeof d.payableCovers === 'number' ? d.payableCovers : null,
    chargeDescription: d.chargeDescription || null,
    payUrl: d.payUrl || null,
    duplicateSubmission: d.duplicateSubmission === true,
    unavailableReason: d.bookingUnavailableReason || null,
  }
}

/** Poll target. The CRM's state is the only thing that confirms a booking. */
export async function getReservationStatus(ref) {
  const r = await call(`${CRM.statusPath}/${encodeURIComponent(ref)}/status`)
  if (!r.ok) return { ok: false, error: r.error, status: r.status }
  return { ok: true, data: r.data || {} }
}

/** Try again after a failed/abandoned payment. Same reservation, new attempt. */
export async function retryReservationPayment(ref) {
  const r = await call(`${CRM.publicReservationPath}/${encodeURIComponent(ref)}/retry-payment`, { method: 'POST' })
  if (!r.ok) return { ok: false, error: r.error, status: r.status }
  const d = r.data || {}
  return { ok: true, reservationRef: d.reservationRef || ref, amountPaise: d.amountPaise ?? null, payUrl: d.payUrl || null }
}

/** The CRM's printable receipt URL — the site never renders its own receipt. */
export function receiptUrl(ref, { print = false } = {}) {
  return `${CRM.base}${CRM.publicReservationPath}/${encodeURIComponent(ref)}/receipt${print ? '?format=html' : ''}`
}

/* ── Mappers ── the ONLY place field names are translated ───────────── */

/**
 * The live contract's field names. Category and venue come from a fixed
 * vocabulary the CRM validates, so they are mapped explicitly rather than
 * passed through — an unknown value is a 400, not a silent mis-booking.
 */
const VENUE_BY_OUTLET = {
  '64/6': '64/6 – The Buffet Destination',
  'Tatva': 'Tatva – Fine Dining',
  // Skydeck has no counterpart in the CRM's venue vocabulary yet. 'Not sure
  // yet' is a real, accepted value: the enquiry is still recorded against the
  // guest, the CRM simply cannot hold a table until someone picks the venue,
  // and it says so in bookingUnavailableReason. Better than sending an unknown
  // string, which the CRM correctly rejects with a 400.
  'Skydeck': 'Not sure yet',
}

export function crmVenueFor(outletName) {
  return VENUE_BY_OUTLET[String(outletName || '').trim()] || null
}

function toCrmBooking(p) {
  const venue = crmVenueFor(p.outlet)
  return {
    category: 'Restaurant Reservation',
    venue: venue || 'Not sure yet',
    // adults are the PAYABLE guests; children are the complimentary under-5s.
    // The CRM decides what that costs — the site does not send an amount.
    adults: Number(p.adults) || 1,
    children: Number(p.children) || 0,
    countryCode: '+91',
    phone: String(p.mobile || '').replace(/\D/g, '').slice(-10),
    whatsappOptIn: true,
    name: p.name || undefined,
    email: p.email || undefined,
    reservationDate: p.date,
    session: p.session,
    slotTime: String(p.time || '').slice(0, 5),
    occasion: p.occasion || undefined,
    gateway: CRM.gateway || undefined,
    // Attribution the CRM already understands.
    utmSource: p.attribution?.utm_source,
    utmMedium: p.attribution?.utm_medium,
    utmCampaign: p.attribution?.utm_campaign,
    utmTerm: p.attribution?.utm_term,
    utmContent: p.attribution?.utm_content,
    gclid: p.attribution?.gclid,
    fbclid: p.attribution?.fbclid,
    referrer: p.attribution?.referrer,
    landingPage: p.attribution?.landingPage,
    device: p.attribution?.device,
  }
}

function fromCrmDeal(d) {
  return {
    slug: d.slug,
    name: d.name || d.title,
    outlet: d.outlet,
    session: (d.session || '').toLowerCase(),
    type: d.type,
    priceTotal: d.price_total ?? null,
    pricePerGuest: d.price_per_guest ?? null,
    percentOff: d.percent_off ?? null,
    rack: d.rack_reference ?? null,
    covers: d.covers ?? null,
    minGuests: d.min_guests ?? 1,
    maxGuests: d.max_guests ?? 20,
    validity: d.validity || 'all',
    validFrom: d.valid_from || null,
    validTo: d.valid_to || null,
    terms: d.terms || [],
  }
}

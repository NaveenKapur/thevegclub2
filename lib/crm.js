/*  CRM adapter — cis on pct211 (192.168.1.211)
 *
 *  EVERY call in this file runs SERVER-SIDE ONLY. The site is hosted on
 *  Coolify inside the same LAN (192.168.1.102), so it reaches the CRM by
 *  private IP. A guest's browser never sees the CRM address or the API key.
 *
 *  If the CRM's real routes differ from the defaults in .env, change the
 *  env values or the two mapper functions at the bottom. Nothing else.
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
    if (!res.ok) return { ok: false, status: res.status, error: json?.message || text?.slice(0, 300) }
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

/** Push a booking enquiry. Returns { ok, reference } or { ok:false, error }. */
export async function createEnquiry(payload) {
  const r = await call(CRM.enquiryPath, { method: 'POST', body: toCrmEnquiry(payload) })
  if (!r.ok) return { ok: false, error: r.error, offline: r.offline }
  const d = r.data || {}
  return {
    ok: true,
    reference: d.reference || d.enquiry_no || d.id || null,
    paymentUrl: d.payment_url || d.payment_link || null,
    raw: d,
  }
}

/* ── Mappers ── the ONLY place field names are translated ───────────── */

function toCrmEnquiry(p) {
  return {
    source: 'thevegclub.com',
    booking_type: 'Restaurant',
    outlet: p.outlet,
    offer: p.offer,
    offer_slug: p.offerSlug,
    occasion: p.occasion || null,
    requested_date: p.date,
    session: p.session,
    time_slot: p.time,
    adults: p.adults,
    children: p.children,
    total_pax: p.adults + p.children,
    guest_name: p.name,
    mobile: p.mobile,
    email: p.email || null,
    city: p.city || 'Ghaziabad',
    city_area: p.area || null,
    special_requests: p.requests || null,
    reservation_fee_paise: 5000,
    fee_refundable: false,
    fee_adjustable: false,
    payment_status: 'not_initiated',
    lead_source: 'Website',
    attribution: p.attribution || {},
    idempotency_key: p.idempotencyKey,
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
    status: d.status,
  }
}

/*  POST /api/enquire — the "Enquire Now" form.
 *
 *  READ THIS BEFORE CHANGING THE TARGET. The neighbouring route, /api/enquiry,
 *  is named almost identically and does something completely different: it
 *  CREATES A RESERVATION and returns a payment link. This one creates a lead
 *  and takes no money. They are one letter apart, so the CRM paths they call
 *  are spelled out here rather than shared through a helper that could quietly
 *  be pointed at the wrong one.
 *
 *      /api/enquire  ->  CRM /api/public/enquiries              (lead only)
 *      /api/enquiry  ->  CRM /api/public/website-reservation-form (books + charges)
 *
 *  Server-side, so the CRM address never reaches a guest's browser.
 */
import { NextResponse } from 'next/server'
import { CRM } from '../../../lib/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MOBILE = /^[6-9]\d{9}$/
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 })
  }

  const errors = []
  const name = String(body.name || '').trim()
  const mobile = String(body.mobile || '').replace(/\D/g, '').slice(-10)
  if (name.length < 2) errors.push('name')
  if (!MOBILE.test(mobile)) errors.push('mobile')
  if (body.email && !EMAIL.test(String(body.email).trim())) errors.push('email')
  if (!body.outletSlug) errors.push('restaurant')
  const guests = Number(body.guests)
  if (!Number.isFinite(guests) || guests < 1 || guests > 500) errors.push('guests')
  if (errors.length) {
    return NextResponse.json({ ok: false, error: 'validation', fields: errors }, { status: 422 })
  }

  try {
    const res = await fetch(`${CRM.base}/api/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        mobile,
        email: body.email ? String(body.email).trim() : null,
        outletSlug: body.outletSlug,
        occasion: body.occasion || null,
        guests,
        preferredDate: body.preferredDate || null,
        preferredTime: body.preferredTime || null,
        specialRequests: body.specialRequests || null,
        sourcePath: body.sourcePath || null,
        dealSlug: body.dealSlug || null,
        occasionCard: body.occasionCard || null,
        idempotencyKey: body.idempotencyKey || null,
      }),
      signal: AbortSignal.timeout(CRM.timeout),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok || !j.ok) {
      console.error('[enquire] CRM rejected enquiry:', res.status, j.error)
      return NextResponse.json(
        { ok: false, error: 'crm_unavailable', message: 'We could not send your enquiry just now. Please call us and we will help.' },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true, reference: j.reference ?? null, duplicate: !!j.duplicate })
  } catch (err) {
    console.error('[enquire] CRM unreachable:', err?.message || err)
    return NextResponse.json(
      { ok: false, error: 'crm_unavailable', message: 'We could not send your enquiry just now. Please call us and we will help.' },
      { status: 502 },
    )
  }
}

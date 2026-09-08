'use client'
import { useEffect, useRef, useState } from 'react'
import { istToday } from '../lib/date-ist'

/*  "Enquire Now".
 *
 *  A guest who is interested but not ready to pick a slot and pay. This form
 *  does NOT book anything — it posts to /api/enquire, which reaches the CRM's
 *  enquiry intake and creates a lead. No reservation, no payment, no coupon.
 *  The booking form is elsewhere and takes money; these two are kept visibly
 *  apart on purpose.
 *
 *  A dialog rather than a page, so a guest reading a restaurant page does not
 *  lose their place to ask a question. On a phone it comes up as a bottom
 *  sheet, which is where a thumb already is.
 */

const OCCASIONS = [
  'Birthday',
  'Kitty Party',
  'Anniversary',
  'Family Get-Together',
  'Corporate / Office Gathering',
  'Friends Get-Together',
  'Celebration',
  'Other',
]

export default function EnquiryDialog({
  open,
  onClose,
  restaurants = [],
  presetRestaurant = '',
  presetRestaurantName = '',
  presetOccasion = '',
  lockRestaurant = false,
  context = {},
}) {
  const [form, setForm] = useState({
    name: '', mobile: '', email: '',
    restaurant: presetRestaurant, occasion: presetOccasion,
    guests: '2', date: '', time: '', requests: '',
  })
  const [bad, setBad] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState('')
  const panelRef = useRef(null)
  const firstFieldRef = useRef(null)

  // Re-arm whenever it is opened from a different card, so the Birthday card
  // and the Kitty Party card do not share one stale occasion.
  useEffect(() => {
    if (!open) return
    setForm(f => ({ ...f, restaurant: presetRestaurant, occasion: presetOccasion }))
    setDone(false); setFailed(''); setBad({})
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [open, presetRestaurant, presetOccasion])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  if (!open) return null

  /*  A page must never open this form on a restaurant the dropdown cannot
   *  offer. The list comes from the CRM's outlets; the site can legitimately
   *  have a page for a venue the CRM has not been given yet, and when that
   *  happens the preselected slug would match no option, the select would sit
   *  blank, and a required field would be unsatisfiable on the one page that
   *  exists purely to take enquiries. So an unknown preset is added to the
   *  list rather than silently dropped -- the CRM attaches an outlet only when
   *  it recognises the slug, so the worst case is an enquiry with no venue
   *  attached instead of one attached to the wrong venue.  */
  const options = restaurants.some(r => r.slug === presetRestaurant) || !presetRestaurant
    ? restaurants
    : [...restaurants, { slug: presetRestaurant, name: presetRestaurantName || presetRestaurant }]

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setFailed('')
    const b = {}
    if (form.name.trim().length < 2) b.name = 1
    const mob = form.mobile.replace(/\D/g, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(mob)) b.mobile = 1
    if (form.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email.trim())) b.email = 1
    if (!form.restaurant) b.restaurant = 1
    const g = Number(form.guests)
    if (!Number.isFinite(g) || g < 1) b.guests = 1
    setBad(b)
    if (Object.keys(b).length) return

    setBusy(true)
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: mob,
          email: form.email.trim() || null,
          outletSlug: form.restaurant,
          occasion: form.occasion || null,
          guests: g,
          preferredDate: form.date || null,
          preferredTime: form.time || null,
          specialRequests: form.requests.trim() || null,
          sourcePath: typeof window !== 'undefined' ? window.location.pathname : null,
          dealSlug: context.dealSlug || null,
          occasionCard: context.occasionCard || null,
          idempotencyKey: `tvc-enq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!j.ok) { setBusy(false); setFailed(j.message || 'We could not send your enquiry just now. Please call us.'); return }
      setBusy(false); setDone(true)
    } catch {
      setBusy(false)
      setFailed('Network problem. Please try again, or call us.')
    }
  }

  return (
    <div className="enqwrap" role="dialog" aria-modal="true" aria-label="Enquire now"
         onMouseDown={(e) => { if (!panelRef.current?.contains(e.target)) onClose() }}>
      <div className="enqpanel" ref={panelRef}>
        <button type="button" className="enqx" onClick={onClose} aria-label="Close">×</button>

        {done ? (
          <div className="enqdone">
            <h2>Thank you</h2>
            <p>Your enquiry has been received. Our team will contact you shortly.</p>
            <button type="button" className="btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2>Enquire Now</h2>
            <p className="enqsub">Tell us what you have in mind and we will call you back. This is an enquiry, not a booking — nothing is charged.</p>

            <div className={'fgroup' + (bad.name ? ' bad' : '')}>
              <label className="lbl" htmlFor="eqname">Name *</label>
              <input id="eqname" ref={firstFieldRef} type="text" autoComplete="name" value={form.name} onChange={set('name')} />
              <p className="err">Please tell us your name.</p>
            </div>

            <div className={'fgroup' + (bad.mobile ? ' bad' : '')}>
              <label className="lbl" htmlFor="eqmob">Mobile *</label>
              <input id="eqmob" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" value={form.mobile} onChange={set('mobile')} />
              <p className="err">Enter a valid 10-digit Indian mobile number.</p>
            </div>

            <div className={'fgroup' + (bad.email ? ' bad' : '')}>
              <label className="lbl" htmlFor="eqmail">Email</label>
              <input id="eqmail" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
              <p className="err">Please check that email address.</p>
            </div>

            <div className={'fgroup' + (bad.restaurant ? ' bad' : '')}>
              <label className="lbl" htmlFor="eqrest">Restaurant *</label>
              <select id="eqrest" value={form.restaurant} onChange={set('restaurant')} disabled={lockRestaurant}>
                <option value="">Choose…</option>
                {options.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                <option value="not-sure">Not sure</option>
              </select>
              <p className="err">Please choose a restaurant, or “Not sure”.</p>
            </div>

            <div className="fgroup">
              <label className="lbl" htmlFor="eqocc">Event / Occasion</label>
              <select id="eqocc" value={form.occasion} onChange={set('occasion')}>
                <option value="">Not specified</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="enqrow">
              <div className={'fgroup' + (bad.guests ? ' bad' : '')}>
                <label className="lbl" htmlFor="eqpax">No. of Guests *</label>
                <input id="eqpax" type="number" inputMode="numeric" min="1" max="500" value={form.guests} onChange={set('guests')} />
                <p className="err">How many guests?</p>
              </div>
              <div className="fgroup">
                <label className="lbl" htmlFor="eqdate">Preferred Date</label>
                <input id="eqdate" type="date" min={istToday()} value={form.date} onChange={set('date')} />
              </div>
            </div>

            <div className="fgroup">
              <label className="lbl" htmlFor="eqtime">Preferred Time</label>
              <input id="eqtime" type="time" value={form.time} onChange={set('time')} />
            </div>

            <div className="fgroup">
              <label className="lbl" htmlFor="eqreq">Any Special Requests? (optional)</label>
              <textarea id="eqreq" rows={3} value={form.requests} onChange={set('requests')}
                        placeholder="No onion no garlic, cake arrangement, wheelchair access, high chair…" />
            </div>

            {failed ? <p className="err" style={{ display: 'block' }}>{failed}</p> : null}

            <button className="btn" type="submit" disabled={busy} style={{ width: '100%', marginTop: 6 }}>
              {busy ? 'Sending…' : 'Send enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

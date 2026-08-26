'use client'
import { useEffect, useMemo, useState } from 'react'

const SLOTS = {
  breakfast: ['07:00','07:30','08:00','08:30','09:00','09:30','10:00'],
  lunch:     ['12:30','13:00','13:30','14:00','14:30','15:00'],
  dinner:    ['19:00','19:30','20:00','20:30','21:00','21:30','22:00'],
}
const money = n => '₹' + Number(n).toLocaleString('en-IN')
const pretty = t => { const h = +t.slice(0,2), m = t.slice(3); const ap = h >= 12 ? 'pm' : 'am'; const hh = h % 12 || 12; return `${hh}:${m} ${ap}` }
const iso = d => d.toISOString().slice(0,10)

export default function BookingForm({ deals, restaurants, preselect, fee }) {
  const byOutlet = useMemo(() => Object.fromEntries(restaurants.map(r => [r.slug, r])), [restaurants])
  const live = useMemo(() => deals.filter(d => d.status === 'live' || d.status === 'provisional'), [deals])

  const initial = live.find(d => d.slug === preselect) || null
  const [outlet, setOutlet] = useState(initial?.outlet || '')
  const [dealSlug, setDealSlug] = useState(initial?.slug || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [form, setForm] = useState({ name:'', mobile:'', email:'', occasion:'', area:'', requests:'' })
  const [bad, setBad] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const [failed, setFailed] = useState('')

  const outletDeals = live.filter(d => !outlet || d.outlet === outlet)
  const deal = live.find(d => d.slug === dealSlug && (!outlet || d.outlet === outlet)) || null
  const minGuests = deal?.minGuests || 1
  const slots = deal ? SLOTS[deal.session] || [] : []

  useEffect(() => { if (adults < minGuests) setAdults(minGuests) }, [minGuests])   // eslint-disable-line
  useEffect(() => { setTime('') }, [dealSlug])

  const today = iso(new Date())
  const quick = [
    { label: 'Today', v: today },
    { label: 'Tomorrow', v: iso(new Date(Date.now() + 864e5)) },
    { label: 'Saturday', v: (() => { const n = new Date(); n.setDate(n.getDate() + ((6 - n.getDay() + 7) % 7 || 7)); return iso(n) })() },
  ]

  const pax = adults + children
  const value = !deal ? null
    : deal.pricePerGuest === null ? `${deal.percentOff}% off food`
    : money(deal.priceTotal && pax <= (deal.covers || 2) ? deal.priceTotal : deal.pricePerGuest * pax)

  const attribution = () => {
    if (typeof window === 'undefined') return {}
    const p = new URLSearchParams(location.search), a = {}
    ;['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid']
      .forEach(k => { const v = p.get(k); if (v) a[k] = v })
    a.referrer = document.referrer || ''
    a.landing_page = location.pathname + location.search
    a.device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    return a
  }

  async function submit(e) {
    e.preventDefault()
    setFailed('')
    const b = {}
    if (!outlet) b.outlet = 1
    if (!dealSlug) b.deal = 1
    if (!date) b.date = 1
    if (!time) b.time = 1
    if (form.name.trim().length < 2) b.name = 1
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\D/g, '').slice(-10))) b.mobile = 1
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email)) b.email = 1
    setBad(b)
    if (Object.keys(b).length) return

    setBusy(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outlet: byOutlet[outlet]?.name || outlet,
          offer: deal.name, offerSlug: deal.slug, session: deal.session,
          occasion: form.occasion, date, time: time + ':00',
          adults, children,
          name: form.name, mobile: form.mobile, email: form.email,
          area: form.area, requests: form.requests,
          attribution: attribution(),
          idempotencyKey: `tvc-${Date.now()}-${Math.random().toString(36).slice(2,10)}`,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) { setFailed(j.message || 'We could not save your booking. Please call us and we will hold your table.'); setBusy(false); return }
      setDone(j)
      if (j.paymentUrl) setTimeout(() => { window.location.href = j.paymentUrl }, 1500)
    } catch {
      setFailed('Network problem. Please try again, or call us and we will hold your table.')
      setBusy(false)
    }
  }

  if (done) return (
    <div className="done">
      <h2>Table requested</h2>
      <p>A payment link for the ₹{fee} reservation fee is on its way to your WhatsApp.</p>
      {done.reference ? <div className="code">{done.reference}</div> : null}
      <p>Once you pay, your coupon with a code arrives on the same thread. Show it at the restaurant.</p>
      {done.paymentUrl ? <p className="hint">Taking you to payment…</p> : null}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate>
      {deal ? (
        <div className="picked">
          <div className="t">Your deal</div>
          <div className="n">{byOutlet[deal.outlet]?.name} — {deal.name}</div>
          <div className="d">{deal.note} · {deal.session}</div>
        </div>
      ) : null}

      <div className={'fgroup' + (bad.outlet ? ' bad' : '')}>
        <span className="lbl">Restaurant <span className="req">*</span></span>
        <select value={outlet} onChange={e => { setOutlet(e.target.value); setDealSlug('') }}>
          <option value="">Choose a restaurant</option>
          {restaurants.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}
        </select>
        <p className="err">Please choose a restaurant.</p>
      </div>

      <div className={'fgroup' + (bad.deal ? ' bad' : '')}>
        <span className="lbl">Deal <span className="req">*</span></span>
        <select value={dealSlug} onChange={e => setDealSlug(e.target.value)}>
          <option value="">{outlet ? 'Choose a deal' : 'Choose a restaurant first'}</option>
          {outletDeals.map(d => (
            <option key={d.slug + d.outlet} value={d.slug}>
              {d.name} — {d.priceTotal ? money(d.priceTotal) + ' for two' : d.pricePerGuest ? money(d.pricePerGuest) + ' per guest' : d.percentOff + '% off food'}
            </option>
          ))}
        </select>
        <p className="err">Please choose a deal.</p>
      </div>

      <div className={'fgroup' + (bad.date ? ' bad' : '')}>
        <span className="lbl">When are you coming? <span className="req">*</span></span>
        <div className="chipsrow" style={{ marginBottom: 10 }}>
          {quick.map(q => (
            <button key={q.label} type="button" className="pill" aria-pressed={date === q.v}
              onClick={() => setDate(q.v)}>{q.label}</button>
          ))}
        </div>
        <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
        <p className="err">Please pick a date.</p>
      </div>

      <div className={'fgroup' + (bad.time ? ' bad' : '')}>
        <span className="lbl">Time <span className="req">*</span></span>
        <div className="chipsrow">
          {slots.map(t => (
            <button key={t} type="button" className="pill" aria-pressed={time === t} onClick={() => setTime(t)}>
              {pretty(t)}
            </button>
          ))}
        </div>
        <p className="hint">{deal ? `${deal.session} service` : 'Choose a deal first.'}</p>
        <p className="err">Please pick a time.</p>
      </div>

      <div className="fgroup">
        <div className="two">
          <div>
            <span className="lbl">Adults <span className="req">*</span></span>
            <div className="count">
              <button type="button" onClick={() => setAdults(a => Math.max(minGuests, a - 1))} aria-label="Fewer adults">−</button>
              <output>{adults}</output>
              <button type="button" onClick={() => setAdults(a => Math.min(20, a + 1))} aria-label="More adults">+</button>
            </div>
            <p className="hint">{deal ? `Minimum ${minGuests} guest${minGuests > 1 ? 's' : ''}.` : ''}</p>
          </div>
          <div>
            <span className="lbl">Children 5–12</span>
            <div className="count">
              <button type="button" onClick={() => setChildren(c => Math.max(0, c - 1))} aria-label="Fewer children">−</button>
              <output>{children}</output>
              <button type="button" onClick={() => setChildren(c => Math.min(20, c + 1))} aria-label="More children">+</button>
            </div>
            <p className="hint">Under 5 eat free.</p>
          </div>
        </div>
      </div>

      <div className={'fgroup' + (bad.name ? ' bad' : '')}>
        <span className="lbl">Your name <span className="req">*</span></span>
        <input type="text" autoComplete="name" placeholder="Name for the booking"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <p className="err">Please tell us your name.</p>
      </div>

      <div className={'fgroup' + (bad.mobile ? ' bad' : '')}>
        <span className="lbl">WhatsApp number <span className="req">*</span></span>
        <input type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number"
          value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
        <p className="hint">Your coupon and payment link come here.</p>
        <p className="err">Enter a valid 10-digit Indian mobile number.</p>
      </div>

      <details className="more">
        <summary>Add details (optional)</summary>
        <div className={'fgroup' + (bad.email ? ' bad' : '')}>
          <span className="lbl">Email</span>
          <input type="email" autoComplete="email" placeholder="For the invoice"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <p className="err">That email does not look right.</p>
        </div>
        <div className="fgroup">
          <span className="lbl">Occasion</span>
          <select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}>
            <option value="">Not a special occasion</option>
            <option>Birthday</option><option>Anniversary</option>
            <option>Family get-together</option><option>Kitty party</option><option>Business meal</option>
          </select>
        </div>
        <div className="fgroup">
          <span className="lbl">Area you live in</span>
          <input type="text" placeholder="Sahibabad, Indirapuram, Vaishali…"
            value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
        </div>
        <div className="fgroup">
          <span className="lbl">Anything we should know</span>
          <textarea placeholder="Window seat, no onion no garlic, birthday cake, wheelchair access…"
            value={form.requests} onChange={e => setForm({ ...form, requests: e.target.value })} />
        </div>
      </details>

      <div className="total">
        <dl>
          <dt>Guests</dt><dd>{pax}</dd>
          <dt>Deal value at the restaurant</dt><dd>{value || '—'}</dd>
        </dl>
        <dl className="fee"><dt>Pay now to reserve</dt><dd>₹{fee}</dd></dl>
        <p className="hint">Non-refundable. Not adjusted against your bill.</p>
      </div>

      {failed ? <p className="err" style={{ display: 'block', marginTop: 14 }}>{failed}</p> : null}

      <div style={{ marginTop: 20 }}>
        <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Sending…' : 'Continue to payment'}
        </button>
      </div>
    </form>
  )
}

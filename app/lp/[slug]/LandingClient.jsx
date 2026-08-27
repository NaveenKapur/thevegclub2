'use client'
import { useEffect, useRef, useState } from 'react'

const money = n => Number(n).toLocaleString('en-IN')

export default function LandingClient({ lp, gallery }) {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(false)
  const [bad, setBad] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const bookRef = useRef(null)
  const [form, setForm] = useState({ date: '', time: '', guests: '2', name: '', mobile: '' })

  const reduce = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* count the headline price up */
  useEffect(() => {
    if (reduce) { setCount(lp.price); return }
    let raf, start
    const dur = 1100
    const step = t => {
      if (!start) start = t
      const p = Math.min((t - start) / dur, 1)
      setCount(Math.round(lp.price * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [lp.price, reduce])

  /* scroll reveals */
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    document.querySelectorAll('.rv').forEach(n => io.observe(n))
    return () => io.disconnect()
  }, [])

  /* sticky bar */
  useEffect(() => {
    const on = () => {
      const past = window.scrollY > window.innerHeight * 0.72
      const atForm = bookRef.current
        ? bookRef.current.getBoundingClientRect().top < window.innerHeight * 0.85
        : false
      setShow(past && !atForm)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) })()

  async function submit(e) {
    e.preventDefault()
    const b = {}
    const day = form.date ? new Date(form.date + 'T12:00').getDay() : null
    const dayOk = !form.date ? false
      : lp.weekdayOnly ? day >= 1 && day <= 5
      : lp.weekendOnly ? day === 0 || day === 6
      : true
    if (!dayOk) b.date = 1
    if (!form.time) b.time = 1
    if (form.name.trim().length < 2) b.name = 1
    const mob = form.mobile.replace(/\D/g, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(mob)) b.mobile = 1
    setBad(b)
    if (Object.keys(b).length) { document.querySelector('.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }

    setBusy(true)
    const q = new URLSearchParams(window.location.search)
    const attribution = { referrer: document.referrer || '', device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop', landing_page: `lp/${lp.key}` }
    ;['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid']
      .forEach(k => { const v = q.get(k); if (v) attribution[k] = v })

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outlet: lp.outlet, offer: lp.offer, offerSlug: lp.dealSlug, session: lp.session,
          date: form.date, time: form.time, adults: Number(form.guests), children: 0,
          name: form.name.trim(), mobile: mob, attribution,
          idempotencyKey: `lp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!j.ok) { setBusy(false); alert(j.message || 'We could not save your booking. Please call +91 99881 19793.'); return }
      setDone(j)
      if (j.paymentUrl) setTimeout(() => { window.location.href = j.paymentUrl }, 1400)
    } catch {
      setBusy(false)
      alert('Network problem. Please call +91 99881 19793 and we will hold your table.')
    }
  }

  const pics = [...gallery, ...gallery]

  return (
    <>
      <div className="strip">
        <div className="track">
          {pics.map((p, i) => <img key={p + i} src={`/images/${p}.jpg`} alt="" loading="lazy" />)}
        </div>
      </div>

      <section>
        <div className="wrap">
          <p className="kicker rv">What ₹{money(lp.price)} covers</p>
          <h2 className="rv">Everything on the buffet, twice over.</h2>
          <p className="lede rv">No per-item pricing, no surprises at the end. The 1+1 applies to the full buffet for two guests, all taxes included.</p>
          <div className="menu">
            {[['s_live','Live counters','Cooked in front of you, through the evening'],
              ['s_salad','Salads & chaat','A full station before you reach the mains'],
              ['food','North Indian & Asian mains','Dal makhani, paneer, Thai curry, noodles'],
              ['li_dessert','Dessert table','Indian sweets and plated Continental']].map(([img, h, p]) => (
              <div className="mcard rv" key={img}>
                <img src={`/images/${img}.jpg`} alt={h} loading="lazy" />
                <div className="lab"><h3>{h}</h3><p>{p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink-2)' }}>
        <div className="wrap">
          <p className="kicker rv">The arithmetic</p>
          <h2 className="rv">Why this is worth the ₹50.</h2>
          <table className="compare rv">
            <tbody>
              <tr><th>Two guests</th><th>You pay</th></tr>
              <tr><td>Walking in off the street</td><td>₹{money(lp.was)}</td></tr>
              <tr><td>This deal, booked online</td><td className="hi">₹{money(lp.price)}</td></tr>
              <tr><td>Reservation fee</td><td>₹50</td></tr>
              <tr><td><b>You keep</b></td><td className="hi">₹{money(lp.was - lp.price - 50)}</td></tr>
            </tbody>
          </table>
          <p className="lede rv" style={{ marginTop: 22 }}>
            The ₹50 holds your table and locks this price. It is not refundable and is not adjusted
            against your bill — on a saving of ₹{money(lp.was - lp.price - 50)}, that is the point at
            which most people stop reading and just book.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="kicker rv">Three steps</p>
          <h2 className="rv">Booked in under a minute.</h2>
          <div className="steps">
            <div className="step rv"><span className="n">1</span><h3>Fill the form</h3><p>Date, time, how many of you. Name and WhatsApp number. Nothing else.</p></div>
            <div className="step rv"><span className="n">2</span><h3>Pay ₹50</h3><p>UPI or card. Your table is held the moment it clears.</p></div>
            <div className="step rv"><span className="n">3</span><h3>Show the coupon</h3><p>It arrives on WhatsApp. Show it at the table — the discount is applied to your bill.</p></div>
          </div>
        </div>
      </section>

      <section id="book" ref={bookRef} style={{ background: 'var(--ink-2)' }}>
        <div className="wrap">
          <p className="kicker rv" style={{ textAlign: 'center' }}>Reserve</p>
          <h2 className="rv" style={{ textAlign: 'center' }}>Hold your table</h2>
          <div className="formcard rv">
            {done ? (
              <div className="done">
                <h3>Table requested</h3>
                <p>Your ₹50 payment link is on its way to WhatsApp.</p>
                {done.reference ? <div className="ref">{done.reference}</div> : null}
                <p>Once it clears, your coupon arrives on the same thread.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="row2">
                  <div className={'fld' + (bad.date ? ' bad' : '')}>
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" min={minDate} value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })} />
                    <p className="err">{lp.weekendOnly ? 'Pick a Saturday or Sunday.' : 'Pick a weekday — this deal runs Monday to Friday.'}</p>
                  </div>
                  <div className={'fld' + (bad.time ? ' bad' : '')}>
                    <label htmlFor="time">Time</label>
                    <select id="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                      <option value="">Choose</option>
                      {lp.times.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <p className="err">Choose a time.</p>
                  </div>
                </div>
                <div className="row2">
                  <div className="fld">
                    <label htmlFor="guests">Guests</label>
                    <select id="guests" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                      {[2,3,4,5,6,8,10,12,15,20].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className={'fld' + (bad.name ? ' bad' : '')}>
                    <label htmlFor="name">Your name</label>
                    <input type="text" id="name" autoComplete="name" placeholder="Name for the booking"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <p className="err">Please tell us your name.</p>
                  </div>
                </div>
                <div className={'fld' + (bad.mobile ? ' bad' : '')}>
                  <label htmlFor="mobile">WhatsApp number</label>
                  <input type="tel" id="mobile" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number"
                    value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                  <p className="err">Enter a valid 10-digit Indian mobile number.</p>
                </div>
                <button className="cta" type="submit" disabled={busy} style={{ width: '100%' }}>
                  {busy ? 'Sending…' : 'Grab my coupon — ₹50'}
                </button>
                <p className="note">Non-refundable. Not adjusted against your bill. Minimum 2 guests.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className={'sticky' + (show ? ' show' : '')}>
        <a className="tel wa"
           href={`https://wa.me/919988119793?text=${encodeURIComponent('Hi, I want the 64/6 buffet coupon')}`}
           target="_blank" rel="noopener" aria-label="Book on WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm5.1 14c-.2.6-1.2 1.2-1.7 1.2-.5 0-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/></svg>
        </a>
        <div className="txt">
          <b>₹{money(lp.price)} for two</b>
          <span>Save ₹{money(lp.was - lp.price)} · {lp.weekendOnly ? 'Sat–Sun' : 'Mon–Fri'}</span>
        </div>
        <a className="cta" href="#book">Grab it</a>
      </div>

      <span id="lp-count" style={{ display: 'none' }}>{money(count)}</span>
    </>
  )
}

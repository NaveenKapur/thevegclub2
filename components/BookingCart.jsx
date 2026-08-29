'use client'
import { useEffect, useMemo, useState } from 'react'
import { quote, money, isWeekend, SERVICE, RACK, RESERVATION_FEE } from '../lib/pricing'

const MEALS = ['breakfast', 'lunch', 'dinner']

/*  Bookable slots per meal. Breakfast has no slots — guests arrive any
    time inside the service window. */
const SLOTS = {
  breakfast: [],
  lunch:  [['12:30','12:30 PM'], ['13:00','1:00 PM'], ['13:30','1:30 PM'], ['14:00','2:00 PM']],
  dinner: [['19:00','7:00 PM'], ['19:30','7:30 PM'], ['20:00','8:00 PM'], ['20:30','8:30 PM'], ['21:00','9:00 PM']],
}
const iso = d => d.toISOString().slice(0, 10)

export default function BookingCart({ outletName = '64/6' }) {
  const [guests, setGuests] = useState(2)
  const [kids, setKids] = useState(0)
  const [meal, setMeal] = useState(outletName === 'Tatva' ? 'dinner' : 'breakfast')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [form, setForm] = useState({ name: '', mobile: '', requests: '' })
  const [bad, setBad] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const [failed, setFailed] = useState('')

  const today = iso(new Date())
  const weekend = isWeekend(date)
  const bill = useMemo(() => quote({ meal, guests, date }), [meal, guests, date])

  const quick = [
    { label: 'Today', v: today },
    { label: 'Tomorrow', v: iso(new Date(Date.now() + 864e5)) },

  ]

  async function submit(e) {
    e.preventDefault()
    setFailed('')
    const b = {}
    if (!date) b.date = 1
    if (SLOTS[meal].length > 0 && !time) b.time = 1
    if (form.name.trim().length < 2) b.name = 1
    const mob = form.mobile.replace(/\D/g, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(mob)) b.mobile = 1
    setBad(b)
    if (Object.keys(b).length) { document.querySelector('.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }

    setBusy(true)
    const q = new URLSearchParams(window.location.search)
    const attribution = { referrer: document.referrer || '', device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop' }
    ;['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid']
      .forEach(k => { const v = q.get(k); if (v) attribution[k] = v })

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outlet: outletName,
          offer: `${SERVICE[meal].label} · ${guests} guest${guests > 1 ? 's' : ''}${weekend ? ' (weekend rate)' : ''}`,
          offerSlug: `${meal}-${weekend ? 'weekend' : 'weekday'}-${guests}`,
          session: meal,
          date, time: (time || SERVICE[meal].start) + ':00',
          service_window: SERVICE[meal].window,
          adults: guests, children: kids,
          quoted_total_inr: outletName === 'Tatva' ? 0 : bill.total,
          rack_total_inr: outletName === 'Tatva' ? 0 : bill.rack,
          saving_inr: bill.saving,
          name: form.name.trim(), mobile: mob,
          requests: form.requests.trim() || null,
          attribution,
          idempotencyKey: `tvc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!j.ok) { setBusy(false); setFailed(j.message || 'We could not save your booking. Please call us and we will hold your table.'); return }
      setDone(j)
      if (j.paymentUrl) setTimeout(() => { window.location.href = j.paymentUrl }, 1400)
    } catch {
      setBusy(false)
      setFailed('Network problem. Please try again, or call us and we will hold your table.')
    }
  }

  if (done) return (
    <div className="done">
      <h2>Table requested</h2>
      <p>A payment link for the {money(RESERVATION_FEE)} reservation fee is on its way to your WhatsApp.</p>
      {done.reference ? <div className="code">{done.reference}</div> : null}
      <p>Once you pay, your coupon arrives on the same thread. Show it at the restaurant.</p>
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="cart">

      {/* 1 ── guests */}
      <div className="cstep">
        <div className="cnum">1</div>
        <div className="cbody">
          <h3>How many people?</h3>
          <div className="two">
            <div>
              <label className="lbl" htmlFor="guests">Adults</label>
              <div className="count">
                <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))} aria-label="Fewer guests">−</button>
                <output id="guests">{guests}</output>
                <button type="button" onClick={() => setGuests(g => Math.min(20, g + 1))} aria-label="More guests">+</button>
              </div>
            </div>
            <div>
              <label className="lbl" htmlFor="kids">Children (under 5)</label>
              <div className="count">
                <button type="button" onClick={() => setKids(k => Math.max(0, k - 1))} aria-label="Fewer children">−</button>
                <output id="kids">{kids}</output>
                <button type="button" onClick={() => setKids(k => Math.min(10, k + 1))} aria-label="More children">+</button>
              </div>
              <p className="hint">Complimentary — not added to the bill.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2 ── meal */}
      <div className="cstep">
        <div className="cnum">2</div>
        <div className="cbody">
          <h3>Which meal?</h3>
          <div className="meals">
            {(outletName === 'Tatva' ? ['dinner'] : MEALS).map(m => (
              <button key={m} type="button" className="mealbtn" aria-pressed={meal === m} onClick={() => { setMeal(m); setTime(''); }}>
                <span className="mn">{SERVICE[m].label}</span>
                <span className="mw">{SERVICE[m].window}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3 ── date */}
      <div className={'cstep' + (bad.date ? ' bad' : '')}>
        <div className="cnum">3</div>
        <div className="cbody">
          <h3>Which day?</h3>
          <div className="chipsrow" style={{ marginBottom: 10 }}>
            {quick.map(q => (
              <button key={q.label} type="button" className="pill" aria-pressed={date === q.v} onClick={() => setDate(q.v)}>{q.label}</button>
            ))}
          </div>
          <label className="lbl" htmlFor="date" style={{ marginTop: 4 }}>Or choose a date</label>
          <input type="date" id="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
          {date ? (
            <p className={'daynote' + (weekend ? ' wknd' : '')}>
              {weekend
                ? 'Saturday & Sunday rates applied — weekend prices are different.'
                : 'Monday to Friday rates applied.'}
            </p>
          ) : <p className="hint">Weekend rates differ. Pick a date and the bill updates itself.</p>}
          <p className="err">Please pick a date.</p>
        </div>
      </div>

      {/* 4 ── time slot */}
      {SLOTS[meal].length > 0 && (
        <div className={'cstep' + (bad.time ? ' bad' : '')}>
          <div className="cnum">4</div>
          <div className="cbody">
            <h3>Pick a time slot</h3>
            <div className="chipsrow">
              {SLOTS[meal].map(([v, label]) => (
                <button key={v} type="button" className="pill"
                  aria-pressed={time === v} onClick={() => setTime(v)}>{label}</button>
              ))}
            </div>
            <p className="err">Please pick a time slot.</p>
          </div>
        </div>
      )}

      {/* ── THE BILL ── */}
      {outletName !== 'Tatva' && (
        <>
          <h3 className="billtitle">Sample Bill</h3>
          <div className="bill">
            <div className="billhead">
              <span>{outletName} · {SERVICE[meal].label}</span>
              <span>{weekend ? 'Weekend' : 'Weekday'} rate</span>
            </div>

        <div className="billrows">
          <div className="brow muted">
            <span>Counter price · {guests} × {money(RACK[meal])}</span>
            <s>{money(bill.rack)}</s>
          </div>

          {bill.lines.map((l, i) => (
            <div className="brow" key={i}>
              <span>{l.label}{l.qty > 1 ? ` × ${l.qty}` : ''}<small> @ {money(l.each)}</small></span>
              <b>{money(l.amount)}</b>
            </div>
          ))}

          {kids > 0 ? (
            <div className="brow free">
              <span>Children up to 5 years × {kids}</span>
              <b>Free</b>
            </div>
          ) : null}
        </div>

        <div className="brow save">
          <span>You save</span>
          <b>{money(bill.saving)} <em>({bill.savingPct}% Discount)</em></b>
        </div>

        <div className="brow subtotal">
          <span>Your bill at the restaurant</span>
          <b>{money(bill.total)}</b>
        </div>

        <div className="brow due">
          <span>Cover charge now · {guests} × {money(bill.feePerGuest)}</span>
          <b>{money(bill.fee)}</b>
        </div>
      </div>
      <p className="hint billnote">
        {money(bill.feePerGuest)} per person cover charge, which is <b>redeemable</b> — it comes off
        your restaurant bill, leaving {money(bill.balance)} to pay at the table. It holds your table
        and locks this price.
      </p>
      </>
      )}
      
      {outletName === 'Tatva' && (
        <>
          <h3 className="billtitle">Reservation</h3>
          <div className="bill">
            <div className="billhead">
              <span>{outletName} · {SERVICE[meal].label}</span>
            </div>
            <div className="billrows">
              <div className="brow due" style={{ margin: '-18px', padding: '14px 18px', borderRadius: 'var(--r)' }}>
                <span>Cover charge now · {guests} × {money(bill.feePerGuest)}</span>
                <b>{money(bill.fee)}</b>
              </div>
            </div>
          </div>
          <p className="hint billnote">
            {money(bill.feePerGuest)} per person cover charge, which is <b>redeemable</b> — it comes off
            your restaurant bill. It holds your table.
          </p>
        </>
      )}

      {/* 5 ── who */}
      <div className="cstep">
        <div className="cnum">5</div>
        <div className="cbody">
          <h3>Who is it for?</h3>
          <div className={'fgroup' + (bad.name ? ' bad' : '')}>
            <label className="lbl" htmlFor="gname">Your name</label>
            <input type="text" id="gname" autoComplete="name" placeholder="Name for the booking"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <p className="err">Please tell us your name.</p>
          </div>
          <div className={'fgroup' + (bad.mobile ? ' bad' : '')}>
            <label className="lbl" htmlFor="gmobile">WhatsApp number</label>
            <input type="tel" id="gmobile" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number"
              value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
            <p className="hint">Your coupon and payment link come here.</p>
            <p className="err">Enter a valid 10-digit Indian mobile number.</p>
          </div>
          <details className="more">
            <summary>Anything we should know? (optional)</summary>
            <div className="fgroup">
              <textarea placeholder="No onion no garlic, birthday cake, wheelchair access, high chair…"
                value={form.requests} onChange={e => setForm({ ...form, requests: e.target.value })} />
            </div>
          </details>
        </div>
      </div>

      {failed ? <p className="err" style={{ display: 'block', marginTop: 14 }}>{failed}</p> : null}

      <button className="btn" type="submit" disabled={busy} style={{ width: '100%', marginTop: 18, padding: '15px 18px', fontSize: 15 }}>
        {busy ? 'Sending…' : `Confirm and pay ${money(bill.fee)}`}
      </button>
    </form>
  )
}

'use client'

/*  /book/status/[ref]
 *
 *  Where a guest lands after paying, and where they can come back to at any
 *  time with just their booking reference.
 *
 *  The single rule this page exists to enforce: a payment return URL in the
 *  address bar proves nothing. Whatever the query string says, this page asks
 *  our own server, which asks the CRM, and only the CRM's state decides what
 *  the guest is shown. A guest typing ?success=true sees exactly what an
 *  unpaid booking sees.
 *
 *  Polls every 3s for ~120s, then stops and offers a manual check rather than
 *  hammering the CRM forever.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SITE } from '../../../../lib/config'

const POLL_MS = 3000
const MAX_MS = 120000

const money = (paise) => '₹' + Number(paise / 100).toLocaleString('en-IN')

function prettyDate(d) {
  if (!d) return ''
  const dt = new Date(d + 'T12:00')
  return isNaN(dt) ? d : dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function StatusClient({ reference }) {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [polling, setPolling] = useState(true)
  const [busy, setBusy] = useState(false)
  const [retryNote, setRetryNote] = useState('')
  const startedAt = useRef(Date.now())

  const check = useCallback(async () => {
    try {
      const res = await fetch(`/api/reservation/${encodeURIComponent(reference)}/status`, { cache: 'no-store' })
      const j = await res.json().catch(() => ({}))
      if (!j.ok) { setError(j.message || 'We could not check your booking just now.'); return null }
      setError('')
      setStatus(j)
      return j
    } catch {
      setError('Network problem while checking your booking.')
      return null
    }
  }, [reference])

  useEffect(() => {
    let stop = false
    let timer

    const tick = async () => {
      const j = await check()
      if (stop) return
      // Settled states need no further polling.
      const settled = j && ['CONFIRMED', 'EXPIRED', 'CANCELLED', 'ARRIVED', 'COMPLETED', 'NO_SHOW'].includes(j.state)
      if (settled) { setPolling(false); return }
      if (Date.now() - startedAt.current > MAX_MS) { setPolling(false); return }
      timer = setTimeout(tick, POLL_MS)
    }
    tick()
    return () => { stop = true; clearTimeout(timer) }
  }, [check])

  async function tryAgain() {
    setBusy(true); setRetryNote('')
    try {
      const res = await fetch(`/api/reservation/${encodeURIComponent(reference)}/retry`, { method: 'POST' })
      const j = await res.json().catch(() => ({}))
      if (!j.ok) { setBusy(false); setRetryNote(j.message || 'We could not start a new payment just now.'); return }
      if (j.payUrl) { window.location.href = j.payUrl; return }
      setBusy(false)
      setRetryNote('Your booking is still held. Please call us and we will take the payment.')
    } catch {
      setBusy(false)
      setRetryNote('Network problem. Please try again, or call us.')
    }
  }

  const state = status?.state
  const confirmed = state === 'CONFIRMED'
  const awaiting = state === 'AWAITING_CONFIRMATION'
  const failedish = state === 'EXPIRED' || state === 'CANCELLED'
  const pending = state === 'PENDING'

  return (
    <div className="done">
      <p className="code">{reference}</p>

      {/* ── confirmed ─────────────────────────────────────────────── */}
      {confirmed && (
        <>
          <h2>Table reservation confirmed</h2>
          <p>
            Thank you — your table at {status.outletName} is booked for{' '}
            {prettyDate(status.reservationDate)}{status.time ? `, ${status.time}` : ''}.
          </p>
          <p>Please quote your reservation reference on arrival.</p>
          <p>
            <a
              href={`https://crm.radissonveg.com/api/public/reservations/${encodeURIComponent(reference)}/receipt?format=html`}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              View / print receipt
            </a>
          </p>
          <p className="small">Your cover charge is redeemable against your restaurant bill.</p>
        </>
      )}

      {/* ── paid, table being confirmed by a person ───────────────── */}
      {awaiting && (
        <>
          <h2>We have your payment</h2>
          <p>Our team is confirming your table and will come back to you shortly.</p>
          <p className="small">Nothing more is needed from you. For anything urgent, call {SITE.phone.replace(/^(\d\d)(\d{5})(\d+)$/, '+$1 $2 $3')}.</p>
        </>
      )}

      {/* ── still unpaid ─────────────────────────────────────────── */}
      {pending && (
        <>
          <h2>{polling ? 'Confirming your payment…' : 'Payment not completed yet'}</h2>
          {polling ? (
            <p>This can take a few moments. Please keep this page open.</p>
          ) : (
            <>
              <p>We have not received your payment yet. Your table is still held.</p>
              <p>
                <button className="btn" onClick={tryAgain} disabled={busy}>
                  {busy ? 'Starting payment…' : `Pay ${status?.amountPaise ? money(status.amountPaise) : 'now'}`}
                </button>{' '}
                <button className="btn ghost" onClick={check} disabled={busy}>Check again</button>
              </p>
            </>
          )}
        </>
      )}

      {/* ── failed / expired ─────────────────────────────────────── */}
      {failedish && (
        <>
          <h2>Transaction failed</h2>
          <p>Your payment did not go through, so the table was not confirmed. You can try again — it is the same booking, not a new one.</p>
          <p>
            <button className="btn" onClick={tryAgain} disabled={busy}>
              {busy ? 'Starting payment…' : 'Try again'}
            </button>{' '}
            <Link href="/book" className="btn ghost">Back to booking</Link>
          </p>
        </>
      )}

      {retryNote ? <p className="small">{retryNote}</p> : null}
      {error ? <p className="small">{error}</p> : null}

      {!status && !error ? <p>Checking your booking…</p> : null}

      <p className="small">
        <Link href="/">Back to The Veg Club</Link>
      </p>
    </div>
  )
}

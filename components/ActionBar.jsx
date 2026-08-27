'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '../lib/config'

export default function ActionBar() {
  const path = usePathname()
  if (path?.startsWith('/lp/')) return null   // the landing page has its own sticky bar
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hello, I would like to book a table through thevegclub.com')}`
  return (
    <div className="actionbar">
      <a className="abtn call" href={`tel:+${SITE.phone}`} aria-label="Call us">
        <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"/></svg>
      </a>
      <Link className="abook" href="/book" style={{ textDecoration: 'none' }}>
        Book now <span className="sm">· ₹{SITE.fee}</span>
      </Link>
      <a className="abtn wa" href={wa} target="_blank" rel="noopener" aria-label="WhatsApp us">
        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm5.1 14c-.2.6-1.2 1.2-1.7 1.2-.5 0-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/></svg>
      </a>
    </div>
  )
}

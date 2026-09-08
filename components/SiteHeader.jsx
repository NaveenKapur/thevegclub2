'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/*  The brand lockup: the existing mark from public/brand/logo.svg — the same
 *  leaf-and-fork the favicon was cut from — beside the wordmark. The asset was
 *  already in the repo and had never been used anywhere; nothing was redrawn.
 *
 *  Three lines of text, deliberately in descending weight: the name, the
 *  region, then the caption. The caption is hidden below 380px rather than
 *  allowed to wrap, because a two-line caption doubles the header height on
 *  exactly the phones with the least room for it.
 */
export default function SiteHeader() {
  const path = usePathname()
  if (path?.startsWith('/lp/')) return null   // ad landing pages carry no nav

  return (
    <header className="hdr">
      <div className="wrap">
        <Link href="/" className="logo lockup" style={{ textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lockup-mark" src="/brand/logo.svg" alt="" width={36} height={36} aria-hidden="true" />
          <span className="lockup-text">
            <span className="lockup-name">The Veg Club</span>
            <small className="lockup-region">DELHI NCR</small>
            <small className="lockup-caption">Great Deals in Delhi NCR</small>
          </span>
        </Link>
        <nav>
          <Link href="/deals">Deals</Link>
          <Link href="/restaurants">Restaurants</Link>
          <Link href="/book">Book</Link>
        </nav>
      </div>
    </header>
  )
}

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SiteHeader() {
  const path = usePathname()
  if (path?.startsWith('/lp/')) return null   // ad landing pages carry no nav

  return (
    <header className="hdr">
      <div className="wrap">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          The Veg Club<small>DELHI NCR</small>
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

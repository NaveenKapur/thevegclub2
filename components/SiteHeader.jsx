import Link from 'next/link'

export default function SiteHeader() {
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

'use client'
import { usePathname } from 'next/navigation'

/* The announcement strip and footer belong to the website, not to an ad
   landing page. On /lp/* the page stands alone. */
export function TopStrip() {
  const path = usePathname()
  if (path?.startsWith('/lp/')) return null
  return (
    <div className="bar">
      Deals available <b>only</b> on thevegclub.com — not on Zomato, Dineout or EazyDiner
    </div>
  )
}

export function SiteFooter() {
  const path = usePathname()
  if (path?.startsWith('/lp/')) return null
  return (
    <footer>
      <div className="wrap">
        <b>The Veg Club</b> — vegetarian restaurant deals in Delhi NCR<br />
        64/6 · 3B’s · Tatva · Skydeck · Sahibabad, Ghaziabad
      </div>
    </footer>
  )
}

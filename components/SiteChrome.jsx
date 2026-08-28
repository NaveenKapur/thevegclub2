'use client'
import { usePathname } from 'next/navigation'

/* The announcement strip and footer belong to the website, not to an ad
   landing page. On /lp/* the page stands alone. */
/*  The announcement strip was removed on Sir's instruction (28 Aug 2026).
 *  Kept as a no-op export so nothing that still imports it breaks.
 */
export function TopStrip() { return null }

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

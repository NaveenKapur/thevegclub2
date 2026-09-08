import { CRM } from './config'
import { RESTAURANTS } from '../data/restaurants'

/*  The restaurant list the enquiry form offers.
 *
 *  It comes from the CRM's own outlet table (GET /api/public/outlets), so the
 *  dropdown is not a second hardcoded list that drifts away from the venues the
 *  CRM will actually accept an enquiry against — a slug this site invents would
 *  be silently dropped at the other end.
 *
 *  The website's own data/restaurants.js is the fallback, not the source. It is
 *  what the restaurant pages are built from, so it always has something
 *  sensible in it, but if the two disagree the CRM wins.
 *
 *  Known difference today: the website lists **Skydeck** as an enquiry-only
 *  venue and the CRM has no outlet row for it, so an enquiry naming Skydeck
 *  arrives with no outlet attached rather than attached to the wrong one. That
 *  is the honest behaviour until someone creates the outlet in the CRM.
 */
const FALLBACK = RESTAURANTS.map(r => ({ name: r.name, slug: r.slug, type: 'restaurant' }))

export async function getOutlets() {
  try {
    const res = await fetch(`${CRM.base}/api/public/outlets`, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(CRM.timeout),
    })
    if (!res.ok) return FALLBACK
    const j = await res.json()
    const rows = Array.isArray(j.outlets) ? j.outlets.filter(o => o?.slug && o?.name) : []
    return rows.length ? rows : FALLBACK
  } catch {
    return FALLBACK
  }
}

import { CRM } from './config'

/*  Who this business legally is.
 *
 *  The CRM owns it. GSTIN and CIN are entered once on its Settings screen and
 *  served by GET /api/public/legal, so nothing here holds a registration
 *  number and nobody has to redeploy this site to correct one.
 *
 *  Two rules govern the fallback below, and they pull in opposite directions:
 *
 *  1. A legal page must never fail to render because a JSON fetch failed. The
 *     policy text IS the page; the identity block is a heading on top of it.
 *  2. A registration number must never be guessed, approximated, or printed
 *     as "N/A". A wrong GSTIN on a public compliance page is worse than no
 *     GSTIN at all.
 *
 *  So the fallback carries only what is a fixed fact about the brand — its
 *  name, the entity it trades under, its address — and leaves gstin and cin
 *  EMPTY. Every consumer renders an empty identifier as nothing at all. If
 *  the CRM is unreachable the pages still read correctly; they are simply
 *  quieter, which is the honest failure.
 */

const FALLBACK = {
  tradingName: 'The Veg Club',
  entityName: 'Magnum Ventures Ltd.',
  relationship: 'A unit of Magnum Ventures Ltd.',
  address: [
    '64/6, Site 4, Sahibabad Industrial Area Site 4',
    'Sahibabad, Ghaziabad',
    'Uttar Pradesh 201010, India',
  ].join('\n'),
  cin: '',
  gstin: '',
}

const asText = (v) => (typeof v === 'string' ? v.trim() : '')

/*  Server-side only. Revalidated rather than fetched per render: these values
 *  change roughly never, and a legal footer on every page must not put a
 *  network hop in front of every page. */
export async function getLegal() {
  try {
    const res = await fetch(`${CRM.base}/api/public/legal`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(CRM.timeout),
    })
    if (!res.ok) return FALLBACK
    const j = await res.json()
    return {
      tradingName: asText(j.tradingName) || FALLBACK.tradingName,
      entityName: asText(j.entityName) || FALLBACK.entityName,
      relationship: asText(j.relationship) || FALLBACK.relationship,
      address: asText(j.address) || FALLBACK.address,
      // No fallback on purpose. Unset means unset means show nothing.
      cin: asText(j.cin),
      gstin: asText(j.gstin),
    }
  } catch {
    return FALLBACK
  }
}

/*  The address is stored the way it is meant to be read, over three lines. */
export const addressLines = (legal) =>
  String(legal?.address || '').split('\n').map(s => s.trim()).filter(Boolean)

/*  "GSTIN: … · CIN: …", with whichever of the two actually exists — and an
 *  empty string when neither does, so a caller can render nothing without
 *  writing the same three conditionals in seven files. */
export const registrationLine = (legal) =>
  [legal?.gstin ? `GSTIN: ${legal.gstin}` : '', legal?.cin ? `CIN: ${legal.cin}` : '']
    .filter(Boolean)
    .join(' · ')

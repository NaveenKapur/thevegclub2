/*  Google ratings for the supplier restaurants.
 *
 *  These are REAL, as read from Google in August 2026. They are displayed
 *  exactly as Google shows them and are never rounded up, padded or nudged:
 *  a published rating is a statement of fact about someone else's business.
 *  Inflating one is a misleading claim under the Consumer Protection Act 2019
 *  and it breaks Google's own review policy — which would cost the site its
 *  rich results, the very thing we are building the SEO for.
 *
 *  Update by re-reading the Google listing and changing `asOf`. Nothing else
 *  on the site invents a rating: every star shown comes from this file.
 */
export const RATINGS = {
  '64-6': {
    score: 4.6,
    count: 40404,
    /*  The Google listing is the hotel's, not the restaurant's — so we say so
        rather than passing 40,404 hotel reviews off as reviews of 64/6. */
    subject: 'Country Inn & Suites by Radisson, Sahibabad',
    url: 'https://www.google.com/travel/search?q=64/6+country+inn+sahibabad',
    asOf: 'August 2026',
  },
  tatva: {
    score: 4.4,
    count: 210,
    subject: 'Tatva — Country Inn & Suites by Radisson',
    url: 'https://www.google.com/search?q=tatva+restaurant+in+sahibabad',
    asOf: 'August 2026',
  },
  '3bs': {
    score: 4.2,
    count: 113,
    subject: "3B's — Country Inn & Suites by Radisson",
    url: 'https://www.google.com/search?q=3bs+restaurant+in+sahibabad',
    asOf: 'August 2026',
  },
}

/*  Weighted across every listing we publish — the honest headline number. */
export function overallRating() {
  const all = Object.values(RATINGS)
  const count = all.reduce((n, r) => n + r.count, 0)
  const score = all.reduce((n, r) => n + r.score * r.count, 0) / count
  return { score: Math.round(score * 10) / 10, count }
}

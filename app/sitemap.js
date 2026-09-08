import { RESTAURANTS } from '../data/restaurants'
import { HUBS } from '../data/deals'
import { SITE } from '../lib/config'

export default function sitemap() {
  const now = new Date()
  const p = (path, priority, changeFrequency = 'weekly') =>
    ({ url: SITE.url + path, lastModified: now, changeFrequency, priority })

  return [
    p('/', 1.0, 'daily'),
    p('/deals', 0.9, 'daily'),
    p('/restaurants', 0.8),
    p('/book', 0.7),
    ...Object.keys(HUBS).map(s => p(`/deals/${s}`, 0.8, 'daily')),
    ...RESTAURANTS.map(r => p(`/restaurants/${r.slug}`, 0.8)),
    // Legal & compliance. Low priority, rarely changed, but they must be
    // discoverable -- a payment provider's reviewer should not have to be
    // told a URL to find the refund policy.
    ...['/about', '/contact', '/terms', '/privacy', '/refunds', '/booking-policy', '/shipping']
      .map(path => p(path, 0.3, 'yearly')),
  ]
}

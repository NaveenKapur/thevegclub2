import { SITE } from './config'

const addr = (r) => ({
  '@type': 'PostalAddress',
  streetAddress: r?.supplier || 'Country Inn & Suites by Radisson',
  addressLocality: r?.area || SITE.locality,
  addressRegion: SITE.region,
  addressCountry: SITE.country,
})

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  telephone: '+' + SITE.phone,
  description: SITE.tagline,
})

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
})

/*  One place maps a meal to real clock hours — the site, the schema and the
    booking form must never disagree about when a restaurant serves. */
const HOURS = {
  breakfast: ['07:00', '10:30'],
  lunch: ['12:30', '15:30'],
  dinner: ['19:00', '23:00'],
}
const hoursFor = (session) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  opens: HOURS[session]?.[0],
  closes: HOURS[session]?.[1],
})

export const restaurant = (r) => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: r.name,
  url: `${SITE.url}/restaurants/${r.slug}`,
  servesCuisine: ['Vegetarian', ...r.cuisines],
  priceRange: '₹₹₹',
  telephone: '+' + SITE.phone,
  address: addr(r),
  acceptsReservations: 'True',
  /*  Service hours come from the restaurant's own sessions, so a dinner-only
      outlet is never advertised to Google or an AI assistant as open for lunch. */
  ...(r.sessions?.length ? { openingHoursSpecification: r.sessions.map(hoursFor) } : {}),
  // Only claim vegan once a kitchen has confirmed a dairy-free list.
  ...(r.veganOptions === 'verified'
    ? { suitableForDiet: ['https://schema.org/VegetarianDiet', 'https://schema.org/VeganDiet'] }
    : { suitableForDiet: 'https://schema.org/VegetarianDiet' }),
})

export const offer = (d, r) => ({
  '@type': 'Offer',
  name: `${d.name}${r ? ' at ' + r.name : ''}`,
  url: `${SITE.url}/deals/${d.slug}`,
  priceCurrency: 'INR',
  ...(d.priceTotal ? { price: String(d.priceTotal) } : d.pricePerGuest ? { price: String(d.pricePerGuest) } : {}),
  ...(d.priceTotal ? { eligibleQuantity: { '@type': 'QuantitativeValue', value: d.covers || 2 } } : {}),
  availability: 'https://schema.org/InStock',
  ...(d.validFrom ? { validFrom: d.validFrom } : {}),
  ...(d.validTo ? { validThrough: d.validTo } : {}),
  ...(r ? { offeredBy: { '@type': 'Restaurant', name: r.name, address: addr(r) } } : {}),
})

export const offerList = (deals, restaurantsBySlug) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: deals.map((d, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: offer(d, restaurantsBySlug[d.outlet]),
  })),
})

export const breadcrumbs = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem', position: i + 1, name: t.name, item: SITE.url + t.href,
  })),
})

export const faq = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(q => ({
    '@type': 'Question', name: q.q,
    acceptedAnswer: { '@type': 'Answer', text: q.a },
  })),
})

/** Renders a JSON-LD block. Use inside any server component. */
export function JsonLd({ data }) {
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

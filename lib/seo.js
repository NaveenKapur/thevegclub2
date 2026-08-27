import { SITE } from './config'

/*  One helper builds every page's metadata, so no page can ship without a
 *  title, a description, a canonical URL and its own social card. Paste a
 *  link into WhatsApp and you get the right picture and the right words.
 *
 *  Cards live in public/og/ and are produced by scripts/generate-og.mjs.
 */
export function pageMeta({ title, description, path = '/', og, noindex = false, imageAlt }) {
  const url = SITE.url.replace(/\/$/, '') + path
  const image = `/og/${og || 'home'}.jpg`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  }
}

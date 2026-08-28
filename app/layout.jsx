import './globals.css'
import { SITE } from '../lib/config'
import ActionBar from '../components/ActionBar'
import SiteHeader from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteChrome'

/*  Site-wide defaults. Every page overrides title, description and og:image
 *  with its own — see lib/seo.js. These are the fallbacks, so a page that
 *  forgets still shows a proper card rather than a bare link.
 */
export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Veg Buffet Deals in Ghaziabad — From ₹1,399 | The Veg Club',
    template: '%s | The Veg Club',
  },
  description:
    'Vegetarian buffet coupons at 64/6, Sahibabad. Weekday lunch 1+1 ₹2,799 for two against a ₹5,598 counter price. Book for ₹50, coupon on WhatsApp.',
  applicationName: SITE.name,
  formatDetection: { telephone: true },
  openGraph: {
    siteName: SITE.name,
    locale: 'en_IN',
    type: 'website',
    url: SITE.url,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'The Veg Club — veg buffet deals in Ghaziabad' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/home.jpg'],
  },
  icons: {
    icon: [{ url: '/icon.png', sizes: '512x512', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#16362A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ActionBar />
      </body>
    </html>
  )
}

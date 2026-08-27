import './globals.css'
import { SITE } from '../lib/config'
import ActionBar from '../components/ActionBar'
import SiteHeader from '../components/SiteHeader'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Vegetarian Restaurant Deals in Delhi NCR | Veg Club', template: '%s | The Veg Club' },
  description: 'Every live vegetarian dining deal in Ghaziabad and Sahibabad — buffets from ₹1,399, 1+1 dinners, 20% off à la carte. Book for ₹50.',
  applicationName: SITE.name,
  formatDetection: { telephone: true },
  openGraph: { siteName: SITE.name, locale: 'en_IN', type: 'website' },
  twitter: { card: 'summary_large_image' },
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
        <div className="bar">
          Deals available <b>only</b> on thevegclub.com — not on Zomato, Dineout or EazyDiner
        </div>
        <SiteHeader />
        {children}
        <footer>
          <div className="wrap">
            <b>The Veg Club</b> — vegetarian restaurant deals in Delhi NCR<br />
            64/6 · 3B’s · Tatva · Skydeck · Sahibabad, Ghaziabad
          </div>
        </footer>
        <ActionBar />
      </body>
    </html>
  )
}

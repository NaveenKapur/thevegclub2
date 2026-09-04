/* Single place for every environment-driven value. */
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thevegclub.com',
  name: 'The Veg Club',
  tagline: 'Vegetarian restaurant deals in Delhi NCR',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '919988119793',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '919988119793',
  fee: Number(process.env.NEXT_PUBLIC_RESERVATION_FEE || 50),
  locality: 'Sahibabad',
  region: 'Uttar Pradesh',
  country: 'IN',
}

export const CRM = {
  // Public CRM base. The booking/status/receipt/retry endpoints below are
  // public and CORS-restricted to this site; they need no API key. CRM_API_KEY
  // is still honoured if one is ever introduced.
  base: process.env.CRM_BASE_URL || 'https://crm.radissonveg.com',
  key: process.env.CRM_API_KEY || '',
  // Live contract (CRM repo: docs/WEBSITE-BOOKING-CONTRACT.md).
  bookingPath: process.env.CRM_BOOKING_PATH || '/api/public/website-reservation-form',
  statusPath: process.env.CRM_STATUS_PATH || '/api/reservations/by-ref',
  publicReservationPath: process.env.CRM_PUBLIC_RESERVATION_PATH || '/api/public/reservations',
  dealsPath: process.env.CRM_DEALS_PATH || '/api/public/deals',
  // Which payment provider the CRM should raise the order against.
  // 'mock' while HDFC merchant credentials are pending -- it is the path the
  // CRM already enables for exactly this. Set CRM_GATEWAY=hdfc (or remove it,
  // once HDFC is the CRM's default) the day the bank goes live: ONE environment
  // variable, no code change, because the site only ever follows the payUrl the
  // CRM returns and never builds a provider URL itself.
  gateway: process.env.CRM_GATEWAY || 'mock',
  timeout: Number(process.env.CRM_TIMEOUT_MS || 8000),
}

export const HERMES = {
  base: process.env.HERMES_BASE_URL || '',
  key: process.env.HERMES_API_KEY || '',
  sendPath: process.env.HERMES_SEND_PATH || '/api/send',
  agent: process.env.HERMES_AGENT || 'reservations',
  timeout: Number(process.env.HERMES_TIMEOUT_MS || 8000),
}

export const phoneDisplay = (p = SITE.phone) =>
  '+' + p.slice(0, 2) + ' ' + p.slice(2, 7) + ' ' + p.slice(7)

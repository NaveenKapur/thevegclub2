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
  base: process.env.CRM_BASE_URL || '',
  key: process.env.CRM_API_KEY || '',
  enquiryPath: process.env.CRM_ENQUIRY_PATH || '/api/enquiries',
  dealsPath: process.env.CRM_DEALS_PATH || '/api/promotions',
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

/* Deals are DERIVED from lib/pricing.js — never typed twice.
   Change a rate there and every card, hub and bill follows. */
import { headlineDeals } from '../lib/pricing'

export const DEALS = headlineDeals()

export const weekdayDeals = (deals = DEALS) =>
  deals.filter(d => d.status === 'live' && d.days !== 'weekend')

export const weekendDeals = (deals = DEALS) =>
  deals.filter(d => d.status === 'live' && d.days === 'weekend')

export const HUBS = {
  'buffet':         { title: 'Buffet Deals', filter: d => d.outlet === '64-6' },
  'lunch':          { title: 'Lunch Deals', filter: d => d.session === 'lunch' },
  'dinner':         { title: 'Dinner Deals', filter: d => d.session === 'dinner' },
  'breakfast':      { title: 'Breakfast Deals', filter: d => d.session === 'breakfast' },
  '1-plus-1':       { title: '1+1 Deals', filter: d => d.type === 'one_plus_one' },
  '50-percent-off': { title: '50% Off Deals', filter: d => d.savingPct >= 48 },
}

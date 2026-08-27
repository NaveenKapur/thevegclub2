/* Only 64/6 is selling coupons at launch. 3B's and Tatva show "coming soon".
   Skydeck is enquiry-only (50+ guests) and has no coupon at all.

   days: 'weekday' (Mon–Fri) | 'weekend' (Sat–Sun) | 'all'
   Weekday and weekend rates differ, so the two sets are NEVER shown together.
   Weekend rates appear only on the 64/6 restaurant page, in their own section.
*/
export const DEALS = [
  // ── weekday, the ones we promote ────────────────────────────────────
  { slug:'lunch-1-plus-1', name:'Lunch 1+1', outlet:'64-6', session:'lunch',
    type:'one_plus_one', pricePerGuest:1400, priceTotal:2800, rack:2799, covers:2,
    minGuests:2, maxGuests:20, days:'weekday', note:'Monday to Friday · two guests, one price',
    status:'live', hot:true },
  { slug:'dinner-1-plus-1', name:'Dinner 1+1', outlet:'64-6', session:'dinner',
    type:'one_plus_one', pricePerGuest:1650, priceTotal:3300, rack:3299, covers:2,
    minGuests:2, maxGuests:20, days:'weekday', note:'Monday to Friday · two guests, one price',
    status:'live', hot:true },
  { slug:'breakfast-buffet', name:'Breakfast Buffet', outlet:'64-6', session:'breakfast',
    type:'flat_price', pricePerGuest:1399, priceTotal:null, rack:2599,
    minGuests:1, maxGuests:20, days:'all', note:'7:00 – 10:30 am', status:'live' },
  { slug:'lunch-buffet', name:'Lunch Buffet', outlet:'64-6', session:'lunch',
    type:'flat_price', pricePerGuest:1700, priceTotal:null, rack:2799,
    minGuests:1, maxGuests:20, days:'all', note:'12:30 – 3:30 pm', status:'live' },
  { slug:'dinner-buffet', name:'Dinner Buffet', outlet:'64-6', session:'dinner',
    type:'flat_price', pricePerGuest:1900, priceTotal:null, rack:3299,
    minGuests:1, maxGuests:20, days:'all', note:'7:00 – 11:00 pm', status:'live' },

  // ── weekend, different rates — shown only on the 64/6 page ──────────
  { slug:'weekend-breakfast-1-plus-1', name:'Weekend Breakfast 1+1', outlet:'64-6', session:'breakfast',
    type:'one_plus_one', pricePerGuest:1300, priceTotal:2600, rack:2599, covers:2,
    minGuests:2, maxGuests:20, days:'weekend', note:'Saturday & Sunday', status:'live' },
  { slug:'weekend-lunch-1-plus-1', name:'Weekend Lunch 1+1', outlet:'64-6', session:'lunch',
    type:'one_plus_one', pricePerGuest:1600, priceTotal:3200, rack:2799, covers:2,
    minGuests:2, maxGuests:20, days:'weekend', note:'Saturday & Sunday', status:'live' },
  { slug:'weekend-dinner-1-plus-1', name:'Weekend Dinner 1+1', outlet:'64-6', session:'dinner',
    type:'one_plus_one', pricePerGuest:1800, priceTotal:3600, rack:3299, covers:2,
    minGuests:2, maxGuests:20, days:'weekend', note:'Saturday & Sunday', status:'live' },
]

/* Everything the public sees by default: weekday + all-days. Never weekend. */
export const weekdayDeals = (deals = DEALS) =>
  deals.filter(d => d.status === 'live' && d.days !== 'weekend')

/* Weekend set, used only on the 64/6 restaurant page. */
export const weekendDeals = (deals = DEALS) =>
  deals.filter(d => d.status === 'live' && d.days === 'weekend')

export const HUBS = {
  'buffet':         { title:'Buffet Deals', filter: d => d.outlet === '64-6' },
  'lunch':          { title:'Lunch Deals', filter: d => d.session === 'lunch' },
  'dinner':         { title:'Dinner Deals', filter: d => d.session === 'dinner' },
  'breakfast':      { title:'Breakfast Deals', filter: d => d.session === 'breakfast' },
  '1-plus-1':       { title:'1+1 Deals', filter: d => d.type === 'one_plus_one' },
  '50-percent-off': { title:'50% Off Deals', filter: d => d.rack && d.pricePerGuest && (1 - d.pricePerGuest / d.rack) >= 0.48 },
}

/* Fallback deal list. The CRM (pct211) is the source of truth in production;
   this keeps the site alive if the CRM is unreachable. Shape matches
   fromCrmDeal() in lib/crm.js exactly. */
export const DEALS = [
  { slug:'breakfast-buffet', name:'Breakfast Buffet', outlet:'64-6', session:'breakfast',
    type:'flat_price', pricePerGuest:1399, priceTotal:null, rack:2599, minGuests:1, maxGuests:20,
    validity:'all', note:'7:00 – 10:30 am', status:'live' },
  { slug:'lunch-buffet', name:'Lunch Buffet', outlet:'64-6', session:'lunch',
    type:'flat_price', pricePerGuest:1700, priceTotal:null, rack:2799, minGuests:1, maxGuests:20,
    validity:'all', note:'12:30 – 3:30 pm', status:'live' },
  { slug:'dinner-buffet', name:'Dinner Buffet', outlet:'64-6', session:'dinner',
    type:'flat_price', pricePerGuest:1900, priceTotal:null, rack:3299, minGuests:1, maxGuests:20,
    validity:'all', note:'7:00 – 11:00 pm', status:'live' },
  { slug:'lunch-1-plus-1', name:'Lunch 1+1', outlet:'64-6', session:'lunch',
    type:'one_plus_one', pricePerGuest:1400, priceTotal:2800, rack:2799, minGuests:2, maxGuests:20,
    validity:'weekday', note:'Monday to Friday · two guests, one price', status:'live', hot:true },
  { slug:'dinner-1-plus-1', name:'Dinner 1+1', outlet:'64-6', session:'dinner',
    type:'one_plus_one', pricePerGuest:1650, priceTotal:3300, rack:3299, minGuests:2, maxGuests:20,
    validity:'weekday', note:'Monday to Friday · two guests, one price', status:'live', hot:true },
  { slug:'breakfast-1-plus-1', name:'Breakfast 1+1', outlet:'64-6', session:'breakfast',
    type:'one_plus_one', pricePerGuest:1300, priceTotal:2600, rack:2599, minGuests:2, maxGuests:20,
    validity:'weekend', note:'Saturday & Sunday', status:'live', hot:true },
  { slug:'weekend-lunch-1-plus-1', name:'Weekend Lunch 1+1', outlet:'64-6', session:'lunch',
    type:'one_plus_one', pricePerGuest:1600, priceTotal:3200, rack:2799, minGuests:2, maxGuests:20,
    validity:'weekend', note:'Saturday & Sunday', status:'live' },
  { slug:'weekend-dinner-1-plus-1', name:'Weekend Dinner 1+1', outlet:'64-6', session:'dinner',
    type:'one_plus_one', pricePerGuest:1800, priceTotal:3600, rack:3299, minGuests:2, maxGuests:20,
    validity:'weekend', note:'Saturday & Sunday', status:'live' },
  { slug:'3bs-20-off', name:'20% off the food bill', outlet:'3bs', session:'dinner',
    type:'percent_off', percentOff:20, pricePerGuest:null, priceTotal:null, minGuests:2, maxGuests:20,
    validity:'all', note:'À la carte · food only', status:'live' },
  { slug:'tatva-20-off', name:'20% off the food bill', outlet:'tatva', session:'dinner',
    type:'percent_off', percentOff:20, pricePerGuest:null, priceTotal:null, minGuests:2, maxGuests:20,
    validity:'all', note:'À la carte · food only', status:'live' },
  { slug:'little-italy-20-off', name:'20% off the food bill', outlet:'little-italy', session:'dinner',
    type:'percent_off', percentOff:20, pricePerGuest:null, priceTotal:null, minGuests:2, maxGuests:20,
    validity:'all', note:'À la carte · food only', status:'provisional' },
]

/* Hubs are filters over this one list — never a second copy of the data. */
export const HUBS = {
  'lunch':          { title:'Lunch Deals', filter: d => d.session === 'lunch' },
  'dinner':         { title:'Dinner Deals', filter: d => d.session === 'dinner' },
  'breakfast':      { title:'Breakfast Deals', filter: d => d.session === 'breakfast' },
  'buffet':         { title:'Buffet Deals', filter: d => d.type === 'flat_price' || d.type === 'one_plus_one' },
  '1-plus-1':       { title:'1+1 Deals', filter: d => d.type === 'one_plus_one' },
  '50-percent-off': { title:'50% Off Deals', filter: d => d.rack && d.pricePerGuest && (1 - d.pricePerGuest / d.rack) >= 0.48 },
  'sunday-brunch':  { title:'Sunday Brunch', filter: d => d.validity === 'weekend' && d.session !== 'dinner' },
}

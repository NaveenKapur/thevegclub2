/*  Ad landing pages. One offer, one button, no navigation, noindex.
 *
 *  Add a campaign by adding an entry here — no new code. Point the ad at
 *  /lp/<key>?utm_source=…  and the attribution rides through to the CRM.
 */
export const LANDING = {
  'dinner-1-1': {
    dealSlug: 'dinner-1-plus-1',
    outlet: '64/6',
    offer: 'Dinner 1+1',
    session: 'dinner',
    eyebrow: 'Monday to Friday · 64/6, Sahibabad',
    h1a: 'Two dinners.', h1b: 'One price.',
    sub: 'The full vegetarian dinner buffet at 64/6 — live counters, forty dishes, dessert table. Two guests eat for the price of one.',
    price: 3299, was: 6598, perGuest: 1650, savePct: 50,
    weekdayOnly: true,
    times: ['7:00 pm','7:30 pm','8:00 pm','8:30 pm','9:00 pm','9:30 pm','10:00 pm'],
    hero: 's_buffet',
    terms: 'Dinner 1+1 valid Monday to Friday. Minimum 2 guests, maximum 20 per reservation. Prior reservation mandatory. Not valid with any other offer. Beverages charged separately.',
  },
  'lunch-1-1': {
    dealSlug: 'lunch-1-plus-1',
    outlet: '64/6',
    offer: 'Lunch 1+1',
    session: 'lunch',
    eyebrow: 'Monday to Friday · 64/6, Sahibabad',
    h1a: 'Two lunches.', h1b: 'One price.',
    sub: 'The full vegetarian lunch buffet at 64/6 — live counters, salad station, dessert table. Two guests eat for the price of one.',
    price: 2799, was: 5598, perGuest: 1400, savePct: 50,
    weekdayOnly: true,
    times: ['12:30 pm','1:00 pm','1:30 pm','2:00 pm','2:30 pm','3:00 pm'],
    hero: 's_live',
    terms: 'Lunch 1+1 valid Monday to Friday. Minimum 2 guests, maximum 20 per reservation. Prior reservation mandatory. Not valid with any other offer.',
  },
  'buffet': {
    dealSlug: 'lunch-buffet',
    outlet: '64/6',
    offer: 'Lunch Buffet',
    session: 'lunch',
    eyebrow: 'All days · 64/6, Sahibabad',
    h1a: 'The full buffet.', h1b: '₹1,700 a head.',
    sub: 'The vegetarian lunch buffet at 64/6. Live counters, forty dishes, dessert table.',
    price: 1699, was: 2799, perGuest: 1699, savePct: 39,
    weekdayOnly: false,
    times: ['12:30 pm','1:00 pm','1:30 pm','2:00 pm','2:30 pm','3:00 pm'],
    hero: 's_buffet',
    terms: 'Lunch buffet available all days. Minimum 1 guest, maximum 20 per reservation. Prior reservation mandatory.',
  },
}

export const GALLERY = ['s_salad','food','li_dessert','s_live','bar','romance','deck','night']

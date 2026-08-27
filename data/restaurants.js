/* Supplier restaurants.
   status: 'live' | 'coming_soon' | 'enquiry'
     live        — deals bookable for ₹50
     coming_soon — page shows, deals do not
     enquiry     — no ₹50 deal; a group enquiry form instead
*/
export const RESTAURANTS = [
  {
    slug: '64-6', name: '64/6', status: 'live',
    kind: 'All-day dining · buffet',
    supplier: 'Country Inn & Suites by Radisson, Sahibabad',
    cuisines: ['North Indian','South Indian','Chinese','Asian','Continental','Italian','Mexican','Thai','Biryani','Pizza','Street Food','Desserts'],
    costForTwo: 'Counter ₹2,599 – ₹3,299 per guest',
    hours: 'All-day breakfast · lunch · dinner',
    maxGuests: 20, minGuests: 1,
    facilities: ['Buffet','Live counters','Valet parking','Air conditioned','Family friendly'],
    veganOptions: 'pending', noOnionNoGarlic: 'on request',
    area: 'Sahibabad', lat: null, lng: null,
    about: '64/6 is the all-day buffet restaurant at Country Inn & Suites by Radisson, Sahibabad — a skylit room with live counters and buffet spreads across breakfast, lunch and dinner.',
    photos: ['s_atrium','s_buffet','s_live','s_hall','s_plants','s_salad','s_long'],
  },
  {
    slug: '3bs', name: "3B's", status: 'coming_soon',
    kind: 'Dinner · poolside',
    supplier: 'Country Inn & Suites by Radisson, Sahibabad',
    cuisines: ['North Indian','Chinese','Continental','Italian','Thai','Mexican','Biryani','Pizza','Desserts'],
    costForTwo: '₹2,600 for two',
    hours: 'Dinner only · evenings',
    sessions: ['dinner'],
    maxGuests: 20, minGuests: 2,
    facilities: ['Poolside','DJ','Valet parking','Romantic','Family friendly'],
    veganOptions: 'pending', noOnionNoGarlic: 'on request',
    area: 'Sahibabad', lat: null, lng: null,
    about: 'Bold Flavours, Better Choices, Balanced Experience. An open-air restaurant on two levels around a lit pool, with a living wall and table-side flambé service. Dinner service only — 3B\u2019s does not open for breakfast or lunch.',
    photos: ['b_pool_night','hero','deck','lounge','night','bar','food','romance','wall'],
  },
  {
    slug: 'tatva', name: 'Tatva', status: 'coming_soon',
    kind: 'Dinner · fine dining',
    supplier: 'Country Inn & Suites by Radisson, Sahibabad',
    cuisines: ['North Indian','Asian','Chinese','Continental','Italian','Mexican','Thai','Pizza','Desserts'],
    costForTwo: '₹2,600 for two',
    hours: 'Dinner only · evenings',
    sessions: ['dinner'],
    maxGuests: 20, minGuests: 2,
    facilities: ['Indoor','Full bar','Romantic','Valet parking','Family friendly'],
    veganOptions: 'pending', noOnionNoGarlic: 'on request',
    area: 'Sahibabad', lat: null, lng: null,
    about: 'Rooted in the philosophy of purity, balance and authentic flavours — a thoughtfully curated à la carte menu inspired by Indian culinary heritage and global influences. Dinner service only — Tatva does not open for breakfast or lunch.',
    photos: ['t_hall','t_barroom','t_bar','t_long','t_sofas','t_barclose','t_barrels'],
  },
  {
    slug: 'skydeck', name: 'Skydeck', status: 'enquiry',
    kind: 'Terrace · large gatherings',
    supplier: 'Country Inn & Suites by Radisson, Sahibabad',
    cuisines: ['Italian','North Indian','Continental','Pizza','Pasta','Desserts'],
    costForTwo: 'Quoted per event',
    hours: 'Evenings, by arrangement',
    minGroup: 50, maxGuests: 250,
    facilities: ['Open terrace','Dance floor','Full bar','Valet parking','Live music'],
    veganOptions: 'pending', noOnionNoGarlic: 'on request',
    area: 'Sahibabad', lat: null, lng: null,
    about: 'Skydeck is the open terrace, taken as a whole for large gatherings — birthdays, anniversaries, corporate evenings and receptions. Minimum 50 guests. Pricing is quoted per event, not sold as a coupon.',
    photos: ['li_terrace','li_wall','li_wide','li_upper','li_dessert'],
  },
]

export const bySlug = (s) => RESTAURANTS.find(r => r.slug === s)
export const LIVE = () => RESTAURANTS.filter(r => r.status === 'live')

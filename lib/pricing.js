/*  ────────────────────────────────────────────────────────────────────
    SINGLE SOURCE OF TRUTH FOR EVERY PRICE ON THIS SITE.
    Change a rate here and it changes on the cards, the bill, the
    landing pages and the schema. Nowhere else holds a number.
    ──────────────────────────────────────────────────────────────────── */

export const RESERVATION_FEE = 50

/* Counter ("rack") rates — what a walk-in guest pays, per guest. */
export const RACK = {
  breakfast: 2599,
  lunch:     2799,
  dinner:    3299,
}

/* Service windows. Shown to the guest — never selectable, because
   picking 7:30 am for a lunch booking is the mistake people make. */
export const SERVICE = {
  breakfast: { label: 'Breakfast', window: '7:00 – 10:30 am', start: '07:00' },
  lunch:     { label: 'Lunch',     window: '12:30 – 3:30 pm', start: '12:30' },
  dinner:    { label: 'Dinner',    window: '7:00 – 11:00 pm', start: '19:00' },
}

/*  Deal rates.
    single — one guest, per guest
    pair   — a deal covering exactly two guests
    A meal may have a different pair rate on weekends.            */
export const DEALS = {
  breakfast: {
    single:      { weekday: 1399, weekend: 1399 },
    pair:        null,                              // no breakfast pair deal
  },
  lunch: {
    single:      { weekday: 1699, weekend: 1699 },
    pair:        { weekday: 2799, weekend: 3199 },
  },
  dinner: {
    single:      { weekday: 1899, weekend: 1899 },
    pair:        { weekday: 3299, weekend: 3599 },
  },
}

export const isWeekend = (dateStr) => {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T12:00').getDay()
  return d === 0 || d === 6
}

export const money = (n) => '₹' + Number(n).toLocaleString('en-IN')

/*  The bill.
 *
 *  Guests are charged; children up to 5 years are complimentary and are
 *  NOT counted in the total at all.
 *
 *  Pairs take the two-guest deal, any odd guest takes the single rate.
 *  We then check the all-singles price too and keep whichever is cheaper,
 *  so a guest can never be worse off by booking through us.
 */
export function quote({ meal, guests, date }) {
  const g = Math.max(1, Number(guests) || 1)
  const wk = isWeekend(date) ? 'weekend' : 'weekday'
  const d = DEALS[meal]
  if (!d) return null

  const single = d.single[wk]
  const pair = d.pair ? d.pair[wk] : null

  const lines = []
  let total = 0

  if (pair) {
    const pairs = Math.floor(g / 2)
    const singles = g % 2
    // Option A — use the pair deals
    const a = pairs * pair + singles * single
    // Option B — everyone on the single rate
    const b = g * single
    if (a <= b) {
      if (pairs) lines.push({ label: `${SERVICE[meal].label} 1+1`, qty: pairs, each: pair, amount: pairs * pair, deal: true })
      if (singles) lines.push({ label: `${SERVICE[meal].label} · single guest`, qty: singles, each: single, amount: singles * single })
      total = a
    } else {
      lines.push({ label: `${SERVICE[meal].label} · per guest`, qty: g, each: single, amount: b })
      total = b
    }
  } else {
    lines.push({ label: `${SERVICE[meal].label} · per guest`, qty: g, each: single, amount: g * single })
    total = g * single
  }

  const rack = RACK[meal] * g
  const saving = rack - total
  const savingPct = rack > 0 ? Math.round((saving / rack) * 100) : 0

  return {
    meal, guests: g, weekend: wk === 'weekend',
    lines, total, rack, saving, savingPct,
    perGuest: Math.round(total / g),
    fee: RESERVATION_FEE * g,
    feePerGuest: RESERVATION_FEE,
    balance: total - RESERVATION_FEE * g,
    window: SERVICE[meal].window,
    start: SERVICE[meal].start,
  }
}

/*  Headline deals, derived from the rates above — used on cards and hubs
    so a card can never disagree with the bill.                        */
export function headlineDeals() {
  const mk = (slug, meal, kind, wk, days, note) => {
    const d = DEALS[meal]
    const isPair = kind === 'pair'
    const price = isPair ? d.pair[wk] : d.single[wk]
    const covers = isPair ? 2 : 1
    const rack = RACK[meal] * covers
    return {
      slug, outlet: '64-6', session: meal, days, note,
      name: isPair
        ? `${SERVICE[meal].label} 1+1`
        : `${SERVICE[meal].label} Buffet`,
      type: isPair ? 'one_plus_one' : 'flat_price',
      covers,
      priceTotal: isPair ? price : null,
      pricePerGuest: isPair ? Math.round(price / 2) : price,
      rack: RACK[meal],
      rackTotal: rack,
      saving: rack - price,
      savingPct: Math.round(((rack - price) / rack) * 100),
      minGuests: covers, maxGuests: 20,
      status: 'live',
    }
  }
  return [
    mk('lunch-1-plus-1',  'lunch',  'pair',   'weekday', 'weekday', 'Monday to Friday'),
    mk('dinner-1-plus-1', 'dinner', 'pair',   'weekday', 'weekday', 'Monday to Friday'),
    mk('breakfast-buffet','breakfast','single','weekday','all',     SERVICE.breakfast.window),
    mk('lunch-buffet',    'lunch',  'single', 'weekday', 'all',     SERVICE.lunch.window),
    mk('dinner-buffet',   'dinner', 'single', 'weekday', 'all',     SERVICE.dinner.window),
    mk('weekend-lunch-2', 'lunch',  'pair',   'weekend', 'weekend', 'Saturday & Sunday'),
    mk('weekend-dinner-2','dinner', 'pair',   'weekend', 'weekend', 'Saturday & Sunday'),
  ]
}

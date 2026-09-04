# thevegclub.com

Vegetarian restaurant deals platform for Delhi NCR. Next.js 15 (App Router), deployed
via Coolify from this GitHub repo.

## What connects to what

```
Guest browser
     │  https
     ▼
Coolify  192.168.1.102        ← this app
     │
     ├─► cis  (CRM)     pct211  192.168.1.211   bookings, deals
     └─► Hermes (agent) pct103  192.168.1.103   WhatsApp
```

The two private-IP calls happen **server-side only**, from `/api/enquiry`. The guest's
browser never sees a CRM address or an API key. Confirmed: `grep 192.168` over the
rendered HTML returns nothing.

## Run locally

```bash
cp .env.example .env      # fill in CRM_BASE_URL and keys
npm install
npm run dev               # http://localhost:3006
```

Without `CRM_BASE_URL`, deals come from `data/deals.js` and bookings return a clean
"please call us" error. The site never shows a blank page.

## Deploy on Coolify

1. Point Coolify at this GitHub repo.
2. Build pack: **Dockerfile** (already in the repo). Port **3000**.
3. Set the environment variables from `.env.example` in Coolify's UI — not in the repo.
4. Coolify must be able to reach `192.168.1.211` and `192.168.1.103` on the LAN.

## The CRM contract

Live and proven, 04 Sep 2026. Full spec in the CRM repo:
`docs/WEBSITE-BOOKING-CONTRACT.md`. Base: `https://crm.radissonveg.com`.

**The CRM owns the reservation and the money.** This site never computes the
amount it charges and never keeps a second copy of a booking.

### Website → CRM · `POST /api/public/website-reservation-form`

```json
{
  "category": "Restaurant Reservation",
  "venue": "64/6 – The Buffet Destination",
  "adults": 2,
  "children": 1,
  "countryCode": "+91",
  "phone": "9988119793",
  "whatsappOptIn": true,
  "name": "Naveen Kapur",
  "email": "a@b.com",
  "reservationDate": "2026-09-15",
  "session": "dinner",
  "slotTime": "20:00"
}
```

`adults` are the **payable** guests; `children` are complimentary under-5s who
count for table size but are **not** charged.

**Reply**

```json
{
  "reservationRef": "RVR-2026-000456",
  "amountPaise": 10000,
  "payableCovers": 2,
  "chargeDescription": "₹50 per person × 2 guests — redeemable against your restaurant bill",
  "payUrl": "https://…",
  "duplicateSubmission": false,
  "bookingUnavailableReason": null
}
```

₹50 per payable guest, and it is a **deposit that is redeemable against the
restaurant bill** — never describe it as non-refundable or non-adjustable.

`payUrl` may be `null`; handle that rather than assuming a link. Always follow
the CRM's `payUrl` — never hardcode a payment-provider URL, so nothing here
changes when the real HDFC page replaces the current one.

### The rest of the journey

| Purpose | Endpoint |
|---|---|
| Status (the only thing that confirms a booking) | `GET /api/reservations/by-ref/{ref}/status` |
| Receipt | `GET /api/public/reservations/{ref}/receipt` |
| Printable receipt | `GET /api/public/reservations/{ref}/receipt?format=html` |
| Try again after a failed payment | `POST /api/public/reservations/{ref}/retry-payment` |

`state` is one of `PENDING`, `CONFIRMED`, `AWAITING_CONFIRMATION`, `EXPIRED`,
`CANCELLED`, `ARRIVED`, `COMPLETED`, `NO_SHOW`. A payment return URL in the
address bar proves nothing — only this endpoint does. `AWAITING_CONFIRMATION`
means we have the guest's money and a person is confirming the table; it must
never be shown as a failure.

Retry preserves the **same** `reservationRef` and issues a fresh payment
attempt — it never creates a second booking.


### CRM → website · deals · `GET {CRM_BASE_URL}{CRM_DEALS_PATH}?status=live`

Expects `{ "data": [ … ] }` or a bare array. Field names are mapped in
`fromCrmDeal()` in `lib/crm.js` — **that function is the only place to change
if the CRM's field names differ.**

### CRM → website · price changed · `POST /api/revalidate`

```
Header: x-revalidate-secret: <REVALIDATE_SECRET>
Body:   { "paths": ["/deals", "/deals/dinner", "/"] }
```

The named pages rebuild within seconds. No redeploy. This is what lets marketing
change a price without a developer.

### Website → Hermes · `POST {HERMES_BASE_URL}{HERMES_SEND_PATH}`

```json
{ "agent": "reservations", "to": "+919988119793", "type": "text",
  "text": "…", "thread_key": "CIS-2026-004417" }
```

A Hermes failure is logged and ignored — it must never fail a booking that the CRM
has already saved.

## Where things live

| Path | What |
|---|---|
| `data/restaurants.js` | Restaurants. Add one here or in the CRM. |
| `data/deals.js` | Fallback deals **and** the hub filters. |
| `lib/crm.js` | Everything that talks to pct211. Field mapping at the bottom. |
| `lib/hermes.js` | Everything that talks to pct103. Message wording here. |
| `lib/schema.js` → `schema.jsx` | JSON-LD builders. |
| `app/api/enquiry` | The only route the browser calls. |
| `app/globals.css` | All styling. |

Hub pages are **filters over one deal list**, defined in `HUBS` in `data/deals.js`.
`/deals/lunch` is "session = lunch". Adding a restaurant to the CRM makes it appear
on every relevant hub, sitemap entry and schema block with no code change.

## Verified before handover

- `npm run build` clean — 21 routes, 15 sitemap URLs.
- Server-rendered HTML contains prices with JavaScript disabled (AI crawlers can read it).
- 8 JSON-LD blocks on the home page.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended.
- CRM unreachable → HTTP 502 with a guest-safe message, booking not lost silently.
- Bad mobile → HTTP 422, named field.
- `/api/revalidate` without the secret → HTTP 401.
- Full booking against a mock CRM → correct payload, reference returned, payment URL followed.
- CRM revalidate → live CRM deals replace the fallback within seconds.
- No `192.168.*` address anywhere in the rendered HTML.

## Pricing — one file

`lib/pricing.js` holds EVERY price on the site: counter (rack) rates, deal rates,
service windows and the bill calculator. Cards, hubs, the booking bill, the landing
pages and the JSON-LD all derive from it. **Never type a price anywhere else.**

Counter rates (per guest): breakfast ₹2,599 · lunch ₹2,799 · dinner ₹3,299.
Deals: breakfast ₹1,399 · lunch ₹1,699 · dinner ₹1,899 for one guest;
weekday 1+1 ₹2,799 lunch / ₹3,299 dinner; weekend pairs ₹3,199 lunch / ₹3,599 dinner.

The bill pairs guests into 1+1 rates and charges any odd guest the single rate, then
checks the all-singles total and keeps whichever is cheaper — a guest can never be
worse off. Children up to 5 years are complimentary and are not counted at all.

**Service times are shown, never selected** — picking 7:30 am for a lunch booking was
the mistake people made. The booking sends the session's start time automatically.

## Launch scope (August 2026)

Only **64/6** sells coupons. 3B's and Tatva show "coming soon". **Skydeck** (formerly
Little Italy) is enquiry-only — the whole terrace, minimum 50 guests, quoted per event,
never a ₹50 coupon.

**Weekday and weekend rates differ and are never shown together.**
`weekdayDeals()` drives the home page, /deals and every hub. `weekendDeals()` appears in
its own section on `/restaurants/64-6` only. In the booking form, choosing a date filters
the deal list to that day type — pick a Saturday and the weekday 1+1 disappears.

## Preview without installing anything

`preview/landing-page-preview.html` — open in a browser to see the ad landing page exactly
as it will look. Self-contained, no server needed. The live route is `/lp/lunch-1-1`.

## URLs

| URL | Indexed |
|---|---|
| `/` home | yes |
| `/deals` and `/deals/buffet`, `/lunch`, `/dinner`, `/breakfast`, `/1-plus-1`, `/50-percent-off` | yes |
| `/restaurants` and `/restaurants/64-6`, `/3bs`, `/tatva`, `/skydeck` | yes |
| `/book` | yes |
| `/lp/lunch-1-1`, `/lp/dinner-1-1`, `/lp/buffet` — **ad landing pages** | **no** |

## Still to do

1. **Confirm the real API paths on pct211 and pct103** — the defaults in `.env.example`
   are placeholders. See the discovery prompt handed over with this repo.
2. Payment gateway — the ₹50 is disclosed and the payment URL is followed, but the CRM
   must supply that URL.
3. Coupon page `/c/[code]` and staff screen `/redeem`.
4. Occasion pages, area pages, editorial — see the SEO blueprint.
5. Social cards in `public/og/` — one 1200×630 PNG per URL.
6. Open 3B's and Tatva: set `status: 'live'` in `data/restaurants.js` and add their deals to `data/deals.js`.
7. Vegan wording: every page says **vegetarian**. Do not change to "vegan" until each
   kitchen has confirmed a dairy-free list. See the SEO blueprint, section 02.

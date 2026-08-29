/*  Generates one 1200×630 social card per URL into public/og/.
 *
 *  Deliberately a build-time script writing real PNGs, not a runtime route:
 *  next/og returned 500 on every request in the previous build, and a card
 *  that fails at request time means a bare link on WhatsApp.
 *
 *  Playwright is intentionally NOT a dependency of this project — the Docker
 *  build would then download a 150 MB browser on every Coolify deploy for no
 *  reason. The cards are committed to public/og/ and only need regenerating
 *  when a price or a photo changes.
 *
 *  Run:  npm i -D playwright && npx playwright install chromium && npm run og
 */
import { chromium } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'public/og')
mkdirSync(OUT, { recursive: true })

const logo = readFileSync(resolve(root, 'public/brand/logo-256.png')).toString('base64')
const photo = (name) => readFileSync(resolve(root, `public/images/${name}.jpg`)).toString('base64')

/*  Keep the headline to 6–8 words: it is read at thumbnail size in a chat. */
const CARDS = [
  { file: 'home', photo: 's_buffet', kicker: 'Sahibabad · Ghaziabad',
    title: 'Veg buffet deals.\nOne ₹50 booking.', price: 'From ₹1,399 a person' },
  { file: 'deals', photo: 's_live', kicker: 'Every live coupon',
    title: 'Vegetarian buffet\ncoupons in Ghaziabad', price: 'Up to 50% off the counter price' },
  { file: 'deals-buffet', photo: 's_buffet', kicker: 'Buffet deals',
    title: 'Full veg buffet,\nfrom ₹1,399 a head', price: 'Breakfast · Lunch · Dinner' },
  { file: 'deals-lunch', photo: 's_hall', kicker: 'Lunch · Mon to Fri',
    title: 'Two lunches.\nOne price.', price: '₹2,799 for two · save ₹2,799' },
  { file: 'deals-dinner', photo: 'night', kicker: 'Dinner · Mon to Fri',
    title: 'Two dinners.\nOne price.', price: '₹3,299 for two · save ₹3,299' },
  { file: 'deals-breakfast', photo: 's_atrium', kicker: 'Breakfast · all days',
    title: 'Breakfast buffet\n₹1,399 a guest', price: 'Counter price ₹2,599 · save 46%' },
  { file: 'deals-1-plus-1', photo: 's_long', kicker: '1+1 deals',
    title: 'Buy one,\nget one free.', price: 'Lunch ₹2,799 · Dinner ₹3,299 for two' },
  { file: 'deals-50-percent-off', photo: 'romance', kicker: 'Half price',
    title: '50% off the\ncounter price', price: 'Weekday 1+1 buffets at 64/6' },
  { file: 'restaurants', photo: 's_atrium', kicker: 'Four restaurants, one hotel',
    title: 'Vegetarian restaurant\ndeals in Sahibabad', price: 'From ₹1,399 a person' },
  { file: 'restaurants-64-6', photo: 's_buffet', kicker: '64/6 · Sahibabad',
    title: 'All-day vegetarian\nbuffet', price: 'Lunch 1+1 ₹2,799 for two' },
  { file: 'restaurants-3bs', photo: 'b_pool_night', kicker: "3B's · poolside · dinner",
    title: 'Open-air dining\nby the pool', price: '₹2,600 for two · coupons soon' },
  { file: 'restaurants-tatva', photo: 't_barroom', kicker: 'Tatva · fine dining · dinner',
    title: 'Indoor à la carte,\nfull bar', price: '₹2,600 for two · coupons soon' },
  { file: 'restaurants-skydeck', photo: 'li_terrace', kicker: 'Skydeck · terrace',
    title: 'The whole terrace,\nfor 50 or more', price: 'Quoted per event' },
  { file: 'book', photo: 's_live', kicker: 'Book a table',
    title: 'Pick guests, meal\nand day', price: 'Pay ₹50 · coupon on WhatsApp' },
]

const html = (c) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Karla:wght@400;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;position:relative;
       font-family:Karla,Arial,sans-serif;background:#0B120E;color:#EDF1E9}
  .bg{position:absolute;inset:0}
  .bg img{width:100%;height:100%;object-fit:cover}
  .scrim{position:absolute;inset:0;
    background:linear-gradient(90deg,rgba(11,18,14,.96) 0%,rgba(11,18,14,.86) 46%,rgba(11,18,14,.30) 100%),
               linear-gradient(0deg,rgba(11,18,14,.72),transparent 55%)}
  .in{position:absolute;inset:0;padding:60px 72px;display:flex;flex-direction:column;justify-content:space-between}
  .top{display:flex;align-items:center;gap:16px}
  .top img{width:56px;height:56px;border-radius:50%}
  .brand{font-family:Fraunces,Georgia,serif;font-size:26px;font-weight:600;letter-spacing:-.01em}
  .brand small{display:block;font-family:Karla,Arial,sans-serif;font-size:11px;
    letter-spacing:.24em;color:#9DB0A2;font-weight:700;margin-top:3px}
  .kicker{font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#E3BA6B;font-weight:700;margin-bottom:18px}
  h1{font-family:Fraunces,Georgia,serif;font-size:70px;line-height:1.03;letter-spacing:-.03em;
     font-weight:600;white-space:pre-line;max-width:17ch}
  .price{margin-top:24px;display:inline-block;background:#C4922F;color:#241703;
     font-size:22px;font-weight:700;padding:12px 22px;border-radius:8px;align-self:flex-start}
  .foot{font-size:17px;color:#9DB0A2}
  .foot b{color:#E3BA6B}
</style>
<div class="bg"><img src="data:image/jpeg;base64,${photo(c.photo)}"></div>
<div class="scrim"></div>
<div class="in">
  <div class="top">
    <img src="data:image/png;base64,${logo}">
    <div class="brand">The Veg Club<small>DELHI NCR</small></div>
  </div>
  <div>
    <div class="kicker">${c.kicker}</div>
    <h1>${c.title}</h1>
    <div class="price">${c.price}</div>
  </div>
  <div class="foot">thevegclub.com · <b>up to 50% off the counter price</b></div>
</div>`

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium',
})
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })

for (const c of CARDS) {
  await page.setContent(html(c), { waitUntil: 'networkidle' })
  await page.waitForTimeout(280)
  /*  JPEG, not PNG: a 620 KB PNG makes WhatsApp drop the preview on a slow
   *  connection. Quality 84 lands each card around 120 KB with no visible loss. */
  await page.screenshot({ path: `${OUT}/${c.file}.jpg`, type: 'jpeg', quality: 84 })
  console.log('  og/' + c.file + '.jpg')
}
await browser.close()
console.log(`\n${CARDS.length} social cards written to public/og/`)

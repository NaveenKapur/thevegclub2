/*  T — the Indian calendar date a guest picks must not shift.
 *  Compares the OLD behaviour (toISOString) against the NEW helper at the
 *  exact IST times Sir named. Run with the machine in any timezone: the new
 *  answer must not change, which is the whole point. */
import { istDate, istToday, istPlusDays, isWeekendDate } from '../lib/date-ist.js'

const oldWay = (d) => d.toISOString().slice(0, 10)
// 2026-09-15 is a Tuesday in India.
const CASES = [
  ["00:30 IST", "2026-09-14T19:00:00Z", "2026-09-15"],
  ["01:00 IST", "2026-09-14T19:30:00Z", "2026-09-15"],
  ["04:30 IST", "2026-09-14T23:00:00Z", "2026-09-15"],
  ["05:29 IST", "2026-09-14T23:59:00Z", "2026-09-15"],
  ["05:30 IST", "2026-09-15T00:00:00Z", "2026-09-15"],
  ["06:30 IST", "2026-09-15T01:00:00Z", "2026-09-15"],
  ["13:00 IST", "2026-09-15T07:30:00Z", "2026-09-15"],
  ["23:59 IST", "2026-09-15T18:29:00Z", "2026-09-15"],
]
let pass = 0, fail = 0
console.log("time (IST)   instant (UTC)          OLD toISOString   NEW istDate      expected   verdict");
for (const [label, iso, expect] of CASES) {
  const d = new Date(iso)
  const o = oldWay(d), n = istDate(d)
  const ok = n === expect
  ok ? pass++ : fail++
  const drift = o === expect ? "" : "  <-- OLD WAS WRONG"
  console.log(`${label.padEnd(12)} ${iso}  ${o}        ${n}       ${expect}   ${ok ? "PASS" : "FAIL"}${drift}`)
}
// day arithmetic must not drift either
const t = istToday()
console.log(`\nistToday()      = ${t}`)
console.log(`istPlusDays(1)  = ${istPlusDays(1)}`)
console.log(`weekend check   2026-09-12(Sat)=${isWeekendDate("2026-09-12")}  2026-09-15(Tue)=${isWeekendDate("2026-09-15")}`)
const w1 = isWeekendDate("2026-09-12") === true && isWeekendDate("2026-09-15") === false
w1 ? pass++ : fail++
console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)

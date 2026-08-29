import { RATINGS, overallRating } from '../data/ratings'

/*  Google's own colours inside our own layout: the four-colour G and the
 *  #FBBC04 star Google itself uses, set on the site's panel and type.
 */
const GOLD = '#FBBC04'

function Stars({ score, size = 15 }) {
  /*  A half-lit last star, done with a clip rather than a half-star glyph, so
      4.6 does not silently become 5. */
  return (
    <span className="stars" style={{ '--sz': size + 'px' }} aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, score - i))
        return (
          <span key={i} className="star">
            <svg viewBox="0 0 20 19"><path d="M10 0l3.09 6.26L20 7.27l-5 4.87 1.18 6.88L10 15.77 3.82 19 5 12.14 0 7.27l6.91-1.01z" fill="#DADCE0"/></svg>
            <svg viewBox="0 0 20 19" className="on" style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}>
              <path d="M10 0l3.09 6.26L20 7.27l-5 4.87 1.18 6.88L10 15.77 3.82 19 5 12.14 0 7.27l6.91-1.01z" fill={GOLD}/>
            </svg>
          </span>
        )
      })}
    </span>
  )
}

export function GoogleG({ size = 16 }) {
  return (
    <svg className="gmark" viewBox="0 0 48 48" style={{ width: size, height: size }} aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11.9c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.1-3.8 6.5-9.4 6.5-16.5z"/>
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.6-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C8 41.4 15.4 46 24 46z"/>
      <path fill="#FBBC04" d="M11.6 28.2c-.5-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.3C2.8 17 2 20.4 2 24s.8 7 2.3 9.9l7.3-5.7z"/>
      <path fill="#EA4335" d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8 6.6 4.3 14.1l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1z"/>
    </svg>
  )
}

/*  The rating row for one restaurant page. Nothing is shown unless that
    restaurant actually has a listing in data/ratings.js.  */
export default function Rating({ slug, className = '' }) {
  const r = RATINGS[slug]
  if (!r) return null
  return (
    <div className={'rating ' + className}>
      <b className="score">{r.score.toFixed(1)}</b>
      <Stars score={r.score} />
      <a className="rcount" href={r.url} target="_blank" rel="noopener nofollow">
        <GoogleG /> {r.count.toLocaleString('en-IN')} Google reviews
      </a>
      <span className="rsub">{r.subject} · as on {r.asOf}</span>
    </div>
  )
}

/*  "Loved by guests" — the site-wide trust band for the home and restaurants
    pages. Every number here is the real total, added up from data/ratings.js. */
export function LovedBand({ note = null }) {
  const { score, count } = overallRating()
  return (
    <div className="loved">
      <div className="lovedtop">
        <div>
          <span className="eyebrow"><GoogleG size={15} /> Loved by guests on Google</span>
          <div className="lovedscore">
            <b>{score.toFixed(1)}</b>
            <Stars score={score} size={20} />
          </div>
          <p className="lovedline">
            across <b>{count.toLocaleString('en-IN')}</b> Google reviews of the restaurants behind these deals
          </p>
        </div>
      </div>

      <ul className="lovedpts">
        {Object.entries(RATINGS).map(([slug, r]) => (
          <li key={slug}>
            <a href={r.url} target="_blank" rel="noopener nofollow">
              <span className="lp1"><b>{r.score.toFixed(1)}</b><Stars score={r.score} size={12} /></span>
              <span className="lp2">{LABEL[slug] || r.subject}</span>
              <em>{r.count.toLocaleString('en-IN')} reviews</em>
            </a>
          </li>
        ))}
      </ul>

      <p className="lovedfine">
        Ratings as published on Google{note ? ' — ' + note : ''}. We do not host reviews of our own —
        tap a rating to read what guests actually wrote.
      </p>
    </div>
  )
}

const LABEL = {
  '64-6': '64/6 · Country Inn & Suites, Sahibabad',
  tatva: 'Tatva · fine dining',
  '3bs': "3B's · poolside",
}

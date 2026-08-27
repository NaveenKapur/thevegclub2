'use client'
import { useEffect, useState } from 'react'

/*  Restaurant gallery.
 *
 *  Click a thumbnail and it becomes the main image; click the main image and
 *  it opens full-screen. Keyboard-operable throughout — the thumbnails are
 *  real buttons, and the lightbox closes on Escape and traps nothing.
 */
export default function Gallery({ photos, alt }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => {
      if (e.key === 'Escape') setZoom(false)
      if (e.key === 'ArrowRight') setActive(i => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setActive(i => (i - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [zoom, photos.length])

  if (!photos?.length) return null

  return (
    <>
      <div className="gal">
        <button type="button" className="galmain" onClick={() => setZoom(true)}
          aria-label="View this photo full screen">
          <img src={`/images/${photos[active]}.jpg`} alt={alt} />
          <span className="galzoom" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg>
          </span>
        </button>
      </div>

      {photos.length > 1 ? (
        <div className="galmore" role="group" aria-label="More photos">
          {photos.map((p, i) => (
            <button key={p} type="button"
              className={'galthumb' + (i === active ? ' on' : '')}
              aria-current={i === active}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              onClick={() => setActive(i)}>
              <img src={`/images/${p}.jpg`} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}

      {zoom ? (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer"
          onClick={() => setZoom(false)}>
          <img src={`/images/${photos[active]}.jpg`} alt={alt} onClick={e => e.stopPropagation()} />
          <button type="button" className="lbclose" aria-label="Close photo viewer"
            onClick={() => setZoom(false)}>&times;</button>
          {photos.length > 1 ? (
            <>
              <button type="button" className="lbnav prev" aria-label="Previous photo"
                onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + photos.length) % photos.length) }}>‹</button>
              <button type="button" className="lbnav next" aria-label="Next photo"
                onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % photos.length) }}>›</button>
              <span className="lbcount">{active + 1} / {photos.length}</span>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

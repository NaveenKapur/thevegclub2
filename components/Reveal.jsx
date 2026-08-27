'use client'
import { useEffect, useRef, useState } from 'react'

/*  Fade-up on scroll.
 *
 *  Deliberately inverted: the server renders the content VISIBLE. The hidden
 *  state is added on the client, after mount, and only when the browser is
 *  willing to animate. So if JavaScript fails, or a crawler reads the page
 *  without running it, nothing is invisible — the animation is an
 *  enhancement, never a gate on the content.
 */
export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [state, setState] = useState('static')   // static → pre → in

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    // Already on screen at first paint? Leave it alone — no flash.
    const box = el.getBoundingClientRect()
    if (box.top < window.innerHeight * 0.92) return

    setState('pre')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setState('in'); io.unobserve(el) }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref}
      className={'rv' + (state === 'pre' ? ' pre' : '') + (state === 'in' ? ' in' : '')}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

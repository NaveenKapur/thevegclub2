'use client'
import { useState } from 'react'

export default function Faq({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div className={'faqitem' + (open === i ? ' open' : '')} key={f.q}>
          <button type="button" className="faqq"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className="faqa"><p>{f.a}</p></div>
        </div>
      ))}
    </div>
  )
}

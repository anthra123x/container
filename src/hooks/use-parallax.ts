"use client"

import { useEffect, useRef, useState } from "react"

export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.3) {
  const ref = useRef<T>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!el) return
          const rect = el.getBoundingClientRect()
          const center = rect.top + rect.height / 2
          const viewCenter = window.innerHeight / 2
          setOffset((center - viewCenter) * speed)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [speed])

  return { ref, offset }
}

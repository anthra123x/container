"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!el) return
          const rect = el.getBoundingClientRect()
          const sectionStart = rect.top
          const sectionEnd = rect.bottom
          const viewH = window.innerHeight

          const total = sectionEnd + viewH
          const current = viewH - sectionStart
          const p = Math.min(1, Math.max(0, current / total))

          setProgress(p)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return { ref, progress }
}

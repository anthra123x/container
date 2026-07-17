"use client"

import { useEffect, useRef, useState } from "react"

export function useInView<T extends HTMLElement = HTMLDivElement>({
  once = true,
  threshold = 0.1,
  rootMargin,
  root,
}: IntersectionObserverInit & { once?: boolean } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin, root }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold, rootMargin, root])

  return { ref, inView }
}

"use client"

import { useInView } from "@/hooks/use-in-view"

type Variant = "up" | "scale" | "blur" | "right"

interface RevealProps {
  children: React.ReactNode
  variant?: Variant
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  as?: "div" | "section" | "article" | "span"
  style?: React.CSSProperties
}

const variantClasses: Record<Variant, string> = {
  up: "animate-reveal-up",
  scale: "animate-reveal-scale",
  blur: "animate-blur-in",
  right: "animate-reveal-right",
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration,
  threshold = 0.15,
  className = "",
  as: Tag = "div",
  style: externalStyle,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold })

  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    animationFillMode: "both",
  }
  if (duration) hiddenStyle.animationDuration = `${duration}s`
  if (delay) hiddenStyle.animationDelay = `${delay}s`

  const visibleStyle: React.CSSProperties = {}
  if (duration) visibleStyle.animationDuration = `${duration}s`
  if (delay) visibleStyle.animationDelay = `${delay}s`

  return (
    <Tag
      ref={ref}
      className={`${inView ? variantClasses[variant] : ""} ${className}`}
      style={{ ...externalStyle, ...(inView ? visibleStyle : hiddenStyle) }}
    >
      {children}
    </Tag>
  )
}

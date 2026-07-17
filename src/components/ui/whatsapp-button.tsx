"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"

interface WhatsAppButtonProps {
  number: string
  message?: string
  label?: string
  variant?: "floating" | "inline"
  className?: string
}

export function WhatsAppButton({
  number,
  message = "Hola! Quiero información sobre un producto",
  label = "WhatsApp",
  variant = "inline",
  className = "",
}: WhatsAppButtonProps) {
  const [hovered, setHovered] = useState(false)
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.97]"

  if (variant === "inline") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`${baseClasses} px-6 py-3 text-white ${className}`}
        style={{
          background: hovered
            ? "linear-gradient(135deg, #20b038, #128C7E)"
            : "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow: hovered
            ? "0 8px 24px rgba(37, 211, 102, 0.35)"
            : "0 4px 12px rgba(37, 211, 102, 0.25)",
        }}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${baseClasses} fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full text-white shadow-lg md:bottom-8 md:right-8 ${className}`}
      style={{
        background: hovered
          ? "linear-gradient(135deg, #20b038, #128C7E)"
          : "linear-gradient(135deg, #25D366, #128C7E)",
        boxShadow: hovered
          ? "0 8px 32px rgba(37, 211, 102, 0.4)"
          : "0 4px 16px rgba(37, 211, 102, 0.3)",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
      }}
      aria-label={label}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

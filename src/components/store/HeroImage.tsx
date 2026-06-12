"use client"

import Image from "next/image"
import { useState } from "react"

interface HeroImageProps {
  src?: string
  alt?: string
}

export function HeroImage({
  src = "/images/owner.png",
  alt = "Johan - Propietario de Container",
}: HeroImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-sm rounded-2xl bg-gradient-to-br from-blue-100/80 to-blue-50 p-8 shadow-2xl ring-1 ring-blue-100/50">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-100">
              <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-blue-600">Johan - Tu asesor</p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-blue-500/10 blur-xl" />
        <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-blue-400/10 blur-xl" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-6 -left-6 h-48 w-48 rounded-full bg-blue-300/15 blur-3xl" />
      <div className="absolute right-1/4 top-1/4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-100/50 to-white shadow-2xl ring-1 ring-blue-100/50">
        <Image
          src={src}
          alt={alt}
          width={500}
          height={500}
          onError={() => setError(true)}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="absolute -bottom-1 left-4 flex items-center gap-2 rounded-xl bg-white/90 px-3.5 py-2 shadow-lg backdrop-blur-sm ring-1 ring-gray-100">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <span className="text-xs font-medium text-gray-700">Online ahora</span>
      </div>
    </div>
  )
}

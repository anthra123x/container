"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: { url: string; alt: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const updateIndex = useCallback(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const index = Math.round(track.scrollLeft / track.clientWidth)
    setSelectedIndex(index)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener("scroll", updateIndex, { passive: true })
    return () => track.removeEventListener("scroll", updateIndex)
  }, [updateIndex])

  const scrollTo = useCallback((i: number) => {
    trackRef.current?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
  }, [])

  const scrollPrev = useCallback(() => {
    if (selectedIndex > 0) scrollTo(selectedIndex - 1)
  }, [selectedIndex, scrollTo])

  const scrollNext = useCallback(() => {
    if (selectedIndex < images.length - 1) scrollTo(selectedIndex + 1)
  }, [selectedIndex, images.length, scrollTo])

  if (images.length === 0) return null

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 shadow-sm ring-1 ring-gray-100">
        <div ref={trackRef} className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%] snap-start">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            {selectedIndex > 0 && (
              <button
                onClick={scrollPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {selectedIndex < images.length - 1 && (
              <button
                onClick={scrollNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex
                      ? "w-6 bg-white shadow"
                      : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 transition ${
                i === selectedIndex
                  ? "ring-2 ring-blue-500"
                  : "ring-gray-200 hover:ring-blue-300"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

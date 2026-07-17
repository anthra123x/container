"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollProgress } from "@/hooks/use-scroll-progress"

interface ShowcaseProduct {
  name: string
  slug: string
  imageUrl: string | null
  imageAlt: string | null
}

interface ProductShowcaseProps {
  product: ShowcaseProduct
  categoryName: string
  categorySlug: string
  description: string
  index: number
}

function getTransform(progress: number, categorySlug: string) {
  const p = progress
  const ease = (t: number) => t * t * (3 - 2 * t)

  switch (categorySlug) {
    case "audio":
      return {
        rotateY: 360 * p,
        rotateX: 0,
        scale: 0.85 + 0.15 * Math.abs(Math.cos(p * Math.PI)),
        translateY: 0,
      }

    case "laptops":
      return {
        rotateY: -5 + 10 * ease(p),
        rotateX: -12 + 24 * ease(p),
        scale: 1,
        translateY: -10 + 20 * ease(p),
      }

    case "monitores":
      return {
        rotateY: -20 + 40 * ease(p),
        rotateX: 0,
        scale: 1,
        translateY: 0,
      }

    case "accesorios":
    case "perifericos":
      return {
        rotateY: 10 * Math.sin(p * Math.PI * 2),
        rotateX: 5 * Math.cos(p * Math.PI * 2),
        scale: 1,
        translateY: -15 * Math.sin(p * Math.PI * 2),
      }

    default:
      return {
        rotateY: 360 * p,
        rotateX: 0,
        scale: 0.85 + 0.15 * Math.abs(Math.cos(p * Math.PI)),
        translateY: 0,
      }
  }
}

export function ProductShowcase({
  product,
  categoryName,
  categorySlug,
  description,
  index,
}: ProductShowcaseProps) {
  const isReversed = index % 2 === 1
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const t = getTransform(progress, categorySlug)

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90dvh] items-center overflow-hidden"
      style={{ background: index % 2 === 0 ? "oklch(0.99 0.002 260)" : "oklch(0.96 0.004 260)" }}
    >
      <div
        className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.18 255), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className={`flex ${isReversed ? "md:order-2" : "md:order-1"} justify-center`}>
            <div
              className="group relative w-full max-w-sm"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative aspect-square w-full overflow-hidden rounded-[2rem] transition-shadow duration-700"
                style={{
                  transform: `rotateY(${t.rotateY}deg) rotateX(${t.rotateX}deg) scale(${t.scale}) translateY(${t.translateY}px)`,
                  boxShadow: "0 4px 0 oklch(1 0 0 / 0.4), 0 24px 80px oklch(0.13 0.01 260 / 0.08)",
                  border: "1px solid oklch(1 0 0 / 0.6)",
                  background: "oklch(0.99 0.002 260)",
                  willChange: "transform",
                }}
              >
                {product.imageUrl ? (
                  <>
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt ?? product.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 50%, oklch(0.99 0.002 260 / 0.4))`,
                      }}
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, oklch(1 0 0 / ${0.1 * Math.abs(Math.cos(progress * Math.PI))}), transparent 40%, transparent 60%, oklch(1 0 0 / ${0.1 * Math.abs(Math.cos(progress * Math.PI))}))`,
                        opacity: Math.abs(Math.cos(progress * Math.PI)),
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{
                        background: "linear-gradient(90deg, transparent, oklch(0.55 0.18 255 / 0.3), transparent)",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="flex h-full items-center justify-center"
                    style={{ background: "oklch(0.96 0.004 260)" }}
                  >
                    <svg viewBox="0 0 48 48" fill="none" className="h-20 w-20" style={{ color: "oklch(0.92 0.004 260)" }}>
                      <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 22h32" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="16" y="26" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                )}
              </div>

              <div
                className="absolute -bottom-4 left-10 right-10 h-8 rounded-full blur-2xl transition-all duration-700"
                style={{
                  background: "oklch(0.13 0.01 260 / 0.08)",
                  transform: `scaleX(${0.5 + 0.5 * Math.abs(Math.cos(progress * Math.PI))})`,
                  willChange: "transform",
                }}
              />
            </div>
          </div>

          <div className={`flex flex-col ${isReversed ? "md:order-1" : "md:order-2"}`}>
            <span
              className="inline-flex w-fit rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "oklch(0.55 0.18 255)",
                background: "oklch(0.55 0.18 255 / 0.08)",
              }}
            >
              {categoryName}
            </span>

            <h2
              className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-balance"
              style={{ color: "oklch(0.13 0.01 260)", lineHeight: 1.1 }}
            >
              {product.name}
            </h2>

            <p
              className="mt-4 max-w-md text-base leading-relaxed md:text-lg"
              style={{ color: "oklch(0.45 0.01 260)" }}
            >
              {description}
            </p>

            <div className="mt-8">
              <Link
                href={`/productos?categoria=${categorySlug}`}
                className="btn-primary gap-2 px-6 py-2.5"
              >
                <ArrowRight className="h-4 w-4" />
                Ver {categoryName.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { prisma, withRetry } from "@/lib/db"
import { Shield, Truck, MessageCircle, Star } from "lucide-react"
import { HeroImage } from "@/components/store/HeroImage"
import { ProductCard } from "@/components/store/ProductCard"
import { GlassPanel } from "@/components/ui/glass-panel"

export const dynamic = "force-dynamic"

async function getProducts() {
  return withRetry(() =>
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    })
  )
}

async function getConfig() {
  return withRetry(() =>
    prisma.storeConfiguration.findFirst({
      select: { whatsappNumber: true, whatsappMessage: true },
    })
  )
}

const benefits = [
  { icon: Truck, title: "Envío Rápido", desc: "Entrega en 24-48 horas en El Banco" },
  { icon: Shield, title: "Garantía", desc: "Todos los productos con garantía" },
  { icon: MessageCircle, title: "WhatsApp", desc: "Compra fácil y rápida por WhatsApp" },
  { icon: Star, title: "Confianza", desc: "Atención personalizada de principio a fin" },
]

export default async function StoreHome() {
  const [products, config] = await Promise.all([
    getProducts(),
    getConfig(),
  ])

  const whatsappNumber = config?.whatsappNumber?.replace(/[^\d]/g, "") ?? "573000000000"
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://container-store-seven.vercel.app"
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Container",
    description: "Productos originales con garantía y atención personalizada",
    url: baseUrl,
    image: `${baseUrl}/og-image.jpg`,
    address: { "@type": "PostalAddress", addressCountry: "CO" },
    priceRange: "$$",
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <section
        className="relative min-h-[100dvh] flex items-center overflow-hidden"
        style={{ background: "oklch(0.99 0.002 260)" }}
      >
        <div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.18 255), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.18 255), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="animate-slide-up">
              <div
                className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium md:px-5 md:py-2 md:text-sm"
                style={{ color: "oklch(0.55 0.18 255)" }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: "oklch(0.55 0.18 255)" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: "oklch(0.55 0.18 255)" }}
                  />
                </span>
                Tienda colombiana de confianza
              </div>

              <h1
                className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
                style={{ color: "oklch(0.13 0.01 260)", lineHeight: 1.05 }}
              >
                Tecnología para tu
                <span className="block" style={{ color: "oklch(0.55 0.18 255)" }}>
                  día a día
                </span>
              </h1>

              <p
                className="mt-3 max-w-lg text-base leading-relaxed md:text-lg"
                style={{ color: "oklch(0.45 0.01 260)" }}
              >
                En Container encuentras tecnología original con la mejor atención.
                Te ayudamos a elegir el producto perfecto para ti.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/productos"
                  className="btn-primary gap-2 px-8 py-3 text-base"
                >
                  Ver productos
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost gap-2 px-8 py-3 text-base"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escríbenos
                </a>
              </div>

              <div className="mt-6 flex items-center gap-6 text-sm" style={{ color: "oklch(0.56 0.01 260)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: "oklch(0.99 0.002 260)", background: "oklch(0.55 0.18 255)" }} />
                    <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: "oklch(0.99 0.002 260)", background: "oklch(0.65 0.15 50)" }} />
                    <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: "oklch(0.99 0.002 260)", background: "oklch(0.5 0.12 160)" }} />
                  </div>
                  <span>+500 clientes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" style={{ color: "oklch(0.65 0.15 50)", fill: "oklch(0.65 0.15 50)" }} />
                  <span>4.9/5</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <HeroImage priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-8 relative z-10 pb-14">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {benefits.map((benefit, i) => (
            <GlassPanel
              key={benefit.title}
              className="flex items-center gap-3 p-3 md:p-4"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="shrink-0 rounded-lg p-2"
                style={{ background: "oklch(0.55 0.18 255 / 0.1)" }}
              >
                <benefit.icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: "oklch(0.55 0.18 255)" }} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold md:text-sm" style={{ color: "oklch(0.13 0.01 260)" }}>{benefit.title}</h3>
                <p className="hidden text-xs md:mt-0.5 md:block" style={{ color: "oklch(0.56 0.01 260)" }}>{benefit.desc}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="pb-20" style={{ background: "oklch(0.96 0.004 260)" }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-14">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <ProductCard
                    slug={product.slug}
                    name={product.name}
                    price={Number(product.price)}
                    imageUrl={product.images[0]?.url ?? null}
                    imageAlt={product.images[0]?.alt ?? null}
                    categoryName={product.category?.name}
                    stock={product.stock}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden py-20 md:py-24">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.55 0.18 255 / 0.04), oklch(0.55 0.18 255 / 0.01))",
          }}
        />
        <div
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.18 255), transparent 70%)",
          }}
        />
        <div
          className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.18 255), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <GlassPanel variant="strong" className="mx-auto max-w-lg px-8 py-10 md:px-12 md:py-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "oklch(0.13 0.01 260)" }}>
              ¿Listo para comprar?
            </h2>
            <p className="mt-3 text-base leading-relaxed md:text-lg" style={{ color: "oklch(0.45 0.01 260)" }}>
              Explora nuestro catálogo y encuentra el producto perfecto para ti.
              Atención personalizada en cada compra.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                boxShadow: "0 4px 16px rgba(37, 211, 102, 0.3)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Comprar por WhatsApp
            </a>
          </GlassPanel>
        </div>
      </section>
    </>
  )
}

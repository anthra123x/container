import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { Clock, Truck, Shield, ChevronRight, MessageCircle } from "lucide-react"
import { ProductGallery } from "@/components/store/ProductGallery"
import { ReviewSection } from "@/components/store/ReviewSection"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    select: {
      name: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
  })

  if (!product) {
    return { title: "Producto no encontrado | Container" }
  }

  return {
    title: product.metaTitle ?? `${product.name} | Container`,
    description: product.metaDescription ?? product.description?.slice(0, 160) ?? `${product.name} en Container`,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.description?.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      galleries: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!product) notFound()

  const isOutOfStock = product.stock <= 0
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://container-store-seven.vercel.app"
  const productUrl = `${baseUrl}/productos/${product.slug}`

  const config = await prisma.storeConfiguration.findFirst({
    select: { whatsappNumber: true, whatsappMessage: true },
  })
  const whatsappNumber = config?.whatsappNumber?.replace(/[^\d]/g, "") ?? "573000000000"
  const defaultMsg = config?.whatsappMessage ?? "Hola, me interesa este producto"
  const whatsappMsg = encodeURIComponent(
    `${defaultMsg}\n\n*${product.name}*${product.sku ? ` (${product.sku})` : ""}\n${formatCurrency(Number(product.price))}\n${productUrl}`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    image: product.images[0]?.url ?? undefined,
    sku: product.sku ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: Number(product.price),
      priceCurrency: "COP",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 pt-24">
        <nav className="mb-8 flex items-center gap-1 text-sm" style={{ color: "oklch(0.56 0.01 260)" }}>
          <Link href="/" className="hover-accent transition-colors" style={{ color: "oklch(0.56 0.01 260)" }}>Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/productos?categoria=${product.category.slug}`} className="hover-accent transition-colors" style={{ color: "oklch(0.56 0.01 260)" }}>
            {product.category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span style={{ color: "oklch(0.13 0.01 260)" }}>{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative">
            <ProductGallery
              images={
                product.images.length > 0
                  ? product.images.map((img) => ({
                      url: img.url,
                      alt: img.alt ?? product.name,
                    }))
                  : [{ url: "", alt: product.name }]
              }
            />
            {isOutOfStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "oklch(0.13 0.01 260 / 0.3)" }}>
                <span className="rounded-xl px-6 py-3 text-base font-semibold shadow-xl" style={{ background: "oklch(0.99 0.002 260 / 0.95)", color: "oklch(0.13 0.01 260)" }}>
                  Agotado
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.55 0.18 255)" }}>
                  {product.category.name}
                </span>
                {product.brand && (
                  <>
                    <span style={{ color: "oklch(0.92 0.004 260)" }}>|</span>
                    <span className="text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>{product.brand.name}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "oklch(0.13 0.01 260)" }}>
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-4 leading-relaxed" style={{ color: "oklch(0.45 0.01 260)" }}>{product.shortDescription}</p>
              )}
            </div>

            <div className="glass-panel-strong rounded-2xl p-6">
              <p className="text-3xl font-bold" style={{ color: "oklch(0.55 0.18 255)" }}>
                {formatCurrency(Number(product.price))}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm md:gap-6" style={{ color: "oklch(0.56 0.01 260)" }}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>24-48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Garantía</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Envío gratis</span>
                </div>
              </div>
            </div>

            {product.variants.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium" style={{ color: "oklch(0.13 0.01 260)" }}>Opciones disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <span
                      key={v.id}
                      className="rounded-lg px-3 py-1.5 text-sm"
                      style={{
                        border: "1px solid oklch(0.92 0.004 260)",
                        color: "oklch(0.45 0.01 260)",
                        background: "oklch(1 0 0 / 0.5)",
                      }}
                    >
                      {v.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="!mt-8">
              <div className="glass-panel rounded-2xl overflow-hidden">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <MessageCircle className="h-5 w-5" />
                  Comprar por WhatsApp
                </a>
              </div>
            </div>

            {product.description && (
              <div className="!mt-10 border-t pt-6" style={{ borderColor: "oklch(0.92 0.004 260)" }}>
                <h2 className="mb-3 text-base font-semibold" style={{ color: "oklch(0.13 0.01 260)" }}>Descripción</h2>
                <div className="prose prose-sm max-w-none leading-relaxed" style={{ color: "oklch(0.45 0.01 260)" }}>
                  {product.description}
                </div>
              </div>
            )}

            {product.galleries.length > 0 && (
              <div className="!mt-10 border-t pt-6" style={{ borderColor: "oklch(0.92 0.004 260)" }}>
                <h2 className="mb-4 text-base font-semibold" style={{ color: "oklch(0.13 0.01 260)" }}>Galerías</h2>
                {product.galleries.map((gallery) => (
                  <div key={gallery.id} className="mb-6">
                    <h3 className="mb-2 text-sm font-medium" style={{ color: "oklch(0.45 0.01 260)" }}>{gallery.name}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {gallery.images.map((img) => (
                        <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl" style={{ background: "oklch(0.96 0.004 260)", boxShadow: "inset 0 0 0 1px oklch(0.92 0.004 260)" }}>
                          <Image
                            src={img.url}
                            alt={img.alt ?? product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 33vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ReviewSection productId={product.id} productSlug={product.slug} />
      </div>
    </>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { Clock, Truck, Shield, ChevronRight } from "lucide-react"
import { ProductGallery } from "@/components/store/ProductGallery"
import { ProductActions } from "@/components/store/ProductActions"
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
      promotions: {
        include: { promotion: true },
        where: { promotion: { isActive: true, endsAt: { gte: new Date() } } },
      },
    },
  })

  if (!product) notFound()

  const hasDiscount = !!product.comparePrice && Number(product.comparePrice) > Number(product.price)
  const discountPercentage = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0
  const isOutOfStock = product.stock <= 0
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://container-store-seven.vercel.app"
  const productUrl = `${baseUrl}/productos/${product.slug}`

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
      ...(product.comparePrice && Number(product.comparePrice) > Number(product.price)
        ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] }
        : {}),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-blue-600">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/productos?categoria=${product.category.slug}`} className="transition-colors hover:text-blue-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
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
          {hasDiscount && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
              -{discountPercentage}%
            </div>
          )}
          {isOutOfStock && (
            <div className="overlay-outofstock">
              <span className="rounded-xl bg-white/95 px-6 py-3 text-base font-semibold text-gray-900 shadow-xl">
                Agotado
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              {product.category.name}
            </span>
            {product.brand && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">{product.brand.name}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-4 leading-relaxed text-gray-600">{product.shortDescription}</p>
          )}

          <ProductActions
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={Number(product.price)}
            baseStock={product.stock}
            variants={product.variants.map((v) => ({
              id: v.id,
              name: v.value,
              type: v.type,
              value: v.value,
              price: v.price?.toString() ?? null,
              stock: v.stock ?? null,
              image: v.image,
            }))}
            hasDiscount={hasDiscount}
            comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
            discountPercentage={discountPercentage}
          />

          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500 md:gap-6">
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

          {product.description && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Descripción</h2>
              <div className="prose prose-sm max-w-none leading-relaxed text-gray-600">
                {product.description}
              </div>
            </div>
          )}

          {product.galleries.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="mb-4 text-base font-semibold text-gray-900">Galerías</h2>
              {product.galleries.map((gallery) => (
                <div key={gallery.id} className="mb-6">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">{gallery.name}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {gallery.images.map((img) => (
                      <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200">
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

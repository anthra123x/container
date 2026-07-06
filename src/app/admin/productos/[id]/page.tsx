import Image from "next/image"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { requireAdminRole } from "@/lib/auth-helpers"
import { Package, ArrowUp, ArrowDown, Star, Trash2 } from "lucide-react"
import { uploadProductImages, deleteProductImage, setPrimaryImage, reorderImages } from "@/lib/actions/product-images"
import { ImagePreview } from "@/components/admin/ImagePreview"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!product) notFound()

  const currentCategoryId = product.categoryId

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Volver
        </Link>
        <h1 className="text-3xl font-bold">Editar: {product.name}</h1>
      </div>

      <form action={async (formData: FormData) => {
        "use server"
        await requireAdminRole(2)

        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const price = parseFloat(formData.get("price") as string)
        const stock = parseInt(formData.get("stock") as string) || 0
        const categoryId = formData.get("categoryId") as string
        const brandId = formData.get("brandId") as string
        const sku = formData.get("sku") as string
        const isActive = formData.get("isActive") === "on"
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

        await prisma.product.update({
          where: { id },
          data: {
            name,
            slug,
            description,
            price,
            stock,
            sku: sku || null,
            categoryId: categoryId || currentCategoryId,
            brandId: brandId || null,
            isActive,
          },
        })

        await uploadProductImages(id, formData)

        redirect("/admin/productos")
      }} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del producto</label>
              <input name="name" defaultValue={product.name} required className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input name="sku" defaultValue={product.sku ?? ""} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio ($)</label>
                <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} required className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input name="stock" type="number" defaultValue={product.stock} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select name="categoryId" defaultValue={product.categoryId ?? ""} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marca</label>
                <select name="brandId" defaultValue={product.brandId ?? ""} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sin marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input name="isActive" type="checkbox" defaultChecked={product.isActive} className="rounded" />
              Producto activo
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="description" defaultValue={product.description ?? ""} rows={8} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Imágenes actuales</h2>
          {product.images.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-4">
              {product.images.map((img, i) => (
                <div key={img.id} className="w-36">
                  <div className="relative mb-1.5 aspect-square overflow-hidden rounded-lg border bg-gray-50">
                    <Image
                      src={img.url}
                      alt={img.alt ?? ""}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                    {img.isPrimary && (
                      <div className="absolute bottom-1 left-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow">
                        Principal
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <form action={reorderImages} className="inline">
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="imageId" value={img.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={i === 0}
                        className="rounded p-0.5 text-gray-400 transition-colors hover:text-blue-600 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    <form action={reorderImages} className="inline">
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="imageId" value={img.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={i === product.images.length - 1}
                        className="rounded p-0.5 text-gray-400 transition-colors hover:text-blue-600 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    {!img.isPrimary && (
                      <form action={setPrimaryImage} className="inline">
                        <input type="hidden" name="imageId" value={img.id} />
                        <button
                          type="submit"
                          className="rounded p-0.5 text-gray-400 transition-colors hover:text-yellow-500"
                          title="Marcar como principal"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    )}
                    <form action={deleteProductImage} className="inline">
                      <input type="hidden" name="imageId" value={img.id} />
                      <button
                        type="submit"
                        onClick={(e) => { if (!confirm("¿Eliminar esta imagen?")) e.preventDefault() }}
                        className="rounded p-0.5 text-gray-400 transition-colors hover:text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
              <Package className="h-5 w-5" />
              <span>Este producto no tiene imágenes.</span>
            </div>
          )}

          <h3 className="mb-3 text-sm font-medium text-gray-700">Agregar nuevas imágenes</h3>
          <ImagePreview />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Guardar cambios
          </button>
          <Link href="/admin/productos" className="rounded-lg border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Package } from "lucide-react"
import { uploadProductImages } from "@/lib/actions/product-images"

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
        const currentSession = await auth()
        if (!currentSession?.user) redirect("/login")

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
          <h2 className="mb-4 text-lg font-semibold">Imágenes</h2>
          {product.images.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-3">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="group relative h-24 w-24 overflow-hidden rounded-lg border bg-gray-50"
                >
                  <img
                    src={img.url}
                    alt={img.alt ?? ""}
                    className="h-full w-full object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-1 left-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
              <Package className="h-5 w-5" />
              <span>Este producto no tiene imágenes. Agrega una a continuación.</span>
            </div>
          )}
          <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-2 text-xs text-gray-400">JPEG, PNG o WebP. Máximo 5MB por imagen.</p>
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

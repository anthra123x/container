import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { uploadProductImages } from "@/lib/actions/product-images"
import { ImagePreview } from "@/components/admin/ImagePreview"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
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
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
      </div>

      <form action={async (formData: FormData) => {
        "use server"
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const price = parseFloat(formData.get("price") as string)
        const stock = parseInt(formData.get("stock") as string) || 0
        const categoryId = formData.get("categoryId") as string
        const brandId = formData.get("brandId") as string
        const sku = formData.get("sku") as string
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

        if (!categoryId) redirect("/admin/productos/nuevo")

        const product = await prisma.product.create({
          data: {
            name,
            slug,
            description,
            price,
            stock,
            sku: sku || null,
            categoryId,
            brandId: brandId || null,
            isActive: true,
          },
        })

        await uploadProductImages(product.id, formData)

        redirect("/admin/productos")
      }} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del producto</label>
              <input name="name" required className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input name="sku" className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio ($)</label>
                <input name="price" type="number" step="0.01" required className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input name="stock" type="number" defaultValue={0} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select name="categoryId" required className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marca</label>
                <select name="brandId" className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sin marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="description" rows={8} className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Imágenes</h2>
          <ImagePreview />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Crear producto
          </button>
          <Link href="/admin/productos" className="rounded-lg border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { supabase, STORAGE_BUCKET } from "@/lib/supabase"
import { randomUUID } from "crypto"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function uploadProductImages(
  productId: string,
  formData: FormData
): Promise<void> {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const files = formData.getAll("images") as File[]

  if (files.length === 0) return

  const existingCount = await prisma.productImage.count({
    where: { productId },
  })

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Tipo de archivo no válido: ${file.type}`)
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`El archivo ${file.name} excede el tamaño máximo de 5MB`)
    }

    const ext = file.name.split(".").pop() ?? "jpg"
    const fileName = `${randomUUID()}.${ext}`
    const filePath = `${productId}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Error al subir imagen: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    await prisma.productImage.create({
      data: {
        productId,
        url: urlData.publicUrl,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        sortOrder: existingCount + i,
        isPrimary: existingCount === 0 && i === 0,
      },
    })
  }
}

function extractStoragePath(url: string): string | null {
  try {
    const u = new URL(url)
    const match = u.pathname.match(/\/object\/public\/product-images\/(.+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export async function deleteProductImage(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const imageId = formData.get("imageId") as string
  if (!imageId) return

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  })

  if (!image) return

  const storagePath = extractStoragePath(image.url)
  if (storagePath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
  }

  await prisma.productImage.delete({ where: { id: imageId } })

  const remaining = await prisma.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { sortOrder: "asc" },
  })

  if (image.isPrimary && remaining.length > 0) {
    await prisma.productImage.update({
      where: { id: remaining[0].id },
      data: { isPrimary: true },
    })
  }

  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i].sortOrder !== i) {
      await prisma.productImage.update({
        where: { id: remaining[i].id },
        data: { sortOrder: i },
      })
    }
  }
}

export async function setPrimaryImage(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const imageId = formData.get("imageId") as string
  if (!imageId) return

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  })

  if (!image) return

  await prisma.productImage.updateMany({
    where: { productId: image.productId, isPrimary: true },
    data: { isPrimary: false },
  })

  await prisma.productImage.update({
    where: { id: imageId },
    data: { isPrimary: true },
  })
}

export async function reorderImages(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const productId = formData.get("productId") as string
  const imageId = formData.get("imageId") as string
  const direction = formData.get("direction") as string

  if (!productId || !imageId || !direction) return

  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  })

  const idx = images.findIndex((img) => img.id === imageId)
  if (idx === -1) return

  const swapIdx = direction === "up" ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= images.length) return

  await prisma.productImage.update({
    where: { id: images[idx].id },
    data: { sortOrder: images[swapIdx].sortOrder },
  })

  await prisma.productImage.update({
    where: { id: images[swapIdx].id },
    data: { sortOrder: images[idx].sortOrder },
  })
}

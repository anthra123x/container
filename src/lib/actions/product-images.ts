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

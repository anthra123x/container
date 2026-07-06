"use client"

import { useState } from "react"
import { createReview } from "@/lib/actions/review"
import { RatingInput } from "./StarRating"
import { useRouter } from "next/navigation"
import { Star, MessageSquare } from "lucide-react"

interface ReviewFormProps {
  productId: string
  productName: string
  orderId: string
  customerName: string
  phone: string
  productSlug: string
}

export function ReviewForm({
  productId,
  productName,
  orderId,
  customerName,
  phone,
  productSlug,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    const formData = new FormData()
    formData.set("productId", productId)
    formData.set("orderId", orderId)
    formData.set("customerName", customerName)
    formData.set("phone", phone)
    formData.set("rating", String(rating))
    formData.set("title", title)
    formData.set("content", content)
    formData.set("productSlug", productSlug)

    await createReview(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-4 ring-1 ring-foreground/5">
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-amber-400" />
        <h4 className="text-sm font-semibold text-gray-900">Calificar: {productName}</h4>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-gray-700">
          Calificación *
        </label>
        <RatingInput value={rating} onChange={setRating} />
      </div>

      <div className="mb-3">
        <label htmlFor={`title-${productId}`} className="mb-1 block text-xs font-medium text-gray-700">
          Título (opcional)
        </label>
        <input
          id={`title-${productId}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
          placeholder="Resume tu experiencia"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`content-${productId}`} className="mb-1 block text-xs font-medium text-gray-700">
          Tu opinión *
        </label>
        <textarea
          id={`content-${productId}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={3}
          className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
          placeholder="¿Qué te pareció el producto?"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {content.length}/2000
        </p>
      </div>

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MessageSquare className="h-4 w-4" />
        {submitting ? "Enviando..." : "Enviar opinión"}
      </button>

      <p className="mt-2 text-xs text-muted-foreground">
        Tu opinión será visible después de ser aprobada por un administrador.
      </p>
    </form>
  )
}

import { prisma } from "@/lib/db"
import { StarRating } from "./StarRating"
import { formatDateTime } from "@/lib/utils/formatters"
import { MessageSquare } from "lucide-react"

interface ReviewSectionProps {
  productId: string
  productSlug: string
}

export async function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
      },
      take: 50,
    }),
    prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    }),
  ])

  const averageRating = aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : null
  const totalReviews = aggregate._count

  return (
    <div className="mt-12 border-t pt-8" style={{ borderColor: "oklch(0.92 0.004 260)" }}>
      <h2 className="mb-6 text-lg font-semibold" style={{ color: "oklch(0.13 0.01 260)" }}>
        Opiniones de clientes
      </h2>

      {totalReviews > 0 && (
        <div
          className="mb-6 flex items-center gap-4 rounded-2xl p-5"
          style={{
            background: "oklch(0.96 0.004 260)",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.4)",
          }}
        >
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: "oklch(0.13 0.01 260)" }}>{averageRating ?? "—"}</p>
            <StarRating rating={Math.round(averageRating ?? 0)} size="sm" />
            <p className="mt-1 text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>
              {totalReviews} opinión{totalReviews !== 1 ? "es" : ""}
            </p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>
                  <span className="w-8 text-right">{star}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "oklch(0.92 0.004 260)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: "oklch(0.65 0.15 50)" }}
                    />
                  </div>
                  <span className="w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            border: "1px dashed oklch(0.92 0.004 260)",
            background: "oklch(0.96 0.004 260 / 0.5)",
          }}
        >
          <MessageSquare className="mx-auto h-10 w-10" style={{ color: "oklch(0.92 0.004 260)" }} />
          <p className="mt-3 text-sm" style={{ color: "oklch(0.56 0.01 260)" }}>
            Este producto aún no tiene opiniones.
          </p>
          <p className="text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>
            Sé el primero en calificarlo después de recibirlo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.99 0.002 260)",
                boxShadow: "0 1px 0 oklch(1 0 0 / 0.4), 0 4px 24px oklch(0.13 0.01 260 / 0.05)",
                border: "1px solid oklch(1 0 0 / 0.6)",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: "oklch(0.55 0.18 255 / 0.1)",
                      color: "oklch(0.55 0.18 255)",
                    }}
                  >
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "oklch(0.13 0.01 260)" }}>{review.customerName}</p>
                    <p className="text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>
                      {formatDateTime(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {review.title && (
                <h4 className="mb-1 text-sm font-semibold" style={{ color: "oklch(0.13 0.01 260)" }}>{review.title}</h4>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.01 260)" }}>{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

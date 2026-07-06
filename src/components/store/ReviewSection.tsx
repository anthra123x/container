import { prisma } from "@/lib/db"
import { StarRating } from "./StarRating"
import { formatDateTime } from "@/lib/utils/formatters"
import { MessageSquare } from "lucide-react"

interface ReviewSectionProps {
  productId: string
  productSlug: string
}

export async function ReviewSection({ productId, productSlug }: ReviewSectionProps) {
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
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="mb-6 text-base font-semibold text-gray-900">
        Opiniones de clientes
      </h2>

      {totalReviews > 0 && (
        <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{averageRating ?? "—"}</p>
            <StarRating rating={Math.round(averageRating ?? 0)} size="sm" />
            <p className="mt-1 text-xs text-muted-foreground">
              {totalReviews} opinión{totalReviews !== 1 ? "es" : ""}
            </p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-right text-muted-foreground">{star}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center ring-1 ring-foreground/5">
          <MessageSquare className="mx-auto h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm text-muted-foreground">
            Este producto aún no tiene opiniones.
          </p>
          <p className="text-xs text-muted-foreground">
            Sé el primero en calificarlo después de recibirlo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border bg-white p-4 ring-1 ring-foreground/5"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {review.title && (
                <h4 className="mb-1 text-sm font-semibold text-gray-900">{review.title}</h4>
              )}
              <p className="text-sm leading-relaxed text-gray-600">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StarRating } from "@/components/store/StarRating"
import { formatDateTime } from "@/lib/utils/formatters"
import { CheckCircle, Trash2, MessageSquare } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminReviewsPage() {
  const session = await auth()
  if (!session?.user) return null

  const reviews = await prisma.review.findMany({
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    include: {
      product: { select: { id: true, name: true, slug: true } },
      order: { select: { id: true } },
    },
    take: 100,
  })

  const pendingReviews = reviews.filter((r) => !r.isApproved)
  const approvedReviews = reviews.filter((r) => r.isApproved)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reseñas</h1>
      </div>

      {pendingReviews.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-amber-700">
            Pendientes ({pendingReviews.length})
          </h2>
          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Aprobadas ({approvedReviews.length})
        </h2>
        {approvedReviews.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center ring-1 ring-foreground/5">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-200" />
            <p className="mt-3 text-sm text-muted-foreground">No hay reseñas aprobadas aún.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewCard({
  review,
}: {
  review: {
    id: string
    customerName: string
    phone: string
    rating: number
    title: string | null
    content: string
    isApproved: boolean
    createdAt: Date
    product: { id: string; name: string; slug: string }
    order: { id: string }
  }
}) {
  return (
    <div className="rounded-lg border bg-white p-4 ring-1 ring-foreground/5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-3">
            <StarRating rating={review.rating} size="sm" />
            <Link
              href={`/admin/productos/${review.product.id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {review.product.name}
            </Link>
          </div>
          {review.title && (
            <h4 className="text-sm font-semibold text-gray-900">{review.title}</h4>
          )}
          <p className="mt-1 text-sm text-gray-600">{review.content}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{review.customerName}</span>
            <span>{review.phone}</span>
            <span>{formatDateTime(review.createdAt)}</span>
            <Link
              href={`/admin/ventas/${review.order.id}`}
              className="text-blue-600 hover:underline"
            >
              Pedido #{review.order.id.slice(0, 8)}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!review.isApproved && (
            <form>
              <input type="hidden" name="reviewId" value={review.id} />
              <button
                formAction={async (formData: FormData) => {
                  "use server"
                  const { adminApproveReview } = await import("@/lib/actions/review")
                  await adminApproveReview(formData)
                }}
                className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Aprobar
              </button>
            </form>
          )}
          <form>
            <input type="hidden" name="reviewId" value={review.id} />
            <button
              formAction={async (formData: FormData) => {
                "use server"
                const { adminDeleteReview } = await import("@/lib/actions/review")
                await adminDeleteReview(formData)
              }}
              className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

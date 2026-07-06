interface StarRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
}

export function StarRating({ rating, size = "md", interactive, onChange }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  if (interactive) {
    return (
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`${sizeClasses[size]} transition-colors ${
              star <= rating ? "text-amber-400" : "text-gray-200"
            } hover:text-amber-300`}
            aria-label={`${star} estrella${star !== 1 ? "s" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {stars.map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`${sizeClasses[size]} ${
            star <= rating ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function RatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (rating: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={value} size="lg" interactive onChange={onChange} />
      <span className="text-sm text-muted-foreground">
        {value === 0 ? "Selecciona" : `${value} de 5`}
      </span>
    </div>
  )
}

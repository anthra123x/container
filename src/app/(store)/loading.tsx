import { Package } from "lucide-react"

export default function StoreLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Package className="h-6 w-6 animate-bounce text-blue-500" />
        </div>
        <div className="h-2 w-32 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  )
}

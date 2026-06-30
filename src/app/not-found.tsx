import Link from "next/link"
import { Package, Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <Package className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg font-medium text-gray-700">Página no encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary gap-2">
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
          <Link href="/productos" className="btn-primary gap-2 bg-gray-600 from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
            <Search className="h-4 w-4" />
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function CartEmptyState() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center animate-in fade-in duration-500">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
        <ShoppingBag className="h-10 w-10 text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold">Carrito de compras</h1>
      <p className="mt-4 text-muted-foreground">Tu carrito está vacío.</p>
      <Link href="/productos" className="btn-primary mt-6">
        Ver productos
      </Link>
    </div>
  )
}

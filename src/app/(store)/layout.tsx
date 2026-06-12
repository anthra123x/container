"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, Menu, Package, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/promociones", label: "Promociones" },
  { href: "/contacto", label: "Contacto" },
]

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreNavbar />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  )
}

function StoreNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Package className="h-6 w-6" />
          <span className="font-sans tracking-tight">Container</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/buscar"
            className="rounded-full p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/carrito"
            className="rounded-full p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t md:hidden">
          <nav className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function StoreFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-blue-600">
              <Package className="h-5 w-5" />
              Container
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Tu tienda de tecnología de confianza. Productos originales con garantía.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Tienda</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/productos" className="hover:text-blue-600">Productos</Link></li>
              <li><Link href="/promociones" className="hover:text-blue-600">Promociones</Link></li>
              <li><Link href="/categorias" className="hover:text-blue-600">Categorías</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Ayuda</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/contacto" className="hover:text-blue-600">Contacto</Link></li>
              <li><Link href="/envio" className="hover:text-blue-600">Envíos</Link></li>
              <li><Link href="/devoluciones" className="hover:text-blue-600">Devoluciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>ventas@container.pe</li>
              <li>+51 999 888 777</li>
              <li>Lun - Sáb: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Container. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

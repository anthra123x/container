"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, Menu, Package, X, Phone, Mail, User, LogIn } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/hooks/use-cart"

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/promociones", label: "Promociones" },
  { href: "/mis-pedidos", label: "Mis pedidos" },
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
  const { totalItems } = useCart()
  const { status } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm md:border-gray-200/50 md:bg-white/80 md:backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-blue-600">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="font-sans">Container</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/buscar"
            className="rounded-full p-2.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/carrito"
            className="relative rounded-full p-2.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          {status === "authenticated" ? (
            <Link
              href="/admin"
              className="hidden rounded-full p-2.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 md:inline-flex"
            >
              <User className="h-5 w-5" />
            </Link>
          ) : status === "unauthenticated" ? (
            <Link
              href="/login"
              className="hidden rounded-full p-2.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 md:inline-flex"
            >
              <LogIn className="h-5 w-5" />
            </Link>
          ) : null}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white shadow-2xl md:hidden">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2 font-bold text-blue-600">
                <Package className="h-5 w-5" />
                <span>Container</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {status === "authenticated" ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <User className="h-4 w-4" />
                  Panel Admin
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              )}
            </nav>
            <div className="border-t px-5 py-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>+57 300 000 0000</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>ventas@container.co</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

function StoreFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-blue-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
                <Package className="h-4 w-4 text-white" />
              </div>
              Container
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Tu tienda de tecnología de confianza. Productos originales con garantía y atención personalizada.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-gray-900">Tienda</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/productos" className="transition-colors hover:text-blue-600">Productos</Link></li>
              <li><Link href="/promociones" className="transition-colors hover:text-blue-600">Promociones</Link></li>
              <li><Link href="/categorias" className="transition-colors hover:text-blue-600">Categorías</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-gray-900">Ayuda</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/mis-pedidos" className="transition-colors hover:text-blue-600">Mis pedidos</Link></li>
              <li><Link href="/contacto" className="transition-colors hover:text-blue-600">Contacto</Link></li>
              <li><Link href="/envio" className="transition-colors hover:text-blue-600">Envíos</Link></li>
              <li><Link href="/devoluciones" className="transition-colors hover:text-blue-600">Devoluciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-gray-900">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                ventas@container.co
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                +57 300 000 0000
              </li>
              <li className="text-xs">Lun - Sáb: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200/50 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Container. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

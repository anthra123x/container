"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, Phone, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

interface StoreConfig {
  whatsappNumber: string
  storeName: string
  email: string
  phone: string
}

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/contacto", label: "Contacto" },
]

export default function StoreLayoutClient({ children, config }: { children: React.ReactNode; config: StoreConfig }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "oklch(0.99 0.002 260)" }}>
      <StoreNavbar config={config} />
      <main className="flex-1">{children}</main>
      <StoreFooter config={config} />
      <WhatsAppButton number={config.whatsappNumber} variant="floating" />
    </div>
  )
}

const logoSymbol = (
  <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
    <rect x="4" y="8" width="24" height="18" rx="3" fill="oklch(0.55 0.18 255)" />
    <rect x="4.5" y="8.5" width="23" height="17" rx="2.5" stroke="white" strokeOpacity="0.2" />
    <path d="M4 14h24" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
    <rect x="7" y="10" width="7" height="2" rx="0.5" fill="white" fillOpacity="0.6" />
    <rect x="7" y="18" width="12" height="1.5" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="7" y="21" width="8" height="1.5" rx="0.5" fill="white" fillOpacity="0.3" />
    <path d="M7 8l2-3h14l2 3" stroke="oklch(0.55 0.18 255)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="oklch(0.6 0.18 255)" />
    <path d="M7.5 8.5l1.5-2.5h14l1.5 2.5" stroke="white" strokeOpacity="0.15" />
  </svg>
)

function StoreNavbar({ config }: { config: StoreConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.99 0.002 260 / 0.75)"
          : "oklch(0.99 0.002 260 / 0.95)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        borderBottom: scrolled
          ? "1px solid oklch(1 0 0 / 0.6)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 1px 0 oklch(1 0 0 / 0.4), 0 4px 24px oklch(0.13 0.01 260 / 0.05)"
          : "none",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight" style={{ color: "oklch(0.13 0.01 260)" }}>
          {logoSymbol}
          <span>Container</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "nav-link-active" : "nav-link"}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="/buscar"
            className="hover-accent rounded-full p-2.5 transition-colors"
            style={{ color: "oklch(0.45 0.01 260)" }}
          >
            <Search className="h-5 w-5" />
          </a>
          <button
            onClick={() => setMobileOpen(true)}
            className="hover-accent rounded-full p-2.5 transition-colors md:hidden"
            style={{ color: "oklch(0.45 0.01 260)" }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "oklch(0.13 0.01 260 / 0.5)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col md:hidden"
            style={{
              background: "oklch(0.99 0.002 260 / 0.9)",
              backdropFilter: "blur(24px)",
              boxShadow: "-8px 0 32px oklch(0.13 0.01 260 / 0.08)",
            }}
          >
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "oklch(0.92 0.004 260)" }}>
              <div className="flex items-center gap-2 font-bold" style={{ color: "oklch(0.13 0.01 260)" }}>
                {logoSymbol}
                <span>Container</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="hover-accent rounded-full p-1.5 transition-colors"
                style={{ color: "oklch(0.45 0.01 260)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navLinks.map((link) => {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === link.href ? "" : "hover-glass-bg"
                    }`}
                    style={{
                      color: pathname === link.href ? "oklch(0.55 0.18 255)" : "oklch(0.45 0.01 260)",
                      background: pathname === link.href ? "oklch(0.55 0.18 255 / 0.08)" : "transparent",
                    }}
                  >
                    {link.label}
                  </a>
                )
              })}
            </nav>
            <div className="border-t px-5 py-4" style={{ borderColor: "oklch(0.92 0.004 260)" }}>
              <div className="flex items-center gap-3 text-sm" style={{ color: "oklch(0.45 0.01 260)" }}>
                <Phone className="h-4 w-4 shrink-0" />
                <span>{config.phone}</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm" style={{ color: "oklch(0.45 0.01 260)" }}>
                <Mail className="h-4 w-4 shrink-0" />
                <span>{config.email}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

function StoreFooter({ config }: { config: StoreConfig }) {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "oklch(0.92 0.004 260)",
        background: "oklch(0.96 0.004 260)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 font-bold text-lg" style={{ color: "oklch(0.13 0.01 260)" }}>
              {logoSymbol}
              {config.storeName}
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "oklch(0.45 0.01 260)" }}>
              Productos originales con garantía y atención personalizada.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
              Tienda
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/productos" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Productos</Link></li>
              <li><Link href="/categorias" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Categorías</Link></li>
              <li><Link href="/contacto" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
              Información
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/envio" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Envíos</Link></li>
              <li><Link href="/devoluciones" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Devoluciones</Link></li>
              <li><Link href="/terminos" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Términos</Link></li>
              <li><Link href="/privacidad" className="hover-accent transition-colors" style={{ color: "oklch(0.45 0.01 260)" }}>Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
              Contacto
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: "oklch(0.45 0.01 260)" }}>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {config.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {config.phone}
              </li>
              <li className="text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>Lun - Sáb: 9:00 - 18:00</li>
            </ul>
            <Link
              href={`https://wa.me/${config.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-white transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.25)",
              }}
            >
              Escríbenos
            </Link>
          </div>
        </div>
        <div
          className="mt-12 border-t pt-8 text-center text-sm"
          style={{
            borderColor: "oklch(0.92 0.004 260)",
            color: "oklch(0.56 0.01 260)",
          }}
        >
          &copy; {new Date().getFullYear()} {config.storeName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

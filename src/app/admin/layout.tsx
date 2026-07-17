import { redirect } from "next/navigation"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { getRoleLevel } from "@/lib/validations/user"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Settings,
  Shield,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    return <div className="flex min-h-screen items-center justify-center">{children}</div>
  }

  const role = session.user.role as string
  if (getRoleLevel(role) < 1) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <AdminSidebar userRole={session.user.role as string} />
      </aside>
      <div className="flex flex-1 flex-col">
        <AdminNavbar user={session.user} />
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
        <AdminMobileNav />
      </div>
    </div>
  )
}

const sidebarIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  MessageSquare,
  Settings,
  Shield,
}

function AdminSidebar({ userRole }: { userRole: string }) {
  const canManageUsers = getRoleLevel(userRole) >= 3

  const links = [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/productos", label: "Productos", icon: "Package" },
    { href: "/admin/categorias", label: "Categorías", icon: "FolderTree" },
    { href: "/admin/marcas", label: "Marcas", icon: "Tag" },
    { href: "/admin/resenas", label: "Reseñas", icon: "MessageSquare" },
    ...(canManageUsers ? [{ href: "/admin/usuarios", label: "Usuarios", icon: "Shield" as const }] : []),
    { href: "/admin/configuracion", label: "Configuración", icon: "Settings" },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-6 font-bold">
        Container Admin
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = sidebarIcons[link.icon]
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a la tienda</span>
        </Link>
      </div>
    </div>
  )
}

function AdminNavbar({ user }: { user: { name?: string | null } }) {
  async function handleSignOut() {
    "use server"
    await signOut({ redirectTo: "/admin/login" })
  }

  return (
    <header className="flex h-14 items-center border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold md:hidden">Admin</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-muted-foreground md:inline">{user.name}</span>
        <form action={handleSignOut}>
          <button
            type="submit"
            className="text-xs text-muted-foreground hover:text-foreground md:text-sm"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}

const mobileLinks = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/productos", label: "Productos", icon: "Package" },
  { href: "/", label: "Tienda", icon: "ArrowLeft" },
]

function AdminMobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden">
      <div className="flex items-center justify-around">
        {mobileLinks.map((link) => {
          const Icon = sidebarIcons[link.icon] || ArrowLeft
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] text-gray-500 transition-colors hover:text-blue-600"
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

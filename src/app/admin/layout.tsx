import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { getRoleLevel } from "@/lib/validations/user"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  Shield,
} from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <AdminSidebar userRole={session.user.role as string} />
      </aside>
      <div className="flex flex-1 flex-col">
        <AdminNavbar user={session.user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

const sidebarIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  BarChart3,
  Megaphone,
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
    { href: "/admin/ventas", label: "Ventas", icon: "ShoppingCart" },
    { href: "/admin/clientes", label: "Clientes", icon: "Users" },
    { href: "/admin/reportes", label: "Reportes", icon: "BarChart3" },
    { href: "/admin/promociones", label: "Promociones", icon: "Megaphone" },
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
    </div>
  )
}

function AdminNavbar({ user }: { user: { name?: string | null } }) {
  return (
    <header className="flex h-14 items-center border-b bg-card px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user.name}</span>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}

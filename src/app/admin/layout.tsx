import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

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
        <AdminSidebar />
      </aside>
      <div className="flex flex-1 flex-col">
        <AdminNavbar user={session.user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

function AdminSidebar() {
  const links = [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/productos", label: "Productos", icon: "Package" },
    { href: "/admin/categorias", label: "Categorías", icon: "FolderTree" },
    { href: "/admin/marcas", label: "Marcas", icon: "Tag" },
    { href: "/admin/ventas", label: "Ventas", icon: "ShoppingCart" },
    { href: "/admin/clientes", label: "Clientes", icon: "Users" },
    { href: "/admin/reportes", label: "Reportes", icon: "BarChart3" },
    { href: "/admin/promociones", label: "Promociones", icon: "Megaphone" },
    { href: "/admin/configuracion", label: "Configuración", icon: "Settings" },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-6 font-bold">
        Container Admin
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}

function AdminNavbar({ user }: { user: any }) {
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

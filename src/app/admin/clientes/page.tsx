import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils/formatters"
import { SearchBar } from "@/components/admin/SearchBar"
import { Pagination } from "@/components/admin/Pagination"
import type { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"
const PAGE_SIZE = 25

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const sp = await searchParams
  const session = await auth()
  const storeId = session?.user?.storeId ?? ""
  const page = Math.max(1, parseInt(sp.page ?? "1"))
  const search = sp.q

  const where: Prisma.CustomerWhereInput = { storeId }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.customer.count({ where }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <SearchBar placeholder="Buscar por nombre, email o teléfono..." />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[600px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Pedidos</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total Gastado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 text-sm font-medium">{customer.name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{customer.email ?? "—"}</td>
                <td className="px-4 py-3 text-sm">{customer.phone ?? "—"}</td>
                <td className="px-4 py-3 text-sm">{customer.totalOrders}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(customer.totalSpent)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {customer.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>
    </div>
  )
}

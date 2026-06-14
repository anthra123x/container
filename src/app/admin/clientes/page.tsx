import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils/formatters"

export const dynamic = "force-dynamic"

export default async function AdminCustomersPage() {
  const session = await auth()
  const customers = await prisma.customer.findMany({
    where: { storeId: session?.user?.storeId ?? "" },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clientes</h1>

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
      </div>
    </div>
  )
}

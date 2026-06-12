export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reportes</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">Ventas del día</h2>
          <p className="mt-2 text-2xl font-bold">S/ 0.00</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">Ventas del mes</h2>
          <p className="mt-2 text-2xl font-bold">S/ 0.00</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">Productos vendidos</h2>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import Link from "next/link"
import { LoginForm } from "./login-form"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Container Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">Inicia sesión para administrar la tienda</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Cargando...</div>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  )
}

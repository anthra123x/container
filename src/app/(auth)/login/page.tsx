import { Suspense } from "react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Container Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inicia sesión para continuar</p>
      </div>
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

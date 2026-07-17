"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { useState } from "react"

export function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin"
  const [error, setError] = useState<string>()
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const data: LoginInput = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    }

    const result = loginSchema.safeParse(data)
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors
      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      })
      return
    }

    setSubmitting(true)

    const signInResult = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    })

    setSubmitting(false)

    if (signInResult?.error === "LOCKOUT") {
      setError("Demasiados intentos. Cuenta bloqueada por 15 minutos.")
      return
    }

    if (signInResult?.error) {
      setError("Credenciales inválidas")
      return
    }

    window.location.assign(callbackUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input-field"
          placeholder="admin@container.com"
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input-field"
          placeholder="••••••••"
        />
        {fieldErrors.password && (
          <p className="text-xs text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  )
}

"use client"

import * as Sentry from "@sentry/nextjs"
import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Algo salió mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
          <Link href="/" className="btn-primary gap-2 bg-gray-600 from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}

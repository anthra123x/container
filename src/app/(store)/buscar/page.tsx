"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Search as SearchIcon } from "lucide-react"

export default function BuscarPage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/productos?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Buscar productos</h1>
      <p className="mt-2 text-muted-foreground">
        Encuentra lo que necesitas en nuestro catálogo
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué estás buscando?"
          className="flex-1 rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

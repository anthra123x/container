"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useCallback, useState } from "react"

interface SearchBarProps {
  placeholder?: string
  paramName?: string
}

export function SearchBar({ placeholder = "Buscar...", paramName = "q" }: SearchBarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = useState(searchParams.get(paramName) ?? "")

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set(paramName, value.trim())
      } else {
        params.delete(paramName)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [value, pathname, searchParams, router, paramName]
  )

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-64 rounded-lg border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  )
}

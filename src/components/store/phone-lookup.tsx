"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function PhoneAutoLookup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if (searchParams.get("phone")) return
    const saved = localStorage.getItem("container_phone")
    if (saved) {
      router.replace(`/mis-pedidos?phone=${encodeURIComponent(saved)}`)
    } else {
      setShowInput(true)
    }
  }, [router, searchParams])

  if (showInput) return null

  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  )
}

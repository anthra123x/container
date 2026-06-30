"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function PhoneAutoLookup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasPhone = !!searchParams.get("phone")

  useEffect(() => {
    if (hasPhone) return
    const saved = localStorage.getItem("container_phone")
    if (saved) {
      router.replace(`/mis-pedidos?phone=${encodeURIComponent(saved)}`)
    }
  }, [router, searchParams, hasPhone])

  return null
}

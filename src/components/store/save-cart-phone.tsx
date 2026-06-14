"use client"

import { useEffect } from "react"

export function SaveCartPhone({ phone }: { phone: string }) {
  useEffect(() => {
    if (phone) {
      localStorage.setItem("container_phone", phone)
    }
  }, [phone])

  return null
}

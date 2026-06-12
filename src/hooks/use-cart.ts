"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, CartState } from "@/types"

interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

type CartStore = CartState & CartActions

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingIndex >= 0) {
          const updated = [...items]
          const current = updated[existingIndex]
          updated[existingIndex] = {
            ...current,
            quantity: Math.min(current.quantity + 1, current.maxStock),
          }
          set({ items: updated })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }

        const state = get()
        set({
          totalItems: state.items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      removeItem: (productId, variantId) => {
        const items = get().items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
        set({ items })
        set({
          totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId)
          return
        }

        const items = get().items.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: Math.min(quantity, i.maxStock) }
            : i
        )
        set({ items })
        set({
          totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "container-cart" }
  )
)

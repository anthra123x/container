export const STORE_NAME = "Container"
export const STORE_DESCRIPTION = "Tu tienda de tecnología de confianza"

export const ITEMS_PER_PAGE = 20
export const ADMIN_ITEMS_PER_PAGE = 25

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export const USER_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  EDITOR: "Editor",
  VIEWER: "Visor",
}

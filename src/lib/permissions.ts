import { UserRole } from "@prisma/client"

type Permission =
  | "products:create"
  | "products:read"
  | "products:update"
  | "products:delete"
  | "orders:read"
  | "orders:update"
  | "customers:read"
  | "customers:update"
  | "reports:read"
  | "settings:read"
  | "settings:update"
  | "users:read"
  | "users:manage"
  | "promotions:manage"

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "products:create", "products:read", "products:update", "products:delete",
    "orders:read", "orders:update",
    "customers:read", "customers:update",
    "reports:read",
    "settings:read", "settings:update",
    "users:read", "users:manage",
    "promotions:manage",
  ],
  ADMIN: [
    "products:create", "products:read", "products:update",
    "orders:read", "orders:update",
    "customers:read", "customers:update",
    "reports:read",
    "settings:read", "settings:update",
    "users:read",
    "promotions:manage",
  ],
  EDITOR: [
    "products:create", "products:read", "products:update",
    "orders:read",
    "customers:read",
    "reports:read",
    "settings:read",
  ],
  VIEWER: [
    "products:read",
    "orders:read",
    "customers:read",
    "reports:read",
    "settings:read",
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? []
}

import { z } from "zod"

const roles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"] as const

export const createUserSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(roles),
  isActive: z.coerce.boolean().optional().default(true),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .refine((val) => val === "" || val.length >= 6, "Mínimo 6 caracteres si se ingresa contraseña")
    .optional(),
  role: z.enum(roles),
  isActive: z.coerce.boolean(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const ROLES_CONFIG = {
  SUPER_ADMIN: { label: "Super Admin", level: 4 },
  ADMIN: { label: "Administrador", level: 3 },
  EDITOR: { label: "Editor", level: 2 },
  VIEWER: { label: "Visualizador", level: 1 },
} as const

export function getRoleLevel(role: string): number {
  return ROLES_CONFIG[role as keyof typeof ROLES_CONFIG]?.level ?? 0
}

export function canManageRole(currentRole: string, targetRole: string): boolean {
  const currentLevel = getRoleLevel(currentRole)
  const targetLevel = getRoleLevel(targetRole)
  return currentLevel > targetLevel || currentRole === "SUPER_ADMIN"
}

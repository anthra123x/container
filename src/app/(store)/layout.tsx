import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import StoreLayoutClient from "./StoreLayoutClient"

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.storeConfiguration.findFirst({
    select: { storeName: true, metaTitle: true, metaDescription: true },
  })

  const storeName = config?.storeName ?? "Container"
  const metaTitle = config?.metaTitle ?? `${storeName} - Tienda de Tecnología`
  const metaDescription =
    config?.metaDescription ??
    "Tu tienda de tecnología de confianza. Encuentra los mejores productos tecnológicos al mejor precio."

  return {
    title: { default: metaTitle, template: `%s | ${storeName}` },
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
      locale: "es_CO",
    },
  }
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const config = await prisma.storeConfiguration.findFirst({
    select: {
      whatsappNumber: true,
      storeName: true,
      email: true,
      phone: true,
    },
  })

  const whatsappNumber = config?.whatsappNumber?.replace(/[^\d]/g, "") ?? "573000000000"
  const storeName = config?.storeName ?? "Container"
  const email = config?.email ?? "ventas@container.co"
  const phone = config?.phone ?? "+57 300 000 0000"

  return (
    <StoreLayoutClient
      config={{ whatsappNumber, storeName, email, phone }}
    >
      {children}
    </StoreLayoutClient>
  )
}

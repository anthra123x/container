import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://container-store-seven.vercel.app"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/carrito", "/checkout", "/pedido/", "/mis-pedidos"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

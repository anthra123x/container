import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/providers/session-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { WebVitals } from "@/components/WebVitals"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://container-store-seven.vercel.app"),
  title: {
    default: "Container - Tienda de Tecnología",
    template: "%s | Container",
  },
  description: "Tu tienda de tecnología de confianza. Encuentra los mejores productos tecnológicos al mejor precio.",
  openGraph: {
    title: "Container - Tienda de Tecnología",
    description: "Tu tienda de tecnología de confianza.",
    type: "website",
    locale: "es_CO",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={supabaseUrl} />
        <link rel="dns-prefetch" href={supabaseUrl} />
      </head>
      <body className={geist.className}>
        <WebVitals />
        <AuthProvider>
          <ThemeProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/providers/session-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
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
      <body className={geist.className}>
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

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import ReactQueryProvider from "@/components/react-query-provider"
import { ScrollToTop } from "@/components/ScrollToTop"
import { Providers } from "./providers"

console.log("ENV CHECK:", process.env.NEXT_PUBLIC_API_BASE_URL)

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{
    lang: "ru" | "en"
  }>
}

// ----------------------------------------------------
// 1. ГЛОБАЛЬНЫЕ МЕТАДАННЫЕ
// ----------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: "Hostel 53 Bishkek KG",
    template: "%s | Hostel 53 Bishkek KG",
  },
  description:
    "Comfortable, safe, and affordable accommodation for travelers and students in Bishkek, Kyrgyzstan.",
  icons: {
    icon: "/favicon.ico",
  },
}

// ----------------------------------------------------
// 2. ROOT LAYOUT
// ----------------------------------------------------
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  /**
   * ✅ ОБЯЗАТЕЛЬНО await
   */
  const { lang: currentLang } = await params

  return (
    <html lang={currentLang} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ErrorBoundary>
          <Providers lang={currentLang}>
            <ReactQueryProvider>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-gray-50 font-body">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </ReactQueryProvider>

            <Toaster position="top-center" richColors />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

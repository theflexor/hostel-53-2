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

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

// Типизация для параметров маршрута
interface RootLayoutProps {
  children: React.ReactNode
  params: {
    lang: "ru" | "en"
  }
}

// ----------------------------------------------------
// 1. ГЛОБАЛЬНЫЕ МЕТАДАННЫЕ (Унаследуются всеми страницами)
// ----------------------------------------------------
// Этот title и description будут использоваться как fallback, если страница
// не определит свои собственные метаданные.
export const metadata: Metadata = {
  // Лучше использовать шаблон, который будет дополнен метаданными страниц
  title: {
    default: "Hostel 53 Bishkek KG",
    template: "%s | Hostel 53 Bishkek KG",
  },
  description:
    "Comfortable, safe, and affordable accommodation for travelers and students in Bishkek, Kyrgyzstan.",
  icons: {
    icon: "/favicon.ico",
  },
  // Не обязательно, но может быть полезно:
  // viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  // generator: 'v0.dev' // Удалите это, если не нужно
}

// ----------------------------------------------------
// 2. ROOT LAYOUT (Получает текущий язык)
// ----------------------------------------------------

// Получаем params, чтобы использовать текущий язык
export default function RootLayout({ children, params }: RootLayoutProps) {
  const currentLang = params.lang

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

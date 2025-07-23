import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { LanguageProvider } from "@/hooks/useLanguage"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import ReactQueryProvider from "@/components/react-query-provider"
import { ScrollToTop } from "@/components/ScrollToTop"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Hostel 53 - Your home in the heart of Bishkek",
  description: "Comfortable, safe, and affordable accommodation for travelers and students in Bishkek.",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ErrorBoundary>
          <LanguageProvider>
            <ReactQueryProvider>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-gray-50 font-body">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </ReactQueryProvider>
            <Toaster position="top-center" richColors />
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

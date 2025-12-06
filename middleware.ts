import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["ru", "en", "ky"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware triggered:", pathname)

  // Редирект с корня на /en
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/ru", request.url))
  }

  // Удаляем начальные и конечные слэши, разбиваем путь
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/")
  const lang = segments[0]

  // Если первый сегмент не язык — редиректим
  if (!locales.includes(lang)) {
    return NextResponse.redirect(new URL("/ru", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|fonts|images|icons|public|locales|api).*)",
  ],
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  MailIcon,
  BedIcon,
  StarIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { usePaths } from "@/lib/routes"

export function Header() {
  const lang = useParams().lang as string
  const paths = usePaths()

  const { t } = useTranslation()
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: paths.home, labelKey: "home", icon: HomeIcon },
    { href: paths.gallery, labelKey: "gallery", icon: ImageIcon },
    { href: paths.reviews, labelKey: "reviews", icon: StarIcon },
    { href: paths.about, labelKey: "about", icon: InfoIcon },
    { href: paths.contact, labelKey: "contact", icon: MailIcon },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHeaderScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href={paths.home}
            className="text-3xl font-extrabold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Hostel 53
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 bg-gray-100/80 p-1 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-primary-600"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-slide-down">
          <nav className="container mx-auto px-4 flex flex-col space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                  pathname === link.href
                    ? "bg-primary-100 text-primary-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {t(link.labelKey)}
              </Link>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <Button
                asChild
                className="bg-primary-gradient text-white rounded-xl"
              >
                <Link href={paths.book}>
                  <BedIcon className="h-4 w-4 mr-2" />
                  {t("book")}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

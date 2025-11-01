"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GlobeIcon, Check } from "lucide-react"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ky", name: "Кыргызча", flag: "🇰🇬" },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const router = useRouter()
  const pathname = usePathname()

  const handleChangeLanguage = (code: string) => {
    if (code === currentLang) return

    i18n.changeLanguage(code)

    // Пример: /ru/about → segments = ["", "ru", "about"]
    const segments = pathname.split("/").filter(Boolean)
    const rest = segments.slice(1).join("/") // без языка
    const newPath = `/${code}${rest ? "/" + rest : ""}`

    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find((l) => l.code === currentLang)?.flag}{" "}
            {languages.find((l) => l.code === currentLang)?.name}
          </span>
          <span className="sm:hidden">
            {languages.find((l) => l.code === currentLang)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChangeLanguage(lang.code)}
            className="gap-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {currentLang === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

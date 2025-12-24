import { HomePage } from "@/components/pages/HomePage"
import type { Metadata } from "next"

// --- ТИПЫ ДЛЯ МАРШРУТА ---
type Lang = "ru" | "en"

interface PageProps {
  params: Promise<{
    lang: Lang
  }>
}

// Ваш базовый домен
const baseUrl = "https://hostel53bishkekkg.com"

// --- ПЕРЕВОДЫ ---
const translations: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: "Хостел 53 в Бишкеке — Бюджетное и уютное жилье в центре",
    description:
      "Бронируйте койко-место в Хостеле 53 в Бишкеке (Кыргызстан). Мы предлагаем чистые номера, бесплатный Wi-Fi, кухню и идеальное расположение. Официальный сайт.",
  },
  en: {
    title:
      "Hostel 53 in Bishkek — Budget-friendly and Cozy Accommodation in the Center",
    description:
      "Book a bed or room at Hostel 53 in Bishkek (Kyrgyzstan). We offer clean rooms, free Wi-Fi, a kitchen, and a perfect central location. Official website.",
  },
}

// ----------------------------------------------------
// DYNAMIC METADATA (SERVER)
// ----------------------------------------------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params

  const currentT = translations[lang]

  return {
    title: currentT.title,
    description: currentT.description,

    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        ru: `${baseUrl}/ru`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },

    openGraph: {
      title: currentT.title,
      description: currentT.description,
      url: `${baseUrl}/${lang}`,
      siteName: "Hostel 53 Bishkek KG",
    },
  }
}

// ----------------------------------------------------
// STATIC PARAMS
// ----------------------------------------------------
export function generateStaticParams(): { lang: Lang }[] {
  return [{ lang: "ru" }, { lang: "en" }]
}

// ----------------------------------------------------
// PAGE
// ----------------------------------------------------
export default async function Home({ params }: PageProps) {
  const { lang } = await params

  return <HomePage lang={lang} />
}

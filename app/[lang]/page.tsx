import { HomePage } from "@/components/pages/HomePage"
import type { Metadata } from "next"

// --- ТИПЫ ДЛЯ МАРШРУТА ---
interface PageProps {
  params: {
    lang: "ru" | "en"
  }
}

// Ваш базовый домен
const baseUrl = "https://hostel53bishkekkg.com"

// --- ПРИМЕР: ЛОГИКА ПЕРЕВОДА МЕТАДАННЫХ (замените на вашу i18n-систему) ---
// В реальном проекте вы бы загружали эти данные из своей i18n-библиотеки.
const translations = {
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
// DYNAMIC METADATA GENERATION (СЕРВЕРНАЯ ЧАСТЬ)
// ----------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const lang = params.lang

  // Получаем переводы. Используем 'en' как резервный, если lang не 'ru' и не 'en'.
  const currentT = translations[lang] || translations.en

  return {
    title: currentT.title,
    description: currentT.description,

    // БЛОК HREFLANG для SEO
    alternates: {
      canonical: `${baseUrl}/${lang}`, // Канонический URL для текущего языка
      languages: {
        ru: `${baseUrl}/ru`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`, // Версия по умолчанию
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
// PAGE COMPONENT (КЛИЕНТСКАЯ И СЕРВЕРНАЯ ЧАСТЬ)
// ----------------------------------------------------

export function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "en" }, { lang: "ky" }]
}

export default function Home() {
  // Передаем текущий язык в компонент, чтобы он отобразил контент на нужном языке

  return <HomePage />
}

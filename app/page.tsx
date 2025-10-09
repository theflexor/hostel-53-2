import { HomePage } from "@/components/pages/HomePage"

export const metadata = {
  title: "Хостел 53 в Бишкеке — Бюджетное и уютное жилье в центре",

  description:
    "Бронируйте койко-место в Хостеле 53 в Бишкеке (Кыргызстан). Мы предлагаем чистые номера, бесплатный Wi-Fi, кухню и идеальное расположение. Официальный сайт.",
  alternates: {
    canonical: "https://hostel53bishkekkg.com/",
  },

  openGraph: {
    title: "Хостел 53 Бишкек | Официальный сайт",
    description:
      "Лучший выбор для бюджетного проживания в столице Кыргызстана.",
    url: "https://hostel53bishkekkg.com/",
    siteName: "Hostel 53 Bishkek KG",
  },
}

// ... экспорт Home
export default function Home() {
  return <HomePage />
}

// app/about/page.js
import { AboutPage } from "@/components/pages/AboutPage"

export const metadata = {
  title: "О Хостеле 53 в Бишкеке: Наша история и миссия | Hostel 53",
  description:
    "Узнайте больше о Хостеле 53: почему мы лучший выбор для бюджетного проживания в центре Бишкека. Чистота, безопасность и дружелюбная атмосфера для всех путешественников.",
  alternates: {
    canonical: "https://hostel53bishkekkg.com/about",
  },
}

export default function About() {
  return <AboutPage />
}

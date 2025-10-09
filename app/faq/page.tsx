import { FaqPage } from "@/components/pages/FaqPage"

export const metadata = {
  title: "FAQ: Часто задаваемые вопросы о Хостеле 53 в Бишкеке",
  description:
    "Ответы на все вопросы о Хостеле 53: бронирование, оплата, регистрация, удобства, прачечная и как добраться. Планируйте поездку в Бишкек легко!",
  alternates: {
    canonical: "https://hostel53bishkekkg.com/faq",
  },
}

export default function Faq() {
  return <FaqPage />
}

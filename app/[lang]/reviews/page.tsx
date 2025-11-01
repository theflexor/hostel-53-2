// app/reviews/page.js
import { ReviewsPage } from "@/components/pages/ReviewsPage"

export const metadata = {
  title: "Отзывы о Хостеле 53 в Бишкеке: реальные оценки гостей",
  description:
    "Посмотрите реальные отзывы и оценки наших гостей о проживании в Хостеле 53. Узнайте, почему нас выбирают путешественники в Бишкеке!",
  alternates: {
    canonical: "https://hostel53bishkekkg.com/reviews",
  },
}

export default function Reviews() {
  return <ReviewsPage />
}

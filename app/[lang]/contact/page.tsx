// app/contact/page.js
import { ContactPage } from "@/components/pages/ContactPage"

export const metadata = {
  title: "Контакты Хостела 53 в Бишкеке: Адрес, Телефон, Карта",
  description:
    "Позвоните или напишите в Хостел 53, чтобы забронировать номер. Наш точный адрес в центре Бишкека и график работы ресепшена.",
  alternates: {
    canonical: "https://hostel53bishkekkg.com/contact",
  },
}

export default function Contact() {
  return <ContactPage />
}

import { GalleryPage } from "@/components/pages/GalleryPage"

export const metadata = {
  title: "Фото Хостела 53 в Бишкеке — Номера, Кухня, Атмосфера",
  description:
    "Посмотрите галерею Хостела 53: чистые и уютные общие номера, двухместные комнаты, общая кухня и зоны отдыха в центре Бишкека. Убедитесь в качестве!",
  alternates: {
    canonical: "https://hostel53bishkekkg.com/gallery",
  },
  openGraph: {
    title: "Галерея Хостела 53",
    description: "Лучшие фотографии номеров и общих зон.",
    url: "https://hostel53bishkekkg.com/gallery",
  },
}

export default function Gallery() {
  return <GalleryPage />
}

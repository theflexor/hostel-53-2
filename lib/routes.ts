import { useParams } from "next/navigation"

export const usePaths = () => {
  const lg = useParams().lang as string
  const base = `/${lg}`

  return {
    home: `${base}/`,
    gallery: `${base}/gallery`,
    reviews: `${base}/reviews`,
    about: `${base}/about`,
    contact: `${base}/contact`,
    book: `${base}/#booking`,
    login: `${base}/login`,
    register: `${base}/register`,
    terms: `${base}/terms`,
    privacy: `${base}/privacy`,
    roomsId: (id: number) => `${base}/rooms/${id}`,
    roomBooking: (id: number) => `${base}/rooms/${id}/booking`,
  }
}

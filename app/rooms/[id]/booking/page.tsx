"use client"

import { BookingPage } from "@/components/pages/BookinPage"
import { useRoom } from "@/hooks/useRooms"
import { useParams } from "next/navigation"
import { Toaster } from "sonner"

const mockRoom = {
  id: "room-123",
  name: "Cozy Mountain Cabin",
  categoryName: "Premium Suite • Mountain View",
  price: 150,
  capacity: 4,
  images: ["/placeholder.svg?height=200&width=300"],
}

export default function HomePage() {
  const params = useParams()
  const id = Number(params.id)

  // Получаем данные о номере из моков
  const { data: room, isLoading } = useRoom(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <BookingPage room={room!} />
      <Toaster />
    </>
  )
}

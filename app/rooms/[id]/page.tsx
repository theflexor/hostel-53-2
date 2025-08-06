"use client"

import { useParams } from "next/navigation"
import { mockRooms } from "@/lib/mockData"
import { RoomDetailsPage } from "@/components/pages/RoomDetailsPage"
import { useRoom } from "@/hooks/useRooms"

export default function RoomDetails() {
  const params = useParams()
  const id = Number(params.id)

  // Получаем данные о номере из моков
  const { data: room, isLoading } = useRoom(id)

  if (!room) {
    return (
      <div className="text-center py-20 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Номер не найден</h2>
        <p className="text-gray-600">
          Попробуйте вернуться на главную страницу.
        </p>
      </div>
    )
  }
  return <RoomDetailsPage room={room} />
}

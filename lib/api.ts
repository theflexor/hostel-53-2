import type { Bed, RawRoomData, Room } from "./types"

const API_BASE_URL = "http://109.205.178.197:8080/api/v1"

type BookingPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  guests: number
  roomId: number
  startTime: string
  endTime: string
  comments: string
  bunkIds: number[]
}

// Adapter function to transform raw API data into the format used by the app's components
export function adaptRoomData(raw: RawRoomData): Room {
  // Helper to determine gender from category name
  const getGender = (categoryName: string): "male" | "female" | "mixed" => {
    const lowerCaseName = categoryName.toLowerCase()
    if (lowerCaseName.includes("женщин") || lowerCaseName.includes("female")) {
      return "female"
    }
    if (lowerCaseName.includes("мужчин") || lowerCaseName.includes("male")) {
      return "male"
    }
    return "mixed"
  }

  return {
    id: raw.id,
    name: raw.title,
    description: raw.description,
    price: raw.price ?? 1200, // Provide a default price if null
    images: raw.pictureUrls,
    amenities: raw.amenities,
    capacity: raw.capacity,
    gender: getGender(raw.categoryName),
    beds: raw.beds,
    roomSize: raw.roomSize,
    categoryName: raw.categoryName,
    categoryId: raw.categoryId,
    // Mock rating and reviews as they are not in the API response
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
    reviews: Math.floor(Math.random() * 100) + 10, // Random reviews between 10 and 110
  }
}

// Fetch available rooms for a given date range
export async function fetchAvailableRooms(
  startDate: string,
  endDate: string
): Promise<Room[]> {
  const response = await fetch(
    `${API_BASE_URL}/rooms?startDate=${startDate}&endDate=${endDate}`
  )
  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Failed to fetch available rooms:", errorBody)
    throw new Error("Failed to fetch available rooms")
  }
  const rawData: RawRoomData[] = await response.json()
  return rawData.map(adaptRoomData)
}

// Fetch a single room by its ID
export async function fetchRoomById(id: number): Promise<Room> {
  const response = await fetch(`${API_BASE_URL}/rooms/get-room/${id}`)
  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`Failed to fetch room with id ${id}:`, errorBody)
    throw new Error(`Failed to fetch room with id ${id}`)
  }
  const rawData: RawRoomData = await response.json()
  return adaptRoomData(rawData)
}

export async function fetchBedsById({
  endTime,
  roomId,
  startTime,
}: {
  roomId: number
  startTime: string
  endTime: string
}): Promise<Bed[]> {
  const response = await fetch(
    `${API_BASE_URL}/bunks/get-available-bunks` +
      `?roomId=${roomId}&startTime=${encodeURIComponent(
        startTime
      )}&endTime=${encodeURIComponent(endTime)}`
  )

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`Failed to fetch beds for room with id ${roomId}:`, errorBody)
    throw new Error(`Failed to fetch beds for room with id ${roomId}`)
  }
  const data = await response.json()
  return data
}

export async function bookBeds(payload: BookingPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookings/create-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to create booking:", errorText)
    throw new Error("Booking request failed")
  }

  console.log("Booking created successfully")
}

import type { Bed, CalculateResponse, RawRoomData, Room } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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

  console.log(raw)
  return {
    id: raw.id,
    name: raw.title,
    description: raw.description,
    price: raw.price, // Provide a default price if null
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

export async function bookBeds(
  payload: BookingPayload,
  lang: string
): Promise<void> {
  const langs: Record<string, string> = {
    kg: "kg-KG",
    ru: "ru-RU",
    en: "en-US",
  }

  const response = await fetch(`${API_BASE_URL}/bookings/create-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": langs[lang] || "en-US",
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

export async function calculatePrice(
  categoryId: number,
  bedsCount: number,
  guestsCount: number,
  checkInDate: string,
  checkOutDate: string
): Promise<CalculateResponse> {
  const checkInDatelocal = new Date(checkInDate).toISOString().split("T")[0]
  const checkOutDatelocal = new Date(checkOutDate).toISOString().split("T")[0]

  const response = await fetch(
    `${API_BASE_URL}/bookings/calculate-price?categoryId=${categoryId}&bedsCount=${bedsCount}&guestsCount=${guestsCount}&checkInDate=${checkInDatelocal}&checkOutDate=${checkOutDatelocal}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to calculate price:", errorText)
    // Бросаем ошибку с текстом ответа сервера
    throw new Error(`Price calculation failed: ${errorText}`)
  }

  const data = await response.json()
  return data
}

type ContactMessagePayload = {
  firstName: string
  lastName: string
  phone: string
  email: string
  subject: string
  message: string
}

interface Review {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  email: string
  rating: number
  comment: string
}

interface ReviewRequestPayload {
  name: string
  email: string
  rating: number
  comment: string
}

export async function fetchAllReviews(): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/reviews`)

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Failed to fetch all reviews:", errorBody)
    throw new Error("Failed to fetch all reviews")
  }

  const reviews: Review[] = await response.json()
  return reviews
}

export async function submitReviewByToken(
  token: string,
  payload: ReviewRequestPayload
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reviews/by-token/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Failed to submit review with token ${token}:`, errorText)
    throw new Error("Review submission failed")
  }

  console.log("Review submitted successfully")
  // The API returns a string on success, we just resolve the promise
}

export async function validateReviewToken(token: string): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/reviews/validate?token=${token}`
  )

  if (!response.ok) {
    // If the server returns a non-200 status, it might be an invalid token
    // or a server error. We'll log the error and assume false unless explicitly true.
    const errorText = await response.text()
    console.error("Failed to validate token:", errorText)
    // The API returns a boolean in the response body, but let's check the status as well.
    return false
  }

  // The response content is a boolean, as per the OpenAPI spec
  const isValid: boolean = await response.json()
  return isValid
}

export async function deleteReview(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Failed to delete review with id ${id}:`, errorText)
    throw new Error(`Failed to delete review with id ${id}`)
  }

  console.log(`Review with id ${id} deleted successfully`)
}

// Предполагаемые типы, если они не импортированы
type ContactMessageDto = {
  firstName: string
  lastName: string
  phone: string
  email?: string
  subject?: string
  message: string
}

type ContactMessage = {
  id: number
  firstName: string
  lastName: string
  phone: string
  email: string
  subject: string
  message: string
}

// 1. Отправляет новое контактное сообщение (POST)
export async function sendContactMessage(
  payload: ContactMessageDto
): Promise<void> {
  const url = `${API_BASE_URL}/contact`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to send contact message:", errorText)
    throw new Error(`Contact message request failed: ${errorText}`)
  }

  // API возвращает ContactMessage, но функция завершается успешно
  console.log("Contact message sent successfully")
}

// 2. Получает все контактные сообщения (GET)
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const url = `${API_BASE_URL}/contact`

  const response = await fetch(url)

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Failed to fetch all contact messages:", errorBody)
    throw new Error("Failed to fetch all contact messages")
  }

  const messages: ContactMessage[] = await response.json()
  return messages
}

// 3. Удаляет сообщение по ID (DELETE)
export async function deleteContactMessage(id: number): Promise<void> {
  const url = `${API_BASE_URL}/contact/${id}`

  const response = await fetch(url, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Failed to delete contact message with id ${id}:`, errorText)
    throw new Error(`Failed to delete contact message with id ${id}`)
  }

  console.log(`Contact message with id ${id} deleted successfully`)
}

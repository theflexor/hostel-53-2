// API Types and Interfaces
export interface Room {
  id: number
  name: string // Mapped from 'title'
  description: string
  price: number // Mapped from 'price', with a default value
  images: string[] // Mapped from 'pictureUrls'
  amenities: string[]
  capacity: number
  gender: "male" | "female" | "mixed" // Derived from 'categoryName'
  rating: number // Mocked
  reviews: number // Mocked
  beds: string
  roomSize: number
  categoryName: string
  categoryId: number
}

export interface Bed {
  id: number
  number: number
  tier: "BOTTOM" | "TOP"
  roomId: number
  available: boolean
}

// This represents the raw data structure from the API
export interface RawRoomData {
  id: number
  title: string
  description: string
  capacity: number
  price: number | null
  beds: string
  roomSize: number
  categoryId: number
  categoryName: string
  amenities: string[]
  pictureUrls: string[]
}

export interface CreateRoomData {
  name: string
  description: string
  price: number
  images: string[]
  amenities: string[]
  capacity: number
  gender: "male" | "female" | "mixed"
  features: string[]
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  available?: boolean
}

export interface SearchFilters {
  checkIn?: string
  checkOut?: string
  guests?: number
  priceRange?: [number, number]
  roomType?: string
  capacity?: string
  available?: boolean
}

export interface BookingData {
  id?: string
  roomId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  specialRequests?: string
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
  updatedAt?: string
}

export interface CreateBookingData {
  checkIn: string
  checkOut: string
  firstName: string
  lastName: string
  email: string
  phone: string
  selectedBedIds: number[]
  specialRequests: string
  arrivalTime: string
  roomId: number // This should be the ID of the room being booked
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

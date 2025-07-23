"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { BookingData, CreateBookingData } from "@/lib/types"

// Mock function for development
const saveMockBooking = async (booking: CreateBookingData): Promise<BookingData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newBooking: BookingData = {
    ...booking,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // Save to localStorage for development
  if (typeof window !== "undefined") {
    const bookings = JSON.parse(localStorage.getItem("hostel_bookings") || "[]")
    bookings.push(newBooking)
    localStorage.setItem("hostel_bookings", JSON.stringify(bookings))
  }

  return newBooking
}

const fetchMockBookings = async (email?: string): Promise<BookingData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (typeof window === "undefined") return []

  const bookings = JSON.parse(localStorage.getItem("hostel_bookings") || "[]")

  if (email) {
    return bookings.filter((booking: BookingData) => booking.email === email)
  }

  return bookings
}

// Create booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      return await saveMockBooking(bookingData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })
}

// Fetch user bookings
export const useBookings = (email?: string) => {
  return useQuery({
    queryKey: ["bookings", email],
    queryFn: async () => {
      return await fetchMockBookings(email)
    },
    enabled: !!email,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Fetch single booking
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const bookings = await fetchMockBookings()
      return bookings.find((booking) => booking.id === id)
    },
    enabled: !!id,
  })
}

// Update booking status (admin)
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingData["status"] }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Mock: Updating booking status", { id, status })
      // In a real app, you'd update localStorage here
      return { id, status, success: true } as unknown as BookingData
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["booking", data.id] })
      }
    },
  })
}

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Mock: Cancelling booking", id)
      // In a real app, you'd update localStorage here
      return { id, status: "cancelled", success: true } as unknown as BookingData
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["booking", data.id] })
      }
    },
  })
}

// Get booking statistics (admin)
export const useBookingStats = () => {
  return useQuery({
    queryKey: ["booking-stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const bookings = await fetchMockBookings()
      return {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        revenue: bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0),
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAvailableRooms, fetchRoomById } from "@/lib/api"
import type { Room, CreateRoomData, UpdateRoomData, SearchFilters } from "@/lib/types"

// Helper to get default dates for initial load
const getDefaultDates = () => {
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + 30) // Fetch for the next 30 days by default
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}

// Fetch rooms available for a given period
export const useRooms = (filters?: SearchFilters) => {
  const { startDate, endDate } = getDefaultDates()
  // Use provided dates from filters, or default dates
  const checkInDate = filters?.checkIn || startDate
  const checkOutDate = filters?.checkOut || endDate

  const queryKey = ["rooms", checkInDate, checkOutDate]

  return useQuery<Room[], Error>({
    queryKey: queryKey,
    queryFn: () => fetchAvailableRooms(checkInDate, checkOutDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Fetch a single room by its ID
export const useRoom = (id: number) => {
  return useQuery<Room, Error>({
    queryKey: ["room", id],
    queryFn: () => fetchRoomById(id),
    enabled: !!id, // The query will not run until the id is available
    staleTime: 5 * 60 * 1000,
  })
}

// Perform a search for rooms based on filters
export const useSearchRooms = () => {
  const queryClient = useQueryClient()
  return useMutation<Room[], Error, SearchFilters>({
    mutationFn: (filters: SearchFilters) => {
      const { startDate, endDate } = getDefaultDates()
      return fetchAvailableRooms(filters.checkIn || startDate, filters.checkOut || endDate)
    },
    onSuccess: (data, variables) => {
      // When search is successful, update the cache for the main 'rooms' query
      const { startDate, endDate } = getDefaultDates()
      const queryKey = ["rooms", variables.checkIn || startDate, variables.checkOut || endDate]
      queryClient.setQueryData(queryKey, data)
    },
  })
}

// --- Mock implementations for Admin/Booking functionality ---
// These can be replaced with real API calls when the backend is ready

export const useCreateRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomData: CreateRoomData) => {
      console.log("Mock Create Room:", roomData)
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true, ...roomData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
    },
  })
}

export const useUpdateRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRoomData }) => {
      console.log("Mock Update Room:", id, data)
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true, id, ...data }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["room", data.id] })
      }
    },
  })
}

export const useDeleteRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      console.log("Mock Delete Room:", id)
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true, message: `Room ${id} deleted` }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
    },
  })
}

export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: async ({ roomId, checkIn, checkOut }: { roomId: number; checkIn: string; checkOut: string }) => {
      console.log("Mock Check Availability:", { roomId, checkIn, checkOut })
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { available: true }
    },
  })
}

export type { Room, SearchFilters }

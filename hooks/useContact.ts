"use client"

import { useMutation } from "@tanstack/react-query"
import type { ContactFormData } from "@/lib/types"

export const useContactForm = () => {
  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Contact form submitted:", formData)
      return { message: "Message sent successfully!" }
    },
  })
}

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log("Newsletter subscription:", email)
      return { message: "Successfully subscribed to newsletter!" }
    },
  })
}

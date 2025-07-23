// Environment configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: 10000,
  },
  app: {
    name: "Hostel 53",
    description: "Your home in the heart of Bishkek",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  contact: {
    phone: "+996557530053",
    whatsapp: "https://wa.me/996557530053",
    email: "info@hostel53.kg",
    address: "Temirova 44, near Gastello Hotel, Bishkek, Kyrgyzstan",
  },
  social: {
    instagram: "#",
    facebook: "#",
    telegram: "#",
  },
  features: {
    enableBooking: true,
    enablePayments: false,
    enableReviews: true,
    enableMultiLanguage: true,
  },
}

export type Config = typeof config

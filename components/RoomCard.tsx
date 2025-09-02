"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import type { Room } from "@/lib/types"
import {
  HeartIcon,
  Star,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  BedIcon,
  EyeIcon,
} from "lucide-react"
import Image from "next/image"
import { BookingFlow } from "@/components/booking/BookingFlow"

interface RoomCardProps {
  room: Room
}

const staticUrl = process.env.NEXT_PUBLIC_STATIC_ASSETS_URL || ""

export function RoomCard({ room }: RoomCardProps) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // const [isLiked, setIsLiked] = useState(false)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-700 transform hover:-translate-y-2 sm:hover:-translate-y-3 bg-card-gradient border-0 rounded-2xl sm:rounded-3xl hover:shadow-primary-glow/20 relative">
      <Link href={`/rooms/${room.id}`} className="block">
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <Image
            src={
              staticUrl + room.images[currentImageIndex] || "/placeholder.svg"
            }
            alt={room.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {room.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </>
          )}

          {/* <div
            className="absolute top-2 sm:top-4 right-2 sm:right-4"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // setIsLiked(!isLiked)
            }}
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer">
              <HeartIcon
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                  isLiked
                    ? "fill-red-500 text-red-500 animate-pulse"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            </div>
          </div> */}

          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
            <Badge
              className={`${
                room.gender === "male"
                  ? "bg-primary-gradient text-white"
                  : room.gender === "female"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              } px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold shadow-lg text-xs`}
            >
              {t(
                room.gender === "male"
                  ? "maleRoom"
                  : room.gender === "female"
                  ? "femaleRoom"
                  : "mixedRoom"
              )}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        <Link href={`/rooms/${room.id}`} className="block">
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-tight group-hover:text-primary-600 transition-colors duration-300 flex-1 pr-2 sm:pr-3 line-clamp-2">
              {room.name}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg border border-yellow-200 flex-shrink-0">
              {renderStars(room.rating)}
              <span className="text-xs font-bold text-gray-700 ml-1">
                ({room.reviews})
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 h-8 sm:h-10">
            {room.description}
          </p>
        </Link>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-primary-50 rounded-xl p-2 sm:p-3 border border-primary-100 mb-3 sm:mb-4 animate-fade-in">
          <div
            className="flex items-center gap-1 sm:gap-2"
            title={t("capacity")}
          >
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
            <span className="font-semibold">
              {t("upToGuests", { count: room.capacity })}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2" title={t("beds")}>
            <BedIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
            <span className="font-semibold">{room.beds}</span>
          </div>
        </div>

        <div className="flex items-center justify-between animate-fade-in">
          <div className="text-left">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                {room.price}
              </span>
              <span className="text-sm sm:text-base text-gray-500 font-medium">
                {t("currency")}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {t("perNight")}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg sm:rounded-xl border-primary-200 text-primary-600 hover:bg-primary-50 bg-transparent transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-7 sm:h-auto"
            >
              <Link href={`/rooms/${room.id}`}>
                <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                {t("viewDetails")}
              </Link>
            </Button>
            <Link href={`/rooms/${room.id}/booking`}>
              <Button
                size="sm"
                className="bg-primary-gradient hover:shadow-lg text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 h-7 sm:h-auto"
              >
                {t("book")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

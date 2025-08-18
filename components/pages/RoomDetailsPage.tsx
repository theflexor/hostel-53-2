"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { config } from "@/lib/config"
import type { Room } from "@/lib/types"
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  Star,
  BedIcon,
  UsersIcon,
  CheckIcon,
  PhoneIcon,
  MessageCircleIcon,
  WifiIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RulerIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface RoomDetailsPageProps {
  room: Room
}

const staticUrl = process.env.NEXT_PUBLIC_STATIC_ASSETS_URL || ""

export function RoomDetailsPage({ room }: RoomDetailsPageProps) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const router = useRouter()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              {t("backToRooms")}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className="text-gray-600 hover:text-red-500"
              >
                <HeartIcon
                  className={`h-5 w-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-800"
              >
                <ShareIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={
                    staticUrl + room.images[currentImageIndex] ||
                    "/placeholder.svg"
                  }
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  fill
                  objectFit="cover"
                  className="transition-opacity duration-300"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${
                      room.gender === "male"
                        ? "bg-blue-600 text-white"
                        : room.gender === "female"
                        ? "bg-pink-600 text-white"
                        : "bg-purple-600 text-white"
                    } px-4 py-2 rounded-full font-semibold shadow-lg`}
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
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {t("available")}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {room.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      {renderStars(room.rating)}
                      <span className="text-lg font-semibold text-gray-700">
                        {room.rating.toFixed(1)} ({room.reviews} {t("reviews")})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary-600">
                      {room.price} {t("currency")}
                    </div>
                    <div className="text-gray-500">{t("perNight")}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {room.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <UsersIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">
                      {room.capacity}
                    </div>
                    <div className="text-sm text-gray-600">{t("guests")}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <BedIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">
                      {room.beds}
                    </div>
                    <div className="text-sm text-gray-600">{t("beds")}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <RulerIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">
                      {room.roomSize} м²
                    </div>
                    <div className="text-sm text-gray-600">Площадь</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <WifiIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">
                      {t("free")}
                    </div>
                    <div className="text-sm text-gray-600">Wi-Fi</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t("amenities")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-lg border-2 border-primary-100">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {room.price} {t("currency")}
                    </div>
                    <div className="text-gray-500">{t("perNight")}</div>
                  </div>
                  <Link href={`/rooms/${room.id}/booking`}>
                    <Button className="w-full bg-primary-gradient hover:shadow-lg text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 mb-4">
                      {t("bookNow")}
                    </Button>
                  </Link>
                  <div className="text-center text-sm text-gray-500 mb-6">
                    {t("freeCancellation")}
                  </div>
                  <div className="space-y-3">
                    <Link href={`tel:${config.contact.phone}`}>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl bg-transparent"
                      >
                        <PhoneIcon className="mr-2 h-4 w-4" />
                        {config.contact.phone}
                      </Button>
                    </Link>
                    <Link href={config.contact.whatsapp}>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl bg-transparent"
                      >
                        <MessageCircleIcon className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    {t("contactUs")}
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong>{t("address")}:</strong>
                      <br />
                      {t("addressValue")}
                    </div>
                    <div>
                      <strong>{t("phone")}:</strong>
                      <br />
                      {config.contact.phone}
                    </div>
                    <div>
                      <strong>Email:</strong>
                      <br />
                      {config.contact.email}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

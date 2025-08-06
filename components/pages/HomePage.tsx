"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RoomCard } from "@/components/RoomCard"
import { DateRangePicker } from "@/components/DateRangePicker"
import { useTranslation } from "@/lib/i18n"
import { useRooms, type Room } from "@/hooks/useRooms"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
  AwardIcon,
  LoaderIcon,
  ShieldCheckIcon,
  MapPinIcon,
  HeartIcon,
  TrendingUpIcon,
  GiftIcon,
  BedIcon,
  UtensilsIcon,
  ShowerHeadIcon,
  WifiIcon,
  ParkingCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ImageIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { mockRooms } from "@/lib/mockData"
import { useLanguage } from "@/hooks/useLanguage"
import { get } from "http"

const carouselImages = [
  {
    src: "https://i.pinimg.com/1200x/97/28/fc/9728fc985a4bab0f28a81330055c9486.jpg",
    titleKey: "carouselTitle1",
    subtitleKey: "carouselSubtitle1",
  },
  {
    src: "https://i.pinimg.com/1200x/e9/7c/fd/e97cfdc895c5138968be1df73519b87b.jpg",
    titleKey: "carouselTitle2",
    subtitleKey: "carouselSubtitle2",
  },
  {
    src: "https://i.pinimg.com/736x/7d/1c/7c/7d1c7ce6661ff915ce2217f722a4c6f9.jpg",
    titleKey: "carouselTitle3",
    subtitleKey: "carouselSubtitle3",
  },
]

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-primary-400/30 rounded-full animate-float-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

export function HomePage() {
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState<Room[]>([])
  const [searchFilters, setSearchFilters] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "any",
    sortBy: "price_asc",
  })
  const { data: allRooms, refetch } = useRooms()
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDateRangeChange = (range: { from?: string; to?: string }) => {
    setSearchFilters((prev) => ({
      ...prev,
      checkIn: range.from ? range.from : "",
      checkOut: range.to ? range.to : "",
    }))
  }

  const handleSearch = async () => {
    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let filtered = [...(allRooms || [])]
    if (searchFilters.guests) {
      filtered = filtered.filter(
        (room) => room.capacity >= searchFilters.guests
      )
    }
    if (searchFilters.roomType !== "any") {
      filtered = filtered.filter(
        (room) => room.gender === searchFilters.roomType
      )
    }

    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "rating_desc":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setSearchResults(filtered)
    setShowSearchResults(true)
    setIsSearching(false)
    setTimeout(() => {
      document
        .getElementById("search-results")
        ?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const whyChooseUsData = [
    { icon: MapPinIcon, titleKey: "whyUsTitle1", descKey: "whyUsDesc1" },
    { icon: ShieldCheckIcon, titleKey: "whyUsTitle2", descKey: "whyUsDesc2" },
    { icon: HeartIcon, titleKey: "whyUsTitle3", descKey: "whyUsDesc3" },
    { icon: TrendingUpIcon, titleKey: "whyUsTitle4", descKey: "whyUsDesc4" },
  ]

  const specialOffers = [
    {
      titleKey: "offerTitle1",
      discount: "15%",
      descKey: "offerDesc1",
      color: "from-secondary-500 to-amber-500",
    },
    {
      titleKey: "offerTitle2",
      discount: "10%",
      descKey: "offerDesc2",
      color: "from-green-500 to-emerald-500",
    },
    {
      titleKey: "offerTitle3",
      discount: "20%",
      descKey: "offerDesc3",
      color: "from-purple-500 to-pink-500",
    },
  ]

  const whatWeProvide = [
    { icon: BedIcon, titleKey: "provideTitle1", descKey: "provideDesc1" },
    { icon: UtensilsIcon, titleKey: "provideTitle2", descKey: "provideDesc2" },
    {
      icon: ShowerHeadIcon,
      titleKey: "provideTitle3",
      descKey: "provideDesc3",
    },
    { icon: WifiIcon, titleKey: "provideTitle4", descKey: "provideDesc4" },
    {
      icon: ParkingCircleIcon,
      titleKey: "provideTitle5",
      descKey: "provideDesc5",
    },
    { icon: ClockIcon, titleKey: "provideTitle6", descKey: "provideDesc6" },
  ]
  return (
    <>
      {/* Hero Section */}
      <section
        id="booking"
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
      >
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === carouselIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={t(
                    image.titleKey as keyof ReturnType<
                      typeof useTranslation
                    >["t"]
                  )}
                  fill
                  className="object-cover"
                  quality={100}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <FloatingParticles />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white px-4 pb-40 sm:pb-48">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 relative">
                  <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
                    {t(
                      carouselImages[carouselIndex]
                        .titleKey as keyof ReturnType<
                        typeof useTranslation
                      >["t"]
                    )}
                  </span>
                </h1>
              </div>
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                <p className="text-lg sm:text-2xl lg:text-3xl mb-8 sm:mb-12 text-primary-100 font-light max-w-4xl mx-auto leading-relaxed px-4">
                  {t(
                    carouselImages[carouselIndex]
                      .subtitleKey as keyof ReturnType<
                      typeof useTranslation
                    >["t"]
                  )}
                </p>
              </div>
              <div
                className="animate-fade-in-up grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-12 sm:mt-16 px-4"
                style={{ animationDelay: "1.2s" }}
              >
                {[
                  { icon: StarIcon, value: "4.8", labelKey: "rating" },
                  { icon: UsersIcon, value: "150+", labelKey: "guests" },
                  { icon: AwardIcon, value: "24/7", labelKey: "support" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group animate-bounce-in"
                    style={{ animationDelay: `${1.5 + index * 0.2}s` }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-primary-glow">
                      <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-primary-200 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-primary-300 font-medium">
                      {t(
                        stat.labelKey as keyof ReturnType<
                          typeof useTranslation
                        >["t"]
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            setCarouselIndex(
              (prev) =>
                (prev - 1 + carouselImages.length) % carouselImages.length
            )
          }
          className="absolute left-2 sm:left-8 top-1/2 transform -translate-y-1/2 z-30 group"
        >
          <ChevronLeftIcon className="h-8 w-8 text-white/70 group-hover:text-white transition" />
        </button>
        <button
          onClick={() =>
            setCarouselIndex((prev) => (prev + 1) % carouselImages.length)
          }
          className="absolute right-2 sm:right-8 top-1/2 transform -translate-y-1/2 z-30 group"
        >
          <ChevronRightIcon className="h-8 w-8 text-white/70 group-hover:text-white transition" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-4 sm:pb-8">
          <div className="container mx-auto px-4">
            <div className="backdrop-blur-xl bg-white/95 rounded-2xl sm:rounded-3xl shadow-luxury border border-primary-200/50 overflow-hidden animate-slide-up max-w-4xl mx-auto">
              <div className="relative p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
                  <div className="sm:col-span-2">
                    <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      {t("checkIn")} / {t("checkOut")}
                    </Label>
                    <DateRangePicker
                      onDateRangeChange={handleDateRangeChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="guests-select"
                      className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block"
                    >
                      {t("guests")}
                    </Label>
                    <Select
                      value={searchFilters.guests.toString()}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          guests: Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger
                        id="guests-select"
                        className="w-full rounded-xl border-gray-200 focus:border-primary-400 focus:ring-primary-400 h-12"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {t(num === 1 ? "guest" : "guests")}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-primary-gradient hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full h-12"
                  >
                    {isSearching ? (
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <SearchIcon className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showSearchResults && (
        <section
          id="search-results"
          className="py-12 sm:py-16 bg-gradient-to-br from-primary-50 via-white to-blue-50"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
                  {t("searchResults")}
                </h2>
                <p className="text-sm sm:text-lg text-gray-600">
                  {t("foundRooms", { count: searchResults.length })}
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select
                  value={searchFilters.sortBy}
                  onValueChange={(value) => {
                    setSearchFilters((prev) => ({ ...prev, sortBy: value }))
                    handleSearch()
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px] rounded-xl">
                    <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_asc">{t("priceAsc")}</SelectItem>
                    <SelectItem value="price_desc">{t("priceDesc")}</SelectItem>
                    <SelectItem value="rating_desc">
                      {t("ratingDesc")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowSearchResults(false)}
                  className="rounded-xl"
                >
                  {t("hideResults")}
                </Button>
              </div>
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg max-w-lg mx-auto">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    {t("noRoomsFound")}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {t("tryAdjustingSearch")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {searchResults.map((room, index) => (
                  <div
                    key={room.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <RoomCard room={room} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {!showSearchResults && allRooms && (
        <>
          <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-white to-primary-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  Все наши номера
                </h2>
                <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  {t("ourRoomsSubtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {allRooms.map((room, index) => (
                  <div
                    key={room.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <RoomCard room={room} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {t("whyUsTitle")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {whyChooseUsData.map((item, index) => (
                  <Card
                    key={index}
                    className="group p-4 sm:p-6 text-center hover:shadow-luxury transition-all duration-500 transform hover:-translate-y-2 animate-fade-in bg-card-gradient border-0 rounded-2xl"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                      {t(
                        item.titleKey as keyof ReturnType<
                          typeof useTranslation
                        >["t"]
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {t(
                        item.descKey as keyof ReturnType<
                          typeof useTranslation
                        >["t"]
                      )}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {t("specialOffersTitle")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {specialOffers.map((offer, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden hover:shadow-luxury transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-0 rounded-2xl"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                    />
                    <CardContent className="relative p-4 sm:p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div
                          className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${offer.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <GiftIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <Badge
                          className={`ml-3 bg-gradient-to-r ${offer.color} text-white px-3 py-1 text-lg sm:text-xl font-bold rounded-full shadow-lg`}
                        >
                          -{offer.discount}
                        </Badge>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                        {t(
                          offer.titleKey as keyof ReturnType<
                            typeof useTranslation
                          >["t"]
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4">
                        {t(
                          offer.descKey as keyof ReturnType<
                            typeof useTranslation
                          >["t"]
                        )}
                      </p>
                      <Button
                        className={`bg-gradient-to-r ${offer.color} text-white hover:shadow-lg rounded-xl transition-all hover:scale-105 w-full`}
                      >
                        {t("getOffer")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {t("whatWeProvideTitle")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {whatWeProvide.map((item, index) => (
                  <Card
                    key={index}
                    className="group p-4 sm:p-6 hover:shadow-luxury transition-all duration-500 transform hover:-translate-y-2 animate-fade-in bg-card-gradient border-0 rounded-2xl"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-gradient rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                          {t(
                            item.titleKey as keyof ReturnType<
                              typeof useTranslation
                            >["t"]
                          )}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {t(
                            item.descKey as keyof ReturnType<
                              typeof useTranslation
                            >["t"]
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-16 bg-gradient-to-br from-primary-600 via-blue-600 to-indigo-700 relative">
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center animate-fade-in-up">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  {t("ctaTitle")}
                </h2>
                <p className="text-base sm:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  {t("ctaSubtitle")}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="group relative overflow-hidden bg-white text-primary-600 hover:text-primary-700 shadow-luxury px-8 sm:px-10 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl transition-all hover:scale-110"
                >
                  <Link href="/#booking">
                    {t("bookNow")}
                    <ArrowRightIcon className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

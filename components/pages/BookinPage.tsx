"use client"

import dayjs from "dayjs"
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/DateRangePicker"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { useCalculatePrice, useCreateBooking } from "@/hooks/useBookings"
import type { Room } from "@/lib/types"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  CreditCard,
  Loader2,
  User,
  BedIcon,
  Download,
  Share2,
  MessageSquare,
  X,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Shield,
  MapPin,
  Users,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useBeds } from "@/hooks/useBeds"
import { useRouter } from "next/navigation"
// ДОБАВЛЕНО: Импортируем хук для расчета цены

export interface Bed {
  id: number
  number: number
  tier: "BOTTOM" | "TOP"
  roomId: number
  available: boolean
  bookedPeriods: {
    start: string
    end: string
  }[]
}

interface CreateBookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  selectedBedIds: number[]
  roomId: number
  checkIn: string
  checkOut: string
  specialRequests: string
}

interface BookingPageProps {
  room: Room
  onClose?: () => void
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, y: -2 },
}

const bedCardVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, rotate: 1 },
  tap: { scale: 0.95 },
}

const stepVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

// const discountData = {
//   originalPrice: 35000.0,
//   discountedPrice: 21000.0,
//   discountAmount: 14000.0,
//   discountPercentage: 40,
// }

// const hasDiscount = discountData.discountPercentage > 0

export function BookingPage({ room, onClose }: BookingPageProps) {
  const router = useRouter()
  const pageTopRef = useRef(null)
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const createBooking = useCreateBooking()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedBedIds: [] as number[],
    specialRequests: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  const shouldFetchBeds = !!formData.checkIn && !!formData.checkOut
  const {
    data: beds = [],
    isLoading: isLoadingBeds,
    error: bedsError,
  } = useBeds({
    roomId: room.id,
    startTime: formData.checkIn,
    endTime: formData.checkOut,
    // enabled: shouldFetchBeds,
  })

  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = dayjs(formData.checkIn)
    const checkOut = dayjs(formData.checkOut)
    const diff = checkOut.diff(checkIn, "day")
    return diff > 0 ? diff : 0
  }, [formData.checkIn, formData.checkOut])

  // ДОБАВЛЕНО: Вызываем хук для получения цены с бэкенда
  const {
    data: serverCalculatedPrice,
    isLoading: isPriceLoading,
    error: priceError,
  } = useCalculatePrice(
    room.id,
    formData.selectedBedIds,
    formData.checkIn,
    formData.checkOut
  )

  console.log(serverCalculatedPrice)

  const discountData = serverCalculatedPrice || {
    originalPrice: 0,
    discountedPrice: 0,
    discountAmount: 0,
    discountPercentage: 0,
  }

  const hasDiscount = discountData.discountPercentage > 0
  const totalPrice = hasDiscount
    ? discountData.discountedPrice
    : discountData.originalPrice || 0

  // ИЗМЕНЕНО: Теперь totalPrice берется из хука, а не вычисляется на клиенте
  // const totalPrice = serverCalculatedPrice ?? 0

  // Этот useMemo оставляем, так как форматирование все еще нужно
  const formattedTotalPrice = useMemo(() => {
    const priceToFormat = hasDiscount
      ? discountData.discountedPrice
      : totalPrice
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceToFormat)
  }, [totalPrice, discountData, hasDiscount, language])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedBedIds: [] }))
  }, [formData.checkIn, formData.checkOut])

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [step])

  useEffect(() => {
    // Trigger price calculation immediately when beds or dates change
    if (
      formData.selectedBedIds.length > 0 &&
      formData.checkIn &&
      formData.checkOut
    ) {
      console.log("[v0] Triggering price calculation for:", {
        bedIds: formData.selectedBedIds,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
      })
    }
  }, [formData.selectedBedIds, formData.checkIn, formData.checkOut])

  const handleDateChange = useCallback(
    (range: { from?: string; to?: string }) => {
      setFormData((prev) => ({
        ...prev,
        checkIn: range.from ? range.from : "",
        checkOut: range.to ? range.to : "",
      }))
    },
    []
  )

  const handleBedSelection = useCallback(
    (bedId: number) => {
      setFormData((prev) => {
        const currentSelected = prev.selectedBedIds
        const isSelected = currentSelected.includes(bedId)

        if (isSelected) {
          return {
            ...prev,
            selectedBedIds: currentSelected.filter((id) => id !== bedId),
          }
        } else {
          if (currentSelected.length < room.capacity) {
            return {
              ...prev,
              selectedBedIds: [...currentSelected, bedId],
            }
          } else {
            toast.warning(t("maxGuestsReached", { count: room.capacity }))
            return prev
          }
        }
      })
    },
    [t, room.capacity]
  )

  const validateCurrentStepFields = useCallback(() => {
    let isValid = true
    const newErrors: Record<string, string> = {}

    if (step === 3) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = t("requiredField")
        isValid = false
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = t("requiredField")
        isValid = false
      }
      if (!formData.email.trim()) {
        newErrors.email = t("requiredField")
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t("invalidEmail")
        isValid = false
      }
      if (!formData.phone.trim()) {
        newErrors.phone = t("requiredField")
        isValid = false
      }
    } else if (step === 4) {
      if (!agreedToTerms) {
        newErrors.terms = t("agreeToTerms")
        isValid = false
      }
    }
    return [isValid, newErrors] as [boolean, Record<string, string>]
  }, [formData, step, agreedToTerms, t])

  const runValidationAndSetErrors = useCallback(() => {
    const [isValid, errors] = validateCurrentStepFields()
    setFormErrors(errors)
    return isValid
  }, [validateCurrentStepFields])

  const handleNextStep = useCallback(() => {
    if (
      step === 1 &&
      (!formData.checkIn || !formData.checkOut || nights <= 0)
    ) {
      toast.error(t("pleaseSelectValidDates"))
      return
    }
    if (step === 2 && formData.selectedBedIds.length === 0) {
      toast.error(t("pleaseSelectAtLeastOneBed"))
      return
    }
    if (runValidationAndSetErrors()) {
      setStep((s) => s + 1)
    }
  }, [
    runValidationAndSetErrors,
    step,
    formData.checkIn,
    formData.checkOut,
    formData.selectedBedIds.length,
    nights,
    t,
  ])

  const handlePrevStep = useCallback(() => {
    setStep((s) => s - 1)
    setFormErrors({})
  }, [])

  const generateBookingReference = () => {
    return `BK${Date.now().toString().slice(-6)}${Math.random()
      .toString(36)
      .substr(2, 3)
      .toUpperCase()}`
  }

  const handleSubmit = useCallback(async () => {
    if (!runValidationAndSetErrors()) {
      return
    }
    try {
      const reference = generateBookingReference()
      setBookingReference(reference)

      const bookingData: CreateBookingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        selectedBedIds: formData.selectedBedIds,
        roomId: room.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        specialRequests: formData.specialRequests,
      }

      await createBooking.mutateAsync(bookingData)

      handleNextStep()
    } catch (error) {
      toast.error(t("bookingError"))
    }
  }, [
    createBooking,
    formData,
    room.id,
    t,
    handleNextStep,
    runValidationAndSetErrors,
  ])

  const downloadConfirmation = useCallback(() => {
    const confirmationData = {
      bookingReference,
      room: room.name,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.selectedBedIds.length,
      totalPrice: formattedTotalPrice,
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    }

    const dataStr = JSON.stringify(confirmationData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `booking-confirmation-${bookingReference}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [bookingReference, room.name, formData, formattedTotalPrice])

  const shareBooking = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Booking Confirmation",
        text: `Booking confirmed for ${room.name}. Reference: ${bookingReference}`,
        url: window.location.href,
      })
    } else {
      document.execCommand("copy")
      toast.success("Booking reference copied to clipboard!")
    }
  }, [bookingReference, room.name])

  const stepsConfig = [
    { id: 1, name: t("step1"), icon: Calendar, color: "bg-blue-500" },
    { id: 2, name: t("step2"), icon: BedIcon, color: "bg-green-500" },
    { id: 3, name: t("step3"), icon: User, color: "bg-purple-500" },
    { id: 4, name: t("step4"), icon: CreditCard, color: "bg-orange-500" },
    { id: 5, name: t("step5"), icon: CheckCircle, color: "bg-emerald-500" },
  ]

  const roomAmenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Car, label: "Parking" },
    { icon: Coffee, label: "Coffee" },
    { icon: Tv, label: "TV" },
  ]

  const renderBedCards = (bedType: "TOP" | "BOTTOM") => {
    // ... остальной код renderBedCards без изменений
    const filteredBeds = beds.filter((bed) => bed.tier === bedType)
    if (filteredBeds.length === 0) {
      return null
    }
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-gray-800">
          {bedType === "TOP" ? t("topBunks") : t("bottomBunks")}
        </h3>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredBeds.map((bed, index) => (
            <motion.div
              key={bed.id}
              variants={bedCardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 border-2 aspect-square relative overflow-hidden",
                  bed.available
                    ? "border-gray-200 hover:border-primary-600 hover:shadow-xl"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70",
                  formData.selectedBedIds.includes(bed.id) &&
                    "border-primary-600 ring-4 ring-primary-100 shadow-xl bg-gradient-to-br from-primary-50 to-primary-100"
                )}
                onClick={() => bed.available && handleBedSelection(bed.id)}
              >
                {formData.selectedBedIds.includes(bed.id) && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </motion.div>
                )}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <BedIcon
                    className={cn(
                      "w-10 h-10",
                      bed.available ? "text-gray-700" : "text-gray-400"
                    )}
                  />
                  {bed.tier === "TOP" && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-[10px] font-bold text-gray-600">
                        ▲
                      </span>
                    </motion.div>
                  )}
                  {bed.tier === "BOTTOM" && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-[10px] font-bold text-gray-600">
                        ▼
                      </span>
                    </motion.div>
                  )}
                </motion.div>
                <span className="font-semibold text-sm text-center">
                  {t("bed") + " " + bed.number}
                </span>
                {bed.available ? (
                  <Badge
                    variant="default"
                    className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    {t("available")}
                  </Badge>
                ) : (
                  <div className="flex flex-col text-center text-xs text-gray-500 font-medium">
                    {bed.bookedPeriods.length > 0 ? (
                      bed.bookedPeriods.map((period, periodIndex) => (
                        <span key={periodIndex} className="block leading-tight">
                          {dayjs(period.start).format("MMM D")} -{" "}
                          {dayjs(period.end).format("MMM D")}
                        </span>
                      ))
                    ) : (
                      <span className="block">{t("booked")}</span>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          // ... без изменений
          <motion.div
            key={1}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t("selectDates")}
              </h2>
              <p className="text-gray-600">{t("selectYourDates")}</p>
            </motion.div>

            <motion.div
              className="max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="font-semibold text-lg mb-4 block text-center">
                {t("selectDates")}
              </Label>
              <DateRangePicker
                onDateRangeChange={handleDateChange}
                initialDateRange={{
                  from: formData.checkIn,
                  to: formData.checkOut,
                }}
              />

              <div className="mt-6 rounded-xl p-6 ">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("check_in")}
                    </h3>
                    <p className="text-2xl font-bold text-primary-500">14:00</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("check_out")}
                    </h3>
                    <p className="text-2xl font-bold text-red-500">12:00</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t ">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t("fixed_check_in_out_time")}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      case 2:
        return (
          // ... без изменений
          <motion.div
            key={2}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Select Your Beds
              </h2>
              <p className="text-gray-600">
                Choose from available beds for your stay
              </p>
            </motion.div>

            {isLoadingBeds ? (
              <motion.div
                className="flex items-center justify-center h-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-600">{t("loadingBeds")}</p>
                </div>
              </motion.div>
            ) : bedsError ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{t("errorFetchingBeds")}</p>
              </motion.div>
            ) : beds.length > 0 ? (
              <div className="space-y-8">
                {renderBedCards("TOP")}
                {renderBedCards("BOTTOM")}
              </div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <BedIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t("noBedsAvailable")}</p>
              </motion.div>
            )}

            {formData.selectedBedIds.length > 0 && (
              <motion.div
                className="mt-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 text-blue-800">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">
                    {t("selectedBeds")}: {formData.selectedBedIds.length} /{" "}
                    {room.capacity}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )
      case 3:
        return (
          // ... без изменений
          <motion.div
            key={3}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t("form_header")}
              </h2>
              <p className="text-gray-600">{t("subtitle")}</p>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerItem}
              >
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Label htmlFor="firstName" className="mb-2 block font-medium">
                    {t("firstName")} *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                      setFormErrors((prev) => ({ ...prev, firstName: "" }))
                    }}
                    className={cn(
                      "h-12 transition-all duration-200",
                      formErrors.firstName &&
                        "border-red-500 focus:border-red-500"
                    )}
                    placeholder={t("firstName_placeholder")}
                  />
                  {formErrors.firstName && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {formErrors.firstName}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Label htmlFor="lastName" className="mb-2 block font-medium">
                    {t("lastName")} *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                      setFormErrors((prev) => ({ ...prev, lastName: "" }))
                    }}
                    className={cn(
                      "h-12 transition-all duration-200",
                      formErrors.lastName &&
                        "border-red-500 focus:border-red-500"
                    )}
                    placeholder={t("lastName_placeholder")}
                  />
                  {formErrors.lastName && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {formErrors.lastName}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerItem}
              >
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Label htmlFor="email" className="mb-2 block font-medium">
                    {t("email")} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                      setFormErrors((prev) => ({ ...prev, email: "" }))
                    }}
                    className={cn(
                      "h-12 transition-all duration-200",
                      formErrors.email && "border-red-500 focus:border-red-500"
                    )}
                    placeholder={t("email_placeholder")}
                  />
                  {formErrors.email && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {formErrors.email}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Label htmlFor="phone" className="mb-2 block font-medium">
                    {t("phone")} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                      setFormErrors((prev) => ({ ...prev, phone: "" }))
                    }}
                    className={cn(
                      "h-12 transition-all duration-200",
                      formErrors.phone && "border-red-500 focus:border-red-500"
                    )}
                    placeholder={t("phone_placeholder")}
                  />
                  {formErrors.phone && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {formErrors.phone}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Label
                  htmlFor="specialRequests"
                  className="mb-2 block font-medium"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  {t("specialRequests")}
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialRequests: e.target.value,
                    }))
                  }
                  className="min-h-[100px] resize-none transition-all duration-200"
                  placeholder={t("specialRequestsPlaceholder")}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            key={4}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t("confirmYourBookingTitle")}
              </h2>
              <p className="text-gray-600">{t("confirmYourBookingSubtitle")}</p>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border shadow-sm space-y-4"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* ... (детали бронирования без изменений) */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">{t("room")}</span>
                  <span className="font-semibold text-gray-800">
                    {room.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">
                    {t("checkIn")}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {dayjs(formData.checkIn).format("MMM DD, YYYY")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">
                    {t("checkOut")}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {dayjs(formData.checkOut).format("MMM DD, YYYY")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">
                    {t("nights")}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {t("nights", { count: nights })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">
                    {t("selectedBeds")}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {t("bed", { count: formData.selectedBedIds.length })}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Header */}
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {t("total")}
                      </h3>

                      {hasDiscount && (
                        <motion.div
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-md"
                          initial={{ scale: 0, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                            delay: 0.4,
                          }}
                        >
                          -{discountData?.discountPercentage}% OFF
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Discount Information */}
                    {hasDiscount && discountData && (
                      <motion.div
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Первоначальная цена:
                          </span>
                          <motion.span
                            className="text-2xl font-bold line-through text-slate-400 dark:text-slate-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {new Intl.NumberFormat("ru-RU", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(discountData.originalPrice)}{" "}
                            {t("currency")}
                          </motion.span>
                        </div>

                        <motion.div
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {t("ecconomy")}:
                          </span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {new Intl.NumberFormat("ru-RU", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(discountData.discountAmount)}{" "}
                            {t("currency")}
                          </span>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Final Price */}
                    <motion.div
                      className="text-center py-4"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {isPriceLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                      ) : (
                        <motion.div
                          key={
                            hasDiscount
                              ? discountData?.discountedPrice
                              : totalPrice
                          }
                          className="text-5xl font-black bg-gradient-to-r from-primary-600 via-primary-600 to-primary-500 bg-clip-text text-transparent"
                          initial={{ scale: 0, rotate: -5 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.2,
                          }}
                        >
                          {hasDiscount && discountData
                            ? new Intl.NumberFormat("ru-RU", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(discountData.discountedPrice)
                            : formattedTotalPrice}{" "}
                          <span className="text-2xl">{t("currency")}</span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Decorative Elements */}
                    <motion.div
                      className="flex justify-center space-x-2 pt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gradient-to-r from-blue-400 to-primary-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.9 + i * 0.1 }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(!!checked)
                    setFormErrors((prev) => ({ ...prev, terms: "" }))
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="terms"
                    className="font-medium leading-relaxed cursor-pointer"
                  >
                    {t("termsAndConditions")}
                  </label>
                  {formErrors.terms && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {formErrors.terms}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Secure Booking
                  </span>
                </div>
                <p className="text-sm text-yellow-800">{t("paymentText")}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )
      case 5:
        return (
          // ... без изменений
          <motion.div
            key={5}
            className="text-center py-12 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                <CheckCircle className="w-16 h-16 text-green-600" />
              </motion.div>

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, Math.cos((i * 60 * Math.PI) / 180) * 40],
                    y: [0, Math.sin((i * 60 * Math.PI) / 180) * 40],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.8 + i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            <motion.h2
              className="text-3xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t("bookingConfirmedTitle")}
            </motion.h2>

            <motion.p
              className="text-gray-600 max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {t("bookingConfirmedText")}
            </motion.p>

            {bookingReference && (
              <motion.div
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border mb-8 w-full max-w-md shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <p className="text-sm text-gray-600 mb-2">
                  {t("bookingReference")}
                </p>
                <motion.p
                  className="text-2xl font-mono font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {bookingReference}
                </motion.p>
              </motion.div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={downloadConfirmation}
                  variant="outline"
                  className="flex-1 h-12 border-2 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("downloadConfirmation")}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={shareBooking}
                  variant="outline"
                  className="flex-1 h-12 border-2 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t("shareBooking")}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )
      default:
        return null
    }
  }

  const isNextDisabled = () => {
    // ... без изменений
    if (step === 1)
      return !formData.checkIn || !formData.checkOut || nights <= 0
    if (step === 2) return formData.selectedBedIds.length === 0
    if (step === 3) {
      const [isValid] = validateCurrentStepFields()
      return !isValid
    }
    if (step === 4) return !agreedToTerms || isPriceLoading // ИЗМЕНЕНО: Блокируем кнопку, пока цена грузится
    return false
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ... (Header без изменений) */}
      <motion.div
        className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {onClose && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t("bookingTitle")}
              </motion.h1>
            </div>
            <motion.div
              className="text-sm text-gray-600"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t("bookingSubtitle")}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div
        ref={pageTopRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg border p-6 sticky top-24 overflow-hidden"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {/* ... (Карточка с информацией о комнате без изменений) */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Image
                  src={
                    process.env.NEXT_PUBLIC_STATIC_ASSETS_URL +
                      room.images[0] ||
                    "/placeholder.svg?height=200&width=300&query=room interior" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={room.name}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full aspect-[3/2] mb-4 shadow-sm"
                />
              </motion.div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-800">{room.name}</h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">{room.categoryName}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {roomAmenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-xs text-gray-600"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <amenity.icon className="w-3 h-3" />
                      <span>{amenity.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <motion.div
                  className="flex items-center gap-3 text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Calendar className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>
                    {nights > 0
                      ? t("nights", { count: nights })
                      : t("selectDates")}
                  </span>
                </motion.div>
                {formData.selectedBedIds.length > 0 && (
                  <motion.div
                    className="flex items-center gap-3 text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Users className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span>
                      {t("selectedBeds")}: {formData.selectedBedIds.length}
                    </span>
                  </motion.div>
                )}
              </div>

              <motion.div
                className="mt-6 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <span className="font-semibold text-gray-800">
                    {t("total")}
                  </span>

                  <div className="flex flex-col items-end">
                    {hasDiscount && (
                      <motion.div
                        className="flex items-center space-x-2 mb-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="text-xs line-through text-gray-400">
                          {new Intl.NumberFormat("ru-RU", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(discountData.originalPrice) +
                            " " +
                            t("currency")}
                        </span>
                        <motion.span
                          className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            delay: 0.4,
                          }}
                        >
                          -{discountData.discountPercentage}%
                        </motion.span>
                      </motion.div>
                    )}

                    {/* ИЗМЕНЕНО: Добавлена проверка на загрузку цены */}
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                      {isPriceLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                      ) : (
                        <motion.span
                          key={
                            hasDiscount
                              ? discountData.discountedPrice
                              : totalPrice
                          }
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          {hasDiscount
                            ? new Intl.NumberFormat("ru-RU", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(discountData.discountedPrice) +
                              " " +
                              t("currency")
                            : formattedTotalPrice}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ... (Правая колонка с шагами) */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg border overflow-hidden"
              variants={cardVariants}
              initial="initial"
              animate="animate"
            >
              {/* ... (Шаги 1, 2, 3, 5 без изменений) */}
              {step < 5 && (
                <motion.div
                  className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-between">
                    {stepsConfig.map((s, index) => (
                      <React.Fragment key={s.id}>
                        <motion.div
                          className="flex flex-col items-center gap-2 flex-1 relative z-10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <motion.div
                            className={cn(
                              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 font-bold relative overflow-hidden",
                              step >= s.id
                                ? "bg-primary-500 text-white" // Changed to white for better contrast with color background
                                : "bg-gray-200 text-gray-500"
                            )}
                            style={{
                              background:
                                step >= s.id
                                  ? `linear-gradient(135deg, ${s.color.replace(
                                      "bg-",
                                      ""
                                    )}, ${s.color.replace("bg-", "")}dd)`
                                  : undefined,
                            }}
                            whileHover={{ scale: 1.1 }}
                            animate={
                              step === s.id ? { scale: [1, 1.1, 1] } : {}
                            }
                            transition={{ duration: 0.5 }}
                          >
                            {step > s.id ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              >
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.div>
                            ) : (
                              <s.icon
                                className={cn(
                                  "w-4 h-4 sm:w-5 sm:h-5",
                                  step >= s.id ? "text-white" : ""
                                )}
                              />
                            )}
                          </motion.div>
                          <span
                            className={cn(
                              "text-[10px] sm:text-sm font-medium text-center transition-colors duration-300",
                              step >= s.id ? "text-gray-800" : "text-gray-500",
                              "hidden sm:block"
                            )}
                          >
                            {s.name}
                          </span>
                        </motion.div>
                        {index < stepsConfig.length - 1 && (
                          <motion.div
                            className="flex-1 h-0.5 -mx-2 sm:-mx-4 mt-[-2rem] bg-gray-200 relative overflow-hidden"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              delay: 0.8 + index * 0.1,
                              duration: 0.5,
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: step > s.id ? 1 : 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              style={{ transformOrigin: "left" }}
                            />
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="p-6 min-h-[500px]">
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>
              </div>

              <motion.div
                className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {step < 5 ? (
                  <div className="flex justify-between gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        disabled={step === 1}
                        className="h-12 px-8 border-2 bg-transparent"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t("back")}
                      </Button>
                    </motion.div>
                    {step < 4 ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleNextStep}
                          disabled={isNextDisabled()}
                          className="h-12 px-8"
                        >
                          {t("next")} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={createBooking.isPending || isNextDisabled()}
                          className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {createBooking.isPending && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="w-4 h-4 mr-2" />
                            </motion.div>
                          )}
                          {t("confirmAndBook")}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => router.push("/")}
                        className="h-12 px-8"
                      >
                        {t("close")}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

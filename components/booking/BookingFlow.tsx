"use client"

import dayjs from "dayjs"
import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/DateRangePicker"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { useCreateBooking } from "@/hooks/useBookings"
import type { Room } from "@/lib/types"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  CreditCard,
  Loader2,
  User,
  Users,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface BookingFlowProps {
  room: Room
  children: React.ReactNode
}

export function BookingFlow({ room, children }: BookingFlowProps) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const createBooking = useCreateBooking()

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const diff = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diff > 0 ? diff : 0
  }, [formData.checkIn, formData.checkOut])

  console.log(nights)

  const totalPrice = useMemo(() => nights * room.price, [nights, room.price])

  const handleDateChange = (range: { from?: string; to?: string }) => {
    setFormData((prev) => ({
      ...prev,
      checkIn: range.from ? range.from : "",
      checkOut: range.to ? range.to : "",
    }))
  }

  const resetFlow = () => {
    setStep(1)
    setFormData({
      checkIn: "",
      checkOut: "",
      guests: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetFlow()
    }
  }

  const handleNextStep = () => setStep((s) => s + 1)
  const handlePrevStep = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    try {
      await createBooking.mutateAsync({
        ...formData,
        roomId: room.id,
        totalPrice,
      })
      toast.success(t("bookingConfirmedTitle"))
      handleNextStep() // Move to success step
    } catch (error) {
      toast.error(t("bookingError"))
    }
  }

  const stepsConfig = [
    { id: 1, name: t("step1"), icon: Calendar },
    { id: 2, name: t("step2"), icon: User },
    { id: 3, name: t("step3"), icon: CreditCard },
  ]

  const renderStepContent = () => {
    const variants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    }

    switch (step) {
      case 1: // Dates and Guests
        return (
          <motion.div
            key={1}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="space-y-6">
              <div>
                <Label className="font-semibold">{t("selectDates")}</Label>
                <DateRangePicker onDateRangeChange={handleDateChange} />
              </div>
              <div>
                <Label htmlFor="guests" className="font-semibold">
                  {t("guests")}
                </Label>
                <Select
                  value={String(formData.guests)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, guests: Number(value) }))
                  }
                >
                  <SelectTrigger id="guests" className="mt-2">
                    <SelectValue placeholder={t("selectGuests")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map(
                      (guestCount) => (
                        <SelectItem key={guestCount} value={String(guestCount)}>
                          {guestCount} {t("guestForms", { count: guestCount })}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )
      case 2: // User Info
        return (
          <motion.div
            key={2}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </div>
          </motion.div>
        )
      case 3: // Confirmation
        return (
          <motion.div
            key={3}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="space-y-4 text-sm">
              <p>{t("confirmBookingDetails")}</p>
              <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("room")}</span>
                  <span className="font-semibold">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkIn")}</span>
                  <span className="font-semibold">
                    {dayjs(formData.checkIn).format("DD.MM.YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkOut")}</span>
                  <span className="font-semibold">
                    {dayjs(formData.checkOut).format("DD.MM.YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("guests")}</span>
                  <span className="font-semibold">
                    {t("guestForms", { count: formData.guests })}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>
                    {totalPrice} {t("currency")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{t("paymentText")}</p>
            </div>
          </motion.div>
        )
      case 4: // Success
        return (
          <motion.div
            key={4}
            className="text-center py-8 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {t("bookingConfirmedTitle")}
            </h2>
            <p className="text-gray-600">{t("bookingConfirmedText")}</p>
          </motion.div>
        )
      default:
        return null
    }
  }

  const isNextDisabled = () => {
    if (step === 1)
      return !formData.checkIn || !formData.checkOut || nights <= 0
    if (step === 2)
      return (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      )
    return false
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="flex">
          {/* Left Panel */}
          <div className="hidden sm:block w-1/3 bg-gray-50 p-6 border-r">
            <div className="sticky top-6">
              <Image
                src={room.images[0] || "/placeholder.svg"}
                alt={room.name}
                width={200}
                height={150}
                className="rounded-lg object-cover w-full mb-4"
              />
              <h3 className="font-bold text-lg">{room.name}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                {room.categoryName}
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <span>
                    {nights > 0
                      ? t("nights", { count: nights })
                      : t("selectDates")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-600" />
                  <span>{t("guestForms", { count: formData.guests })}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{t("total")}</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {totalPrice} {t("currency")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {t("bookingTitle")}
              </DialogTitle>
              <DialogDescription>{t("bookingSubtitle")}</DialogDescription>
            </DialogHeader>

            {step < 4 && (
              <div className="flex items-center gap-4 my-6">
                {stepsConfig.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          step >= s.id
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step > s.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <s.icon className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step >= s.id ? "text-primary-600" : "text-gray-500"
                        }`}
                      >
                        {s.name}
                      </span>
                    </div>
                    {index < stepsConfig.length - 1 && (
                      <div className="flex-1 h-0.5 bg-gray-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </div>

            <DialogFooter className="mt-8">
              {step < 4 ? (
                <div className="w-full flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t("back")}
                  </Button>
                  {step < 3 ? (
                    <Button
                      onClick={handleNextStep}
                      disabled={isNextDisabled()}
                    >
                      {t("next")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {t("confirmAndBook")}
                    </Button>
                  )}
                </div>
              ) : (
                <DialogClose asChild>
                  <Button className="w-full">{t("close")}</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

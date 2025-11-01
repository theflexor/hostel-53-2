"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import {
  MapPin,
  Phone,
  MessageCircleIcon,
  Clock,
  CheckIcon,
  InstagramIcon,
  FacebookIcon,
} from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { sendContactMessage } from "@/lib/api"

interface ContactFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  subject: string
  message: string
}

export function ContactPage() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { control, handleSubmit, reset } = useForm<ContactFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await sendContactMessage(data)
      alert(t("bookingConfirmedText"))
      reset()
    } catch (error) {
      console.error("Failed to send contact message:", error)
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send message"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("contactTitle")}
            </h1>
            <p className="text-lg text-gray-600">{t("contactSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {t("contactInfo")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {t("address")}
                      </h3>
                      <p className="text-gray-600">
                        {t("addressValue")}
                        <br />
                        <p>{t("location")}</p>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {t("phone")}
                      </h3>
                      <Link
                        href="tel:+996557530053"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        +996 (557) 53-00-53
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MessageCircleIcon className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                      <Link
                        href="https://wa.me/996557530053"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        +996 (557) 53-00-53
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {t("workingHours")}
                      </h3>
                      <p className="text-gray-600">{t("workingHoursValue")}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {t("socialMedia")}
                </h3>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <InstagramIcon className="h-8 w-8" />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <FacebookIcon className="h-8 w-8" />
                  </Link>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {t("howToGetHere")}
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>{t("howToGetHereText1")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>{t("howToGetHereText2")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>{t("howToGetHereText3")}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t("sendMessage")}
              </h2>
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("firstName")} *
                    </label>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input {...field} />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("lastName")} *
                    </label>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input {...field} />}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("phone")} *
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email")}
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("specialRequests")}
                  </label>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("specialRequests")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">{t("book")}</SelectItem>
                          <SelectItem value="info">
                            {t("information")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("sendMessage")}
                  </label>
                  <Controller
                    name="message"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Textarea {...field} rows={5} />}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("sending") || "Sending..."
                    : t("sendMessage")}
                </Button>
              </form>
            </Card>
          </div>

          <Card className="mt-12 p-8 text-center bg-gray-100">
            <MapPin className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("interactiveMap")}
            </h3>
            <p className="text-gray-600 mb-4">{t("addressValue")}</p>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
              {t("openInGoogleMaps")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

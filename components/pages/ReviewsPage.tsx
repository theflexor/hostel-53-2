"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Quote, PlusCircle, Send, Loader2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { fetchAllReviews, submitReviewByToken } from "@/lib/api"
import { useParams, useSearchParams } from "next/navigation"

// Определение типов (если они не импортируются из API-файла)
interface Review {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  email: string
  rating: number
  comment: string
}

interface ReviewRequestPayload {
  name: string
  email: string
  rating: number
  comment: string
}
// ***************************************************************

// Helper to determine initial avatar based on name (not in API, but used in UI)
const getAvatarPlaceholder = (name: string) => {
  return `/placeholder.svg?text=${name.charAt(0)}`
}

export function ReviewsPage() {
  const searchParams = useSearchParams() // URLSearchParams
  const token = searchParams.get("token")
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State to match API payload fields
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 0,
  })

  // 2. ФЕТЧИНГ РЕВЬЮ (ПОДКЛЮЧЕНО К API)
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // ИСПОЛЬЗУЕТСЯ РЕАЛЬНАЯ API ФУНКЦИЯ
        const fetchedReviews = await fetchAllReviews()

        setReviews(
          fetchedReviews.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      } catch (err) {
        console.error(err)
        setError(
          t("errorFetchingReviews") || "Failed to load reviews from server."
        )
      } finally {
        setIsLoading(false)
      }
    }
    loadReviews()
  }, [t])

  const overallStats = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] }
    }
    const total = reviews.length
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const average = Number.parseFloat((sum / total).toFixed(1))

    const distribution = [1, 2, 3, 4, 5].map(
      (star) => (reviews.filter((r) => r.rating === star).length / total) * 100
    )
    return { average, total, distribution }
  }, [reviews])

  const renderStars = (rating: number, className = "h-5 w-5") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${className} ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  // 3. ОТПРАВКА РЕВЬЮ (ПОДКЛЮЧЕНО К API)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      newReview.rating === 0 ||
      !newReview.name ||
      !newReview.comment ||
      !newReview.email
    ) {
      alert(t("allFieldsRequired") || "Please fill in all fields.")
      return
    }

    setIsSubmitting(true)

    try {
      // !!! ВАЖНО: ЗАМЕНИТЕ "MOCK_TOKEN" на реальную логику получения токена.
      // Без токена бэкенд вернет ошибку 400/403.
      await submitReviewByToken(token!, {
        name: newReview.name,
        email: newReview.email,
        rating: newReview.rating,
        comment: newReview.comment,
      } as ReviewRequestPayload)

      // Если отправка успешна, обновляем список:

      // 1. Создаем временный объект ревью для отображения (пока не перезагрузим весь список)
      const mockNewReview: Review = {
        id: Date.now(), // Используем текущее время как временный ID
        name: newReview.name,
        email: newReview.email,
        comment: newReview.comment,
        rating: newReview.rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any

      // Добавляем новое ревью в начало списка
      setReviews([mockNewReview, ...reviews])

      // 2. Очищаем форму и закрываем модал
      setNewReview({ name: "", email: "", comment: "", rating: 0 })
      setIsReviewModalOpen(false)
    } catch (err) {
      console.error("Submission error:", err)
      // Показываем ошибку пользователю
      alert(
        `${t("submissionFailed") || "Submission failed"}: ${
          (err as Error).message
        }`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("reviewsTitle")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("reviewsSubtitle")}
            </p>
          </div>

          {/* Overall Stats */}
          <Card className="mb-12 shadow-lg">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 border-gray-200">
                <span className="text-5xl font-bold text-primary-600">
                  {overallStats.average}
                </span>
                <div className="flex my-2">
                  {renderStars(overallStats.average)}
                </div>
                <p className="text-gray-500">
                  {t("basedOn")} {overallStats.total} {t("reviews")}
                </p>
              </div>
              <div className="col-span-2 space-y-2">
                <h3 className="text-lg font-semibold text-center mb-4">
                  {t("ratingDistribution")}
                </h3>
                {overallStats.distribution
                  .map((percentage, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span>{5 - index}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                          className="bg-yellow-400 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        />
                      </div>
                      <span className="font-medium text-gray-600 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  ))
                  .reverse()}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => setIsReviewModalOpen(true)}
              className="rounded-full shadow-lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {t("addReview")}
            </Button>
          </div>

          {/* Loading, Error, and Reviews List */}
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500 mr-2" />
              <p className="text-lg text-gray-600">{t("loadingReviews")}</p>
            </div>
          )}

          {error && (
            <div className="text-center p-6 text-red-600 border border-red-200 bg-red-50 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && reviews.length === 0 && (
            <div className="text-center p-6 text-gray-600 border border-gray-200 bg-white rounded-lg">
              <p>{t("noReviewsYet")}</p>
            </div>
          )}

          {!isLoading && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col bg-white shadow-soft hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                          <Image
                            src={getAvatarPlaceholder(review.name)}
                            alt={review.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {review.name}
                            </h3>
                            <div className="flex">
                              {renderStars(review.rating, "h-4 w-4")}
                            </div>
                          </div>
                        </div>
                        <div className="relative flex-grow">
                          <Quote className="absolute top-0 left-0 h-10 w-10 text-primary-100" />
                          <p className="text-gray-600 leading-relaxed z-10 relative pl-4 pt-4">
                            "{review.comment}"
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-right">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addReview")}</DialogTitle>
            <DialogDescription>{t("reviewsSubtitle")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name">{t("yourName")}</Label>
              <Input
                id="name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="email">{t("yourEmail")}</Label>
              <Input
                id="email"
                type="email"
                value={newReview.email}
                onChange={(e) =>
                  setNewReview({ ...newReview, email: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>{t("yourRating")}</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-all ${
                      star <= newReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    // В React компонентах атрибут disabled для Star (Lucide icon) может не работать,
                    // его лучше применить к родительскому div или управлять логикой.
                    // В данном случае, оставим только для кнопки.
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">{t("yourReview")}</Label>
              <Textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? t("submitting") : t("submitReview")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

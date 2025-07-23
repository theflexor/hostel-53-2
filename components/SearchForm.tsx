"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DateRangePicker } from "@/components/DateRangePicker"
import { useSearchRooms, type SearchFilters, type Room } from "@/hooks/useRooms"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { SearchIcon, LoaderIcon } from "lucide-react"
import { toast } from "sonner"

interface SearchFormProps {
  onSearch: (results: Room[]) => void
  onSearchStart: () => void
}

export function SearchForm({ onSearch, onSearchStart }: SearchFormProps) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const searchRooms = useSearchRooms()

  const [filters, setFilters] = useState<SearchFilters>({
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [500, 2000],
    roomType: "any",
    capacity: "any",
  })

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setFilters((prev) => ({
      ...prev,
      checkIn: range.from ? range.from.toISOString().split("T")[0] : "",
      checkOut: range.to ? range.to.toISOString().split("T")[0] : "",
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    onSearchStart()

    try {
      const results = await searchRooms.mutateAsync(filters)
      onSearch(results)

      toast.success(
        language === "en"
          ? `Found ${results.length} rooms`
          : language === "ru"
          ? `Найдено ${results.length} номеров`
          : `${results.length} бөлмө табылды`
      )
    } catch (error) {
      toast.error(
        language === "en"
          ? "Search failed. Please try again."
          : language === "ru"
          ? "Поиск не удался. Попробуйте снова."
          : "Издөө ийгиликсиз болду. Кайра аракет кылыңыз."
      )
    }
  }

  return (
    <form onSubmit={handleSearch} className="p-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("searchRooms")}
        </h2>
        <p className="text-gray-600">
          {language === "en"
            ? "Find the perfect room for your stay"
            : language === "ru"
            ? "Найдите идеальный номер для проживания"
            : "Жашоо үчүн идеалдуу бөлмө табыңыз"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Date Range */}
        <div className="lg:col-span-2">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            {t("checkIn")} / {t("checkOut")}
          </Label>
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            className="w-full"
          />
        </div>

        {/* Guests */}
        <div>
          <Label
            htmlFor="guests-select"
            className="text-sm font-semibold text-gray-700 mb-3 block"
          >
            {t("guests")}
          </Label>
          <Select
            value={filters.guests?.toString() ?? "1"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                guests: Number.parseInt(value),
              }))
            }
          >
            <SelectTrigger
              id="guests-select"
              className="w-full rounded-xl border-gray-200 focus:border-sky-400 focus:ring-sky-400"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {t(num === 1 ? "guest" : "guests")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Type */}
        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            {t("roomType")}
          </Label>
          <Select
            value={filters.roomType}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, roomType: value }))
            }
          >
            <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-sky-400 focus:ring-sky-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("any")}</SelectItem>
              <SelectItem value="male">{t("male")}</SelectItem>
              <SelectItem value="female">{t("female")}</SelectItem>
              <SelectItem value="mixed">{t("mixed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-4 block">
          {t("priceRange")}: {filters.priceRange[0]} - {filters.priceRange[1]}{" "}
          {language === "en" ? "s" : "с"}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: value as [number, number],
            }))
          }
          max={3000}
          min={500}
          step={100}
          className="w-full"
        />
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          disabled={searchRooms.isPending}
          className="bg-sky-gradient hover:shadow-lg text-white px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searchRooms.isPending ? (
            <>
              <LoaderIcon className="mr-3 h-5 w-5 animate-spin" />
              {language === "en"
                ? "Searching..."
                : language === "ru"
                ? "Поиск..."
                : "Издөөдө..."}
            </>
          ) : (
            <>
              <SearchIcon className="mr-3 h-5 w-5" />
              {t("search")}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

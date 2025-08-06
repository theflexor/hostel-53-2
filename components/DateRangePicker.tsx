"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ru, enUS } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLanguage } from "@/hooks/useLanguage"

interface DateRangePickerProps {
  onDateRangeChange: (range: { from?: string; to?: string }) => void
  className?: string
}

export function DateRangePicker({
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const { language } = useLanguage()
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = React.useCallback(
    (newDate: DateRange | undefined) => {
      setDate(newDate)

      const formatToDateTime = (date?: Date) =>
        date
          ? date.toISOString().slice(0, 19) // убираем миллисекунды и 'Z'
          : undefined

      onDateRangeChange({
        from: formatToDateTime(newDate?.from),
        to: formatToDateTime(newDate?.to),
      })

      if (newDate?.from && newDate?.to) {
        setIsOpen(false)
      }
    },
    [onDateRangeChange]
  )

  const formatDate = (date: Date) => {
    const locale = language === "ru" ? ru : language === "ky" ? ru : enUS
    return format(date, "dd MMM yyyy", { locale })
  }

  const getPlaceholderText = () => {
    if (language === "en") return "Check-in → Check-out"
    if (language === "ru") return "Заезд → Выезд"
    return "Келүү → Кетүү"
  }

  const getFromToText = () => {
    const fromText =
      language === "en" ? "From" : language === "ru" ? "С" : "Башынан"
    const toText = language === "en" ? "To" : language === "ru" ? "До" : "Чейин"
    return { fromText, toText }
  }

  const { fromText, toText } = getFromToText()

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal rounded-xl border-gray-200 hover:border-primary-400 h-12",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary-500" />
            {date?.from ? (
              date.to ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 font-medium">
                    {fromText}:
                  </span>
                  <span className="font-semibold">{formatDate(date.from)}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-primary-600 font-medium">
                    {toText}:
                  </span>
                  <span className="font-semibold">{formatDate(date.to)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 font-medium">
                    {fromText}:
                  </span>
                  <span className="font-semibold">{formatDate(date.from)}</span>
                  <span className="text-gray-400 text-sm">
                    (
                    {language === "en"
                      ? "select end date"
                      : language === "ru"
                      ? "выберите дату выезда"
                      : "чыгуу күнүн тандаңыз"}
                    )
                  </span>
                </div>
              )
            ) : (
              <span>{getPlaceholderText()}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 border-b bg-primary-50">
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === "en"
                  ? "Select your stay dates"
                  : language === "ru"
                  ? "Выберите даты проживания"
                  : "Жашоо күндөрүн тандаңыз"}
              </h3>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span>{fromText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>{toText}</span>
                </div>
              </div>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={(date) => date < new Date()}
            locale={language === "ru" ? ru : language === "ky" ? ru : enUS}
            className="rounded-md"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary-100 rounded-md transition-colors",
              day_selected:
                "bg-primary-500 text-white hover:bg-primary-600 focus:bg-primary-600",
              day_range_start:
                "bg-primary-500 text-white rounded-l-md hover:bg-primary-600",
              day_range_end:
                "bg-green-500 text-white rounded-r-md hover:bg-green-600",
              day_range_middle:
                "bg-primary-100 text-primary-900 hover:bg-primary-200",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled:
                "text-muted-foreground opacity-50 cursor-not-allowed",
              day_hidden: "invisible",
            }}
          />
          {date?.from && date?.to && (
            <div className="p-4 border-t bg-green-50">
              <div className="text-center">
                <p className="text-sm text-green-700 font-medium">
                  {language === "en"
                    ? "Selected period:"
                    : language === "ru"
                    ? "Выбранный период:"
                    : "Тандалган мөөнөт:"}
                </p>
                <p className="text-lg font-bold text-green-800 mt-1">
                  {formatDate(date.from)} → {formatDate(date.to)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.ceil(
                    (date.to.getTime() - date.from.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  {language === "en"
                    ? "nights"
                    : language === "ru"
                    ? "ночей"
                    : "түн"}
                </p>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckIcon } from "lucide-react"
import type { Language } from "@/hooks/useLanguage"

interface PriceRangeSelectorProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (min: number, max: number) => void
  language: Language
}

const pricePresets = [
  { min: 500, max: 1000, label: { en: "Budget", ru: "Эконом", ky: "Арзан" } },
  { min: 800, max: 1300, label: { en: "Standard", ru: "Стандарт", ky: "Стандарт" } },
  { min: 1200, max: 1800, label: { en: "Comfort", ru: "Комфорт", ky: "Ыңгайлуу" } },
  { min: 1500, max: 2500, label: { en: "Premium", ru: "Премиум", ky: "Премиум" } },
]

export function PriceRangeSelector({ minPrice, maxPrice, onPriceChange, language }: PriceRangeSelectorProps) {
  const [customMode, setCustomMode] = useState(false)
  const [tempMin, setTempMin] = useState(minPrice.toString())
  const [tempMax, setTempMax] = useState(maxPrice.toString())

  const handlePresetClick = (min: number, max: number) => {
    onPriceChange(min, max)
    setCustomMode(false)
    setTempMin(min.toString())
    setTempMax(max.toString())
  }

  const handleCustomApply = () => {
    const min = Math.max(0, Number.parseInt(tempMin) || 0)
    const max = Math.max(min + 100, Number.parseInt(tempMax) || min + 100)
    onPriceChange(min, max)
    setCustomMode(false)
  }

  const isPresetActive = (presetMin: number, presetMax: number) => {
    return minPrice === presetMin && maxPrice === presetMax
  }

  const currency = language === "en" ? "s" : "с"

  return (
    <div className="space-y-4">
      {/* Current Range Display */}
      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-200">
        <span className="text-sm font-medium text-gray-700">
          {language === "en" ? "Selected range:" : language === "ru" ? "Выбранный диапазон:" : "Тандалган диапазон:"}
        </span>
        <span className="text-lg font-bold text-primary-700">
          {minPrice} - {maxPrice} {currency}
        </span>
      </div>

      {/* Price Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {pricePresets.map((preset, index) => (
          <Button
            key={index}
            variant={isPresetActive(preset.min, preset.max) ? "default" : "outline"}
            onClick={() => handlePresetClick(preset.min, preset.max)}
            className={`relative p-3 h-auto flex flex-col items-center gap-1 rounded-xl transition-all duration-300 hover:scale-105 ${
              isPresetActive(preset.min, preset.max)
                ? "bg-primary-gradient text-white shadow-primary-glow border-0"
                : "border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50"
            }`}
          >
            {isPresetActive(preset.min, preset.max) && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckIcon className="h-3 w-3 text-white" />
              </div>
            )}
            <span className="text-xs font-semibold">{preset.label[language]}</span>
            <span className="text-xs opacity-80">
              {preset.min}-{preset.max} {currency}
            </span>
          </Button>
        ))}
      </div>

      {/* Custom Range */}
      <Card className="p-4 border-2 border-dashed border-primary-200 hover:border-primary-400 transition-colors duration-300">
        {!customMode ? (
          <Button
            variant="ghost"
            onClick={() => setCustomMode(true)}
            className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl"
          >
            {language === "en" ? "Set custom range" : language === "ru" ? "Задать свой диапазон" : "Өз диапазонун коюу"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {language === "en" ? "Min price" : language === "ru" ? "Мин. цена" : "Мин. баа"}
                </label>
                <Input
                  type="number"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="rounded-lg h-10 text-center"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {language === "en" ? "Max price" : language === "ru" ? "Макс. цена" : "Макс. баа"}
                </label>
                <Input
                  type="number"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="rounded-lg h-10 text-center"
                  placeholder="2000"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCustomApply}
                className="flex-1 bg-primary-gradient text-white rounded-lg h-9 text-sm"
              >
                {language === "en" ? "Apply" : language === "ru" ? "Применить" : "Колдонуу"}
              </Button>
              <Button variant="outline" onClick={() => setCustomMode(false)} className="flex-1 rounded-lg h-9 text-sm">
                {language === "en" ? "Cancel" : language === "ru" ? "Отмена" : "Жокко чыгаруу"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Popular Ranges Info */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 rounded-full border-primary-200 text-primary-700 bg-primary-50"
        >
          {language === "en"
            ? "Most popular: 1000-1500s"
            : language === "ru"
              ? "Популярно: 1000-1500с"
              : "Популярдуу: 1000-1500с"}
        </Badge>
        <Badge variant="outline" className="text-xs px-2 py-1 rounded-full border-green-200 text-green-700 bg-green-50">
          {language === "en"
            ? "Best value: 800-1300s"
            : language === "ru"
              ? "Выгодно: 800-1300с"
              : "Пайдалуу: 800-1300с"}
        </Badge>
      </div>
    </div>
  )
}

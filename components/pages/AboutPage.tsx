"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { usePaths } from "@/lib/routes"
import { heroMainImage, heroOutsideImage } from "@/public"
import { ShieldCheckIcon, HeartIcon, UsersIcon, CheckIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export function AboutPage() {
  const { t } = useTranslation()
  const paths = usePaths()

  // Принципы теперь берём из JSON переводов
  const principles = t("principles", { returnObjects: true }) as {
    title: string
    desc: string
  }[]

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("aboutTitle")}
            </h1>
            <p className="text-lg text-gray-600">{t("aboutSubtitle")}</p>
          </div>

          {/* История */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Image
                src={heroOutsideImage}
                alt="About Hostel 53"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {t("ourStory")}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t("ourStoryText1")}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("ourStoryText2")}
              </p>
            </div>
          </div>

          {/* Почему мы */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("whyUsTitle2")}</h3>
              <p className="text-gray-600">{t("whyUsDesc2")}</p>
            </Card>
            <Card className="text-center p-6">
              <HeartIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("whyUsTitle3")}</h3>
              <p className="text-gray-600">{t("whyUsDesc3")}</p>
            </Card>
            <Card className="text-center p-6">
              <UsersIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("joinCommunity")}
              </h3>
              <p className="text-gray-600">
                {t("joinCommunityText").substring(0, 60)}...
              </p>
            </Card>
          </div>

          {/* Принципы */}
          <div className="bg-primary-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              {t("ourPrinciples")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {principles?.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{p.title}</h4>
                    <p className="text-gray-600 text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Призыв */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("joinCommunity")}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("joinCommunityText")}
            </p>
            <Button
              asChild
              className="bg-primary-600 hover:bg-primary-700 text-white"
              size="lg"
            >
              <Link href={paths.contact}>{t("contactUs")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

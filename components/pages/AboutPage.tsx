"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { ShieldCheckIcon, HeartIcon, UsersIcon, CheckIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AboutPage() {
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  const principles = [
    {
      title: "Честность и прозрачность",
      desc: "Никаких скрытых платежей, все условия ясны и понятны",
    },
    {
      title: "Качество обслуживания",
      desc: "Мы всегда готовы помочь и решить любые вопросы",
    },
    { title: "Доступность", desc: "Справедливые цены без ущерба для качества" },
    {
      title: "Чистота и порядок",
      desc: "Ежедневная уборка и поддержание высоких стандартов",
    },
    {
      title: "Уважение к гостям",
      desc: "Каждый гость важен, независимо от срока проживания",
    },
    {
      title: "Постоянное развитие",
      desc: "Мы постоянно улучшаем наши услуги и условия",
    },
  ]

  const getLocalizedPrinciple = (title: string, desc: string) => {
    const map: {
      [key: string]: { [lang: string]: { title: string; desc: string } }
    } = {
      "Честность и прозрачность": {
        en: {
          title: "Honesty and Transparency",
          desc: "No hidden fees, all conditions are clear and understandable",
        },
        ky: {
          title: "Чынчылдык жана ачыктык",
          desc: "Жашыруун төлөмдөр жок, бардык шарттар так жана түшүнүктүү",
        },
      },
      "Качество обслуживания": {
        en: {
          title: "Quality Service",
          desc: "We are always ready to help and solve any issues",
        },
        ky: {
          title: "Сапаттуу тейлөө",
          desc: "Биз дайыма жардам берүүгө жана каалаган маселени чечүүгө даярбыз",
        },
      },
      Доступность: {
        en: {
          title: "Affordability",
          desc: "Fair prices without compromising quality",
        },
        ky: {
          title: "Жеткиликтүүлүк",
          desc: "Сапатка зыян келтирбестен адилеттүү баалар",
        },
      },
      "Чистота и порядок": {
        en: {
          title: "Cleanliness and Order",
          desc: "Daily cleaning and maintaining high standards",
        },
        ky: {
          title: "Тазалык жана тартип",
          desc: "Күнүмдүк тазалоо жана жогорку стандарттарды сактоо",
        },
      },
      "Уважение к гостям": {
        en: {
          title: "Respect for Guests",
          desc: "Every guest is important, regardless of the length of stay",
        },
        ky: {
          title: "Конокторго урмат",
          desc: "Жашоо мөөнөтүнө карабастан ар бир конок маанилүү",
        },
      },
      "Постоянное развитие": {
        en: {
          title: "Continuous Development",
          desc: "We constantly improve our services and conditions",
        },
        ky: {
          title: "Тынымсыз өнүгүү",
          desc: "Биз кызматтарыбызды жана шарттарыбызды тынымсыз жакшыртабыз",
        },
      },
    }
    if (language === "ru") return { title, desc }
    return map[title]?.[language] || { title, desc }
  }

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("aboutTitle")}
            </h1>
            <p className="text-lg text-gray-600">{t("aboutSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Image
                src="/images/about-hostel.png"
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

          <div className="bg-primary-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              {t("ourPrinciples")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {principles.map((p, i) => {
                const localized = getLocalizedPrinciple(p.title, p.desc)
                return (
                  <div key={i} className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {localized.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{localized.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

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
              <Link href="/contact">{t("contactUs")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

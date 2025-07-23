"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { HelpCircleIcon } from "lucide-react"

export function FaqPage() {
  const { language } = useLanguage()
  const { t } = useTranslation(language)

  const faqData = [
    {
      question: "Во сколько заезд и выезд?",
      answer:
        "Заезд с 14:00, выезд до 12:00. Ранний заезд и поздний выезд возможны по запросу.",
    },
    {
      question: "Включен ли завтрак?",
      answer:
        "Завтрак доступен за дополнительную плату 200 сом. Также у нас есть полностью оборудованная кухня, где вы можете готовить самостоятельно.",
    },
    {
      question: "Предоставляете ли вы полотенца и постельное белье?",
      answer:
        "Да, мы предоставляем чистое постельное белье и полотенца для всех гостей бесплатно. Белье меняется регулярно.",
    },
    {
      question: "Есть ли комендантский час?",
      answer:
        "Нет, комендантского часа нет. Вы можете приходить и уходить 24/7. Однако мы просим гостей соблюдать тишину после 22:00 из уважения к другим гостям.",
    },
    {
      question: "Могу ли я оставить багаж на хранение?",
      answer:
        "Да, мы предлагаем бесплатное хранение багажа для наших гостей как до заезда, так и после выезда.",
    },
  ]

  const getLocalizedFaq = (q: string, a: string) => {
    const map: { [key: string]: { [lang: string]: { q: string; a: string } } } =
      {
        "Во сколько заезд и выезд?": {
          en: {
            q: "What time is check-in and check-out?",
            a: "Check-in is from 14:00, check-out is until 12:00. Early check-in and late check-out may be available upon request.",
          },
          ky: {
            q: "Келүү жана кетүү саат канчада?",
            a: "Келүү 14:00дөн, кетүү 12:00гө чейин. Эрте келүү жана кеч кетүү суроо боюнча мүмкүн.",
          },
        },
        "Включен ли завтрак?": {
          en: {
            q: "Is breakfast included?",
            a: "Breakfast is available for an additional fee of 200 som. We also have a fully equipped kitchen where you can prepare your own meals.",
          },
          ky: {
            q: "Эртең мененки тамак кирдиби?",
            a: "Эртең мененки тамак 200 сомго кошумча акы менен жеткиликтүү. Ошондой эле өзүңүз тамак жасай турган толук жабдылган ашканабыз бар.",
          },
        },
        "Предоставляете ли вы полотенца и постельное белье?": {
          en: {
            q: "Do you provide towels and bed linen?",
            a: "Yes, we provide clean bed linen and towels for all guests free of charge. Linen is changed regularly.",
          },
          ky: {
            q: "Сүлгү жана төшөк кийимдерин берип турасызбы?",
            a: "Ооба, биз бардык коноктор үчүн таза төшөк кийимдери жана сүлгүлөрдү акысыз берип турабыз. Кийимдер үзгүлтүксүз алмаштырылат.",
          },
        },
        "Есть ли комендантский час?": {
          en: {
            q: "Is there a curfew?",
            a: "No, there is no curfew. You can come and go 24/7. However, we ask guests to be quiet after 22:00 to respect other guests.",
          },
          ky: {
            q: "Комендант саат барбы?",
            a: "Жок, комендант саат жок. Сиз 24/7 келип-кете аласыз. Бирок биз коноктордон башка коноктордун урматына 22:00дөн кийин үнсүз болууну суранабыз.",
          },
        },
        "Могу ли я оставить багаж на хранение?": {
          en: {
            q: "Can I store my luggage?",
            a: "Yes, we offer free luggage storage for our guests both before check-in and after check-out.",
          },
          ky: {
            q: "Багажымды сактап койсо болобу?",
            a: "Ооба, биз коноктор үчүн келүүдөн мурун да, кеткенден кийин да багажды акысыз сактап турабыз.",
          },
        },
      }
    if (language === "ru") return { q, a }
    return map[q]?.[language] || { q, a }
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t("faqTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("faqSubtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => {
              const localized = getLocalizedFaq(faq.question, faq.answer)
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border-0 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <HelpCircleIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-base font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
                        {localized.q}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <div className="pl-14">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {localized.a}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

export function FaqPage() {
  const { t } = useTranslation()
  const faqData = t("faq", { returnObjects: true }) as {
    q: string
    a: string
  }[]

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
            {faqData.map((faq, index) => (
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
                      {faq.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <div className="pl-14">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import en from "./locales/en/translation.json"
import ru from "./locales/ru/translation.json"
import kg from "./locales/kg/translation.json"

i18n
  .use(LanguageDetector) // автоопределение языка
  .use(initReactI18next) // интеграция с React
  .init({
    fallbackLng: "en", // язык по умолчанию
    supportedLngs: ["en", "ru", "ky"], // поддерживаемые языки
    interpolation: {
      escapeValue: false, // React сам экранирует
    },
    detection: {
      // порядок проверки языка
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["cookie"], // сохраняем выбор
    },
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ky: { translation: kg },
    },
  })

export default i18n

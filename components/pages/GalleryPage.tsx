"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "@/lib/i18n"
import { ImageIcon, BedIcon, HomeIcon, TreesIcon, EyeIcon } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { heroKitchenImage, heroOutsideImage } from "@/public"
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1564326895812-701bb858d5f2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // entrance
    title: "Main Entrance",
    category: "exterior",
    height: 600,
    width: 400,
  },
  {
    src: "https://i.pinimg.com/736x/be/0e/43/be0e43de0b2689430f805bb6361ee32b.jpg", // reception
    title: "Reception",
    category: "interior",
    height: 400,
    width: 600,
  },
  {
    src: heroKitchenImage, // kitchen
    title: "Common Kitchen",
    category: "interior",
    height: 800,
    width: 600,
  },
  {
    src: heroOutsideImage, // courtyard
    title: "Green Courtyard",
    category: "exterior",
    height: 400,
    width: 600,
  },
  {
    src: "https://i.pinimg.com/736x/20/4e/e8/204ee8184a9a677d7642a42b9c7bdc1e.jpg", // shower
    title: "Shower Room",
    category: "interior",
    height: 600,
    width: 400,
  },
  {
    src: "https://i.pinimg.com/1200x/7b/24/5d/7b245d3490aee0da962040b2ac5c1fd7.jpg", // lounge
    title: "Common Area",
    category: "interior",
    height: 400,
    width: 600,
  },
  {
    src: "https://i.pinimg.com/736x/f2/bc/ac/f2bcaccdaf60077def966c9b369ae397.jpg", // male dorm
    title: "Male Room",
    category: "rooms",
    height: 400,
    width: 600,
  },
  {
    src: "https://i.pinimg.com/736x/ca/5b/a8/ca5ba846c75231e3c774dfd4cf359637.jpg", // female dorm
    title: "Female Room",
    category: "rooms",
    height: 600,
    width: 400,
  },
  {
    src: "https://i.pinimg.com/736x/e2/d9/0b/e2d90b927e5531e6f52c9c82b09b9687.jpg", // mixed dorm
    title: "Mixed Room",
    category: "rooms",
    height: 400,
    width: 600,
  },
  {
    src: "https://i.pinimg.com/736x/2b/7a/40/2b7a40da4e0aac81e16e2f35827b4272.jpg", // lobby
    title: "Lobby",
    category: "interior",
    height: 800,
    width: 600,
  },
  {
    src: "https://i.pinimg.com/1200x/9a/e1/8b/9ae18bda155bd94afed2d012b1806412.jpg", // terrace
    title: "Terrace",
    category: "exterior",
    height: 400,
    width: 600,
  },
  {
    src: "https://i.pinimg.com/1200x/81/a9/56/81a956778d377646f8b3bf716101969d.jpg", // work area
    title: "Work Area",
    category: "interior",
    height: 600,
    width: 400,
  },
]

export function GalleryPage() {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [galleryFilter, setGalleryFilter] = useState<
    "all" | "rooms" | "interior" | "exterior"
  >("all")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const getLocalizedTitle = (title: string) => {
    const titles: { [key: string]: { [key: string]: string } } = {
      "Main Entrance": { ru: "Главный вход", ky: "Башкы кире бериш" },
      Reception: { ru: "Ресепшн", ky: "Кабыл алуу" },
      "Common Kitchen": { ru: "Общая кухня", ky: "Жалпы ашкана" },
      "Green Courtyard": { ru: "Зелёный дворик", ky: "Жашыл короо" },
      "Shower Room": { ru: "Душевая", ky: "Душ бөлмөсү" },
      "Common Area": { ru: "Общая зона", ky: "Жалпы аянт" },
      "Male Room": { ru: "Мужской номер", ky: "Эркектер бөлмөсү" },
      "Female Room": { ru: "Женский номер", ky: "Аялдар бөлмөсү" },
      "Mixed Room": { ru: "Общий номер", ky: "Жалпы бөлмө" },
      Lobby: { ru: "Холл", ky: "Холл" },
      Terrace: { ru: "Терраса", ky: "Терраса" },
      "Work Area": { ru: "Рабочая зона", ky: "Иш аянты" },
    }
    if (language === "en") return title
    return titles[title]?.[language] || title
  }

  const filteredGalleryImages =
    galleryFilter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === galleryFilter)

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t("galleryTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("gallerySubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {[
            { key: "all", label: t("allPhotos"), icon: ImageIcon },
            { key: "rooms", label: t("roomsPhotos"), icon: BedIcon },
            { key: "interior", label: t("interiorPhotos"), icon: HomeIcon },
            { key: "exterior", label: t("exteriorPhotos"), icon: TreesIcon },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={galleryFilter === key ? "default" : "outline"}
              onClick={() => setGalleryFilter(key as any)}
              className={`rounded-full px-6 transition-all duration-300 ${
                galleryFilter === key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600 hover:border-blue-300"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          <AnimatePresence>
            {filteredGalleryImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  delay: index * 0.02,
                }}
                onClick={() => setSelectedImage(image.src)}
                className="overflow-hidden rounded-2xl shadow-md hover:shadow-2xl  group cursor-pointer bg-white dark:bg-zinc-900 hover:-translate-y-1"
              >
                <div className="relative cursor-pointer">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={getLocalizedTitle(image.title)}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto object-cover transition-transform "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <div className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {t("viewPhoto")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredGalleryImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("noPhotosFound")}</p>
          </div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <Dialog
              open={!!selectedImage}
              onOpenChange={() => setSelectedImage(null)}
            >
              <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0 shadow-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Gallery image"
                    width={1200}
                    height={800}
                    className="rounded-2xl object-contain w-full h-auto max-h-[90vh]"
                  />
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

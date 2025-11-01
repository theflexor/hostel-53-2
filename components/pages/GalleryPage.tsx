"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, BedIcon, HomeIcon, TreesIcon, EyeIcon } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import {
  bathRomImage,
  heroKitchenImage,
  heroOutsideImage,
  inter3Image,
  interierDivan,
  interierKitchen,
  interierRomImage,
  interierRoom,
  interierRoomImage2,
  interierRoomImage3,
  outsideImage,
  outsideImage2,
  outsideImage3,
} from "@/public"
import { useTranslation } from "react-i18next"

const galleryImages = [
  {
    src: interierRomImage,
    title: "Room",
    category: "rooms",
    width: 600,
    height: 400,
  },
  {
    src: interierRoom,
    title: "Room",
    category: "rooms",
    width: 400,
    height: 600,
  },
  {
    src: interierDivan,
    title: "Room",
    category: "interior",
    width: 600,
    height: 400,
  },
  {
    src: heroKitchenImage,
    title: "Common Kitchen",
    category: "interior",
    width: 900,
    height: 600,
  },
  {
    src: heroOutsideImage,
    title: "Green Courtyard",
    category: "exterior",
    width: 600,
    height: 400,
  },
  {
    src: outsideImage,
    title: "Green Courtyard",
    category: "exterior",
    width: 600,
    height: 400,
  },
  {
    src: outsideImage2,
    title: "Common Area",
    category: "exterior",
    width: 600,
    height: 400,
  },
  {
    src: bathRomImage,
    title: "Shower Room",
    category: "interior",
    width: 400,
    height: 600,
  },
  {
    src: interierRoomImage3,
    title: "Room",
    category: "rooms",
    width: 600,
    height: 400,
  },
  {
    src: interierRoomImage2,
    title: "Room",
    category: "interior",
    width: 600,
    height: 400,
  },
  {
    src: interierKitchen,
    title: "Kitchen",
    category: "interior",
    width: 600,
    height: 400,
  },
  {
    src: inter3Image,
    title: "Room",
    category: "interior",
    width: 600,
    height: 400,
  },
  {
    src: outsideImage3,
    title: "Exterior",
    category: "exterior",
    width: 600,
    height: 400,
  },
]

export function GalleryPage() {
  const { t, i18n } = useTranslation()
  const [galleryFilter, setGalleryFilter] = useState<
    "all" | "rooms" | "interior" | "exterior"
  >("all")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const getLocalizedTitle = (title: string) => {
    const titles: Record<string, Record<string, string>> = {
      Room: { ru: "Номер", ky: "Бөлмө" },
      "Common Kitchen": { ru: "Общая кухня", ky: "Жалпы ашкана" },
      "Green Courtyard": { ru: "Зелёный дворик", ky: "Жашыл короо" },
      "Shower Room": { ru: "Душевая", ky: "Душ бөлмөсү" },
      "Common Area": { ru: "Общая зона", ky: "Жалпы аянт" },
      Kitchen: { ru: "Кухня", ky: "Ашкана" },
      Exterior: { ru: "Экстерьер", ky: "Тышкы көрүнүш" },
    }
    if (i18n.language === "en") return title
    return titles[title]?.[i18n.language] || title
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

        {/* Фильтры */}
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

        {/* Галерея */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          <AnimatePresence>
            {filteredGalleryImages.map((image, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  delay: index * 0.02,
                }}
                onClick={() => setSelectedImage(image.src as any)}
                className="overflow-hidden rounded-2xl shadow-md hover:shadow-2xl group cursor-pointer bg-white dark:bg-zinc-900 hover:-translate-y-1"
              >
                <div className="relative cursor-pointer">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={getLocalizedTitle(image.title)}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto object-cover transition-transform"
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

        {/* Просмотр фото */}
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

import type { Room, RawRoomData, BookingData } from "@/lib/types"

// The raw data you provided, now with local image paths
const rawRoomsData: RawRoomData[] = [
  {
    id: 2,
    title: "Общий номер для женщин с 6 кроватями",
    description:
      "Просторный 6-местный женский номер с собственной кухней, террасой и всеми удобствами для комфортного проживания. В номере есть обеденная зона, чайник и кофеварка, а также общее пространство с душем и тапочками. Кухня оборудована плитой, холодильником, посудомоечной машиной и кухонными принадлежностями. Паркетный пол, шкаф для одежды, москитная сетка и бесплатный Wi-Fi обеспечат уют и практичность. Идеально для путешественниц, ищущих доступное, но комфортное жильё.",
    capacity: 6,
    price: null,
    beds: "6 двухъярусных кроватей",
    roomSize: 16,
    categoryId: 2,
    categoryName: "6-ти местный для женщин",
    amenities: [
      "Ежедневная уборка",
      "Круглосуточная стойка регистрации",
      "Wi-Fi",
      "Кондиционер",
      "Постельное бельё включено",
      "Шторки для уединения",
      "Номер для некурящих",
      "Услуги прачечной",
      "Индивидуальные розетки",
      "Личные шкафчики",
      "Отопление",
      "Общая зона отдыха",
      "Лампы для чтения",
      "Полотенца (по запросу)",
      "Доступ к общей кухне",
      "Общая ванная комната",
    ],
    pictureUrls: [
      "/images/rooms/female-6-bed/1.png",
      "/images/rooms/female-6-bed/2.png",
      "/images/rooms/female-6-bed/3.png",
      "/images/gallery-kitchen.png",
      "/images/gallery-shower.png",
    ],
  },
  {
    id: 1,
    title: "12 местный номер",
    description:
      "Просторный и светлый 12-местный номер, идеально подходящий для больших групп или путешественников, ищущих доступное жильё. В комнате установлены 12 комфортных одноярусных кроватей, индивидуальные розетки, освещение и шкафчики для хранения личных вещей. Чистота, вентиляция и Wi-Fi гарантируют удобство и уют. Общая ванная комната расположена рядом на этаже.",
    capacity: 12,
    price: null,
    beds: "12 одноярусных кроватей",
    roomSize: 60,
    categoryId: 4,
    categoryName: "12-ти местный",
    amenities: [
      "Ежедневная уборка",
      "Круглосуточная стойка регистрации",
      "Wi-Fi",
      "Кондиционер",
      "Постельное бельё включено",
      "Шторки для уединения",
      "Номер для некурящих",
      "Услуги прачечной",
      "Индивидуальные розетки",
      "Личные шкафчики",
      "Отопление",
      "Общая зона отдыха",
      "Лампы для чтения",
      "Полотенца (по запросу)",
      "Доступ к общей кухне",
      "Общая ванная комната",
    ],
    pictureUrls: [
      "/images/rooms/12-bed/1.png",
      "/images/rooms/12-bed/2.png",
      "/images/rooms/12-bed/3.png",
      "/images/gallery-lounge.png",
    ],
  },
  {
    id: 3,
    title: "Общий 4-местный номер для мужчин",
    description:
      "Уютный и доступный 4-местный мужской номер с бесплатным Wi-Fi. В комнате установлены 8 двухъярусных кроватей, идеально подходящих для краткосрочного размещения. Ванная комната общая, оборудована душем и тапочками. Курение на территории запрещено, что обеспечивает комфортную и чистую атмосферу для всех гостей.",
    capacity: 4,
    price: null,
    beds: "4 двухъярусных кровати",
    roomSize: 16,
    categoryId: 3,
    categoryName: "4-х местный для мужчин",
    amenities: ["Индивидуальные розетки", "Wi-Fi", "Лампы для чтения"],
    pictureUrls: [
      "/images/rooms/male-4-bed/1.png",
      "/images/rooms/male-4-bed/2.png",
      "/images/rooms/male-4-bed/3.png",
    ],
  },
]

// Adapter function to map RawRoomData to the Room type used by the app
const adaptRoomData = (rawData: RawRoomData): Room => {
  const getGender = (categoryName: string): "male" | "female" | "mixed" => {
    const lowerCaseName = categoryName.toLowerCase()
    if (lowerCaseName.includes("женщин")) return "female"
    if (lowerCaseName.includes("мужчин")) return "male"
    return "mixed"
  }

  return {
    id: rawData.id,
    name: rawData.title,
    description: rawData.description,
    price:
      rawData.price ??
      (rawData.capacity <= 4 ? 1200 : rawData.capacity <= 6 ? 1100 : 1000),
    images: rawData.pictureUrls, // Use paths directly
    amenities: rawData.amenities,
    capacity: rawData.capacity,
    gender: getGender(rawData.categoryName),
    rating: 4.5 + Math.random() * 0.4, // Mock rating for UI
    reviews: 20 + Math.floor(Math.random() * 50), // Mock reviews for UI
    beds: rawData.beds,
    roomSize: rawData.roomSize,
    categoryName: rawData.categoryName,
    categoryId: rawData.categoryId,
  }
}

export const mockRooms: Room[] = rawRoomsData.map(adaptRoomData)

export const mockReviews: Review[] = [
  {
    id: "r1",
    author: "Анна",
    avatar: "/images/avatars/anna.png",
    text: "Очень чисто и уютно! Обязательно вернусь.",
    rating: 5,
    date: "21.07.2024",
    roomName: "Женский номер",
  },
  {
    id: "r2",
    author: "Иван",
    avatar: "/images/avatars/ivan.png",
    text: "Прекрасное расположение и дружелюбный персонал.",
    rating: 4.5,
    date: "18.07.2024",
    roomName: "Общий номер",
  },
]

export const mockStorage = {
  saveBooking(booking: Omit<BookingData, "id" | "status" | "createdAt">) {
    const newBooking: BookingData = {
      ...booking,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    if (typeof window !== "undefined") {
      const list = JSON.parse(localStorage.getItem("hostel_bookings") || "[]")
      list.push(newBooking)
      localStorage.setItem("hostel_bookings", JSON.stringify(list))
    }
    return newBooking
  },
}

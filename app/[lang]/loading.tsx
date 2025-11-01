export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Загрузка...</h2>
        <p className="text-gray-600">Подготавливаем для вас лучшие номера</p>
      </div>
    </div>
  )
}

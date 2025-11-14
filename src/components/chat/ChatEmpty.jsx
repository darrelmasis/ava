export default function ChatEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-lime-600 dark:text-lime-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        No hay mensajes aún
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Sé el primero en escribir
      </p>
    </div>
  )
}


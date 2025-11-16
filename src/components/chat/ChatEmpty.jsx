export default function ChatEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center mb-5">
        <svg
          className="w-10 h-10 text-lime-600 dark:text-lime-400"
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
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        No hay mensajes aún
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Sé el primero en escribir un mensaje en el chat
      </p>
    </div>
  )
}


export default function ChatError({ message }) {
  if (!message) return null

  return (
    <div className="mx-4 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <p className="text-sm text-yellow-800 dark:text-yellow-300">
        ⚠️ {message}
      </p>
    </div>
  )
}


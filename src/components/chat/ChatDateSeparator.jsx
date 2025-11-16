export default function ChatDateSeparator({ date }) {
  
  const formatDate = dateString => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  return (
    <div className="flex items-center my-4">
      <div className="flex-1 border-t border-neutral-300 dark:border-neutral-700"></div>
      <span className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400">
        {formatDate(date)}
      </span>
      <div className="flex-1 border-t border-neutral-300 dark:border-neutral-700"></div>
    </div>
  )
}


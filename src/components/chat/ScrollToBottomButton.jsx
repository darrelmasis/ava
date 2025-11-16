import { useState, useEffect } from 'react'

export default function ScrollToBottomButton({ containerRef, messagesEndRef }) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      // Mostrar botón si está más de 300px arriba del final
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 300
      setShowButton(!isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    // Verificar estado inicial
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef])

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!showButton) return null

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-24 right-8 z-30 w-12 h-12 rounded-full bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      aria-label="Ir al final del chat"
    >
      <svg
        className="w-6 h-6 transform group-hover:scale-110 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  )
}


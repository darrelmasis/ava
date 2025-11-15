import { useRef, useEffect, useCallback } from 'react'
import EmojiTriggerButton from './EmojiPickerButton'

export default function ChatInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  isConnected,
  sendTyping,
}) {
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const typingStartTimeoutRef = useRef(null)
  const typingStartRafRef = useRef(null)
  const isTypingRef = useRef(false)
  const lastTypingTimeRef = useRef(0)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [newMessage])

  // Función para manejar el evento de typing
  const handleTyping = useCallback(() => {
    if (!isConnected || !sendTyping) return

    const now = Date.now()
    lastTypingTimeRef.current = now

    // Si ya está marcado como escribiendo, solo resetear el timeout de stop
    if (isTypingRef.current) {
      // Limpiar timeout anterior de stop
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      // Resetear el timeout de stop (1 segundo después de la última tecla)
      typingTimeoutRef.current = setTimeout(() => {
        const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current
        if (isTypingRef.current && timeSinceLastTyping >= 1000) {
          isTypingRef.current = false
          sendTyping(false)
        }
      }, 1000)
      return
    }

    // Si no está escribiendo, emitir typing:start después de un pequeño delay
    if (!typingStartTimeoutRef.current && !typingStartRafRef.current) {
      // Marcar que el RAF está configurado para evitar múltiples configuraciones
      typingStartRafRef.current = requestAnimationFrame(() => {
        typingStartRafRef.current = null

        // Guardar el ID del timeout
        typingStartTimeoutRef.current = setTimeout(() => {
          // Limpiar la referencia
          typingStartTimeoutRef.current = null

          // Verificar que aún no esté escribiendo
          if (!isTypingRef.current) {
            isTypingRef.current = true
            sendTyping(true)

            // Configurar timeout de stop
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => {
              const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current
              if (isTypingRef.current && timeSinceLastTyping >= 1000) {
                isTypingRef.current = false
                sendTyping(false)
              }
            }, 1000)
          }
        }, 30)
      })
    }
  }, [isConnected, sendTyping])

  // Limpiar timeouts solo al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (typingStartTimeoutRef.current) {
        clearTimeout(typingStartTimeoutRef.current)
      }
      if (typingStartRafRef.current) {
        cancelAnimationFrame(typingStartRafRef.current)
      }
      if (isTypingRef.current && sendTyping) {
        sendTyping(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo se ejecuta al desmontar

  const handleSubmit = e => {
    e.preventDefault()
    // Limpiar todos los timeouts de typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    if (typingStartTimeoutRef.current) {
      clearTimeout(typingStartTimeoutRef.current)
    }
    if (typingStartRafRef.current) {
      cancelAnimationFrame(typingStartRafRef.current)
      typingStartRafRef.current = null
    }
    if (isTypingRef.current && sendTyping) {
      isTypingRef.current = false
      sendTyping(false)
    }
    onSendMessage(e)
    // Resetear altura después de enviar
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    inputRef.current?.focus()
  }

  const handleInput = e => {
    // Auto-resize mientras escribe
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px` // Máximo 120px
  }

  const handleEmojiClick = emojiData => {
    const emoji = emojiData.emoji
    const cursorPosition = inputRef.current.selectionStart
    const textBeforeCursor = newMessage.slice(0, cursorPosition)
    const textAfterCursor = newMessage.slice(cursorPosition)
    const updatedMessage = textBeforeCursor + emoji + textAfterCursor
    setNewMessage(updatedMessage)
    // Emitir evento de typing cuando se inserta un emoji
    handleTyping()
    // Restaurar posición del cursor después del emoji
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(
          cursorPosition + emoji.length,
          cursorPosition + emoji.length
        )
      }
    }, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-4 px-4">
      <div className="relative flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-lime-500 transition-all duration-200 px-2 gap-2">
        {/* Botón de emoji - dentro del input a la izquierda */}
        <div className="flex-shrink-0">
          <EmojiTriggerButton
            disabled={!isConnected}
            onEmojiClick={handleEmojiClick}
          />
        </div>

        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={e => {
            setNewMessage(e.target.value)
            handleTyping()
          }}
          onInput={handleInput}
          placeholder="Escribe un mensaje..."
          disabled={!isConnected}
          rows={1}
          className="flex-1 px-2 py-3 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto min-h-[48px] max-h-[120px]"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            } else {
              handleTyping()
            }
          }}
        />

        {/* Botón de enviar - dentro del input a la derecha */}
        <div className="flex-shrink-0">
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="p-2 rounded-lg bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-lime-500 dark:disabled:hover:bg-lime-600"
            title="Enviar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )
}

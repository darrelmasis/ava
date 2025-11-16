import { useRef, useEffect, useCallback } from 'react'
import EmojiTriggerButton from './EmojiPickerButton'

export default function ChatInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  isConnected,
  sendTyping,
  sendMessage,
  user,
}) {
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const typingStartTimeoutRef = useRef(null)
  const typingStartRafRef = useRef(null)
  const isTypingRef = useRef(false)
  const lastTypingTimeRef = useRef(0)

  // ---------------------------
  //   AUTO-RESIZE DEL TEXTAREA
  // ---------------------------
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [newMessage])

  // ---------------------------
  //   MANEJO DE TYPING
  // ---------------------------
  const handleTyping = useCallback(() => {
    if (!isConnected || !sendTyping) return

    const now = Date.now()
    lastTypingTimeRef.current = now

    if (isTypingRef.current) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        const diff = Date.now() - lastTypingTimeRef.current
        if (isTypingRef.current && diff >= 800) {
          isTypingRef.current = false
          sendTyping(false)
        }
      }, 800)
      return
    }

    if (!typingStartTimeoutRef.current && !typingStartRafRef.current) {
      typingStartRafRef.current = requestAnimationFrame(() => {
        typingStartRafRef.current = null
        typingStartTimeoutRef.current = setTimeout(() => {
          typingStartTimeoutRef.current = null
          if (!isTypingRef.current) {
            isTypingRef.current = true
            sendTyping(true)

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => {
              const diff = Date.now() - lastTypingTimeRef.current
              if (isTypingRef.current && diff >= 1000) {
                isTypingRef.current = false
                sendTyping(false)
              }
            }, 1000)
          }
        }, 30)
      })
    }
  }, [isConnected, sendTyping])

  // ---------------------------
  //   LIMPIAR TYPING AL DESMONTAR
  // ---------------------------
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (typingStartTimeoutRef.current)
        clearTimeout(typingStartTimeoutRef.current)
      if (typingStartRafRef.current)
        cancelAnimationFrame(typingStartRafRef.current)
      if (isTypingRef.current && sendTyping) sendTyping(false)
    }
  }, [])

  const clearTypingStates = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    if (typingStartTimeoutRef.current)
      clearTimeout(typingStartTimeoutRef.current)
    if (typingStartRafRef.current)
      cancelAnimationFrame(typingStartRafRef.current)
    typingStartRafRef.current = null
    if (isTypingRef.current && sendTyping) {
      isTypingRef.current = false
      sendTyping(false)
    }
  }

  // ---------------------------
  //   SUBMIT NORMAL (Enter)
  // ---------------------------
  const handleSubmit = e => {
    e.preventDefault()
    clearTypingStates()
    if (newMessage.trim()) {
      onSendMessage(e)
    }
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.focus()
    }
  }

  const handleInput = e => {
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  // ---------------------------
  //   INSERTAR EMOJI
  // ---------------------------
  const handleEmojiClick = emojiData => {
    const emoji = emojiData.emoji
    const cursor = inputRef.current?.selectionStart || newMessage.length
    const updated =
      newMessage.slice(0, cursor) + emoji + newMessage.slice(cursor)
    setNewMessage(updated)
    handleTyping()
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(
          cursor + emoji.length,
          cursor + emoji.length
        )
      }
    }, 0)
  }

  // ---------------------------
  //   ENVIAR 👍 DIRECTAMENTE
  // ---------------------------
  const handleSendThumbsUp = () => {
    if (!isConnected || !sendMessage || !user) return
    clearTypingStates()
    const userId = user._id || user.id
    const userName = user.fullName || 'Usuario'
    sendMessage('👍', userName, userId)
  }

  // ---------------------------
  //   RENDER
  // ---------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 px-4 py-2 w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex justify-center">
        <div className="relative flex items-center rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-lime-500 transition-all duration-200 px-2 gap-2 w-full max-w-4xl">
          <EmojiTriggerButton
            disabled={!isConnected}
            onEmojiClick={handleEmojiClick}
          />

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
            className="flex-1 px-2 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none min-h-[40px] max-h-[120px] overflow-hidden bg-transparent"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              } else {
                handleTyping()
              }
            }}
          />

          {newMessage.trim() ? (
            <button
              type="submit"
              disabled={!isConnected}
              className="p-2 rounded-lg bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          ) : (
            <button
              key="thumbup"
              type="button"
              onClick={handleSendThumbsUp}
              disabled={!isConnected}
              className="w-9 h-9 rounded-full text-xl flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Enviar pulgar arriba"
            >
              👍
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

import { useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { useTheme } from '../../hooks/useTheme'

export default function ChatInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  isConnected,
  showEmojiPicker,
  setShowEmojiPicker,
}) {
  const { isDark } = useTheme()
  const inputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const emojiButtonRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [newMessage])

  const handleEmojiClick = emojiData => {
    setNewMessage(prev => prev + emojiData.emoji)
    inputRef.current?.focus()
  }

  // Cerrar emoji picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker, setShowEmojiPicker])

  const handleSubmit = e => {
    e.preventDefault()
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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0"
    >
      <div className="relative">
        {/* Emoji Picker - Posicionado absolutamente arriba del input */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-0 mb-2 z-50"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={isDark ? 'dark' : 'light'}
              width={350}
              height={400}
              previewConfig={{ showPreview: false }}
              emojiStyle='native'
            />
          </div>
        )}

        <div className="relative flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-lime-500 transition-all duration-200 px-2 gap-2">
          {/* Botón de emoji - dentro del input a la izquierda */}
          <div className="flex-shrink-0">
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-lg transition-colors ${
                showEmojiPicker
                  ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-400'
              }`}
              disabled={!isConnected}
              title="Emojis"
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onInput={handleInput}
            placeholder="Escribe un mensaje..."
            disabled={!isConnected}
            rows={1}
            className="flex-1 px-2 py-3 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto min-h-[48px] max-h-[120px]"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            onFocus={() => setShowEmojiPicker(false)}
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
      </div>
    </form>
  )
}

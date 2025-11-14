import { useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { useTheme } from '../../hooks/useTheme'

export default function EmojiPickerButton({
  showEmojiPicker,
  onToggle,
  onEmojiClick,
  disabled,
  hideButton = false,
}) {
  const { isDark } = useTheme()
  const emojiPickerRef = useRef(null)

  // Cerrar emoji picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        onToggle(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker, onToggle])

  if (hideButton) {
    // Solo mostrar el picker sin el botón
    return (
      <div ref={emojiPickerRef}>
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          theme={isDark ? 'dark' : 'light'}
          width={350}
          height={400}
          previewConfig={{ showPreview: false }}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-0 mb-2 z-50"
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={isDark ? 'dark' : 'light'}
            width={350}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  )
}


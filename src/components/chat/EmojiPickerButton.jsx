import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { useTheme } from '../../hooks/useTheme'

export default function EmojiTriggerButton({
  open: openProp,
  onOpenChange,
  onEmojiClick,
  disabled = false,
  children,
  pickerProps = {},
  placement = 'top',
  ...rest
}) {
  const { isDark } = useTheme()
  const [openState, setOpenState] = useState(false)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = onOpenChange || setOpenState

  const triggerRef = useRef(null)
  const pickerRef = useRef(null)

  // Callback para toggle
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setOpen(!open)
    }
  }, [disabled, open, setOpen])

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    if (!open) return

    const handleClickOutside = event => {
      const target = event.target

      // Verificar si el click fue fuera de ambos elementos
      const isOutsidePicker =
        pickerRef.current && !pickerRef.current.contains(target)
      const isOutsideTrigger =
        triggerRef.current && !triggerRef.current.contains(target)

      if (isOutsidePicker && isOutsideTrigger) {
        setOpen(false)
      }
    }

    // Usar capture phase para mejor detección
    document.addEventListener('mousedown', handleClickOutside, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [open, setOpen])

  // Manejo seguro de emoji click (no cerrar el panel para permitir múltiples selecciones)
  const handleEmojiClick = useCallback(
    emojiData => {
      if (emojiData?.emoji) {
        onEmojiClick?.(emojiData)
        // No cerrar el panel para permitir seleccionar múltiples emojis
      }
    },
    [onEmojiClick]
  )

  // Configuración del picker memoizada
  const emojiPickerConfig = useMemo(
    () => ({
      onEmojiClick: handleEmojiClick,
      theme: isDark ? 'dark' : 'light',
      lazyLoadEmojis: true,
      skinTonesDisabled: true,
      previewConfig: { showPreview: false },
      emojiStyle: 'apple',
      width: 320,
      height: 400,
      ...pickerProps,
    }),
    [isDark, handleEmojiClick, pickerProps]
  )

  return (
    <div className="relative z-99" {...rest}>
      {/* Trigger */}
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Seleccionar emoji"
      >
        {children ?? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </button>

      {/* Emoji Picker Panel */}
      {open && (
        <div
          ref={pickerRef}
          className={`absolute z-40 ${
            placement === 'top'
              ? 'bottom-full mb-2 left-0'
              : placement === 'bottom'
                ? 'top-full mt-2 left-0'
                : placement === 'right'
                  ? 'right-full mr-2 top-0'
                  : placement === 'left'
                    ? 'left-full ml-2 top-0'
                    : 'top-full mt-2 left-0'
          } z-50 shadow-lg rounded-lg overflow-hidden`}
        >
          <EmojiPicker {...emojiPickerConfig} />
        </div>
      )}
    </div>
  )
}

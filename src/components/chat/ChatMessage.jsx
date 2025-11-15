import { useMemo } from 'react'
import Avatar from '../commons/Avatar'

// Regex mejorado para detectar emojis (más completo y eficiente)
// Detecta: emojis Unicode, variantes, secuencias, banderas, etc.
const EMOJI_REGEX = /([\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2600-\u27BF])/g;

// Función optimizada para detectar y renderizar emojis más grandes
const renderTextWithEmojis = (text, messageId) => {
  if (!text || typeof text !== 'string') return text

  // Resetear el regex (importante para reutilización)
  EMOJI_REGEX.lastIndex = 0

  // Verificar rápidamente si hay emojis antes de procesar
  if (!EMOJI_REGEX.test(text)) {
    EMOJI_REGEX.lastIndex = 0
    return text
  }
  EMOJI_REGEX.lastIndex = 0

  const parts = []
  let lastIndex = 0
  let match
  let emojiIndex = 0

  // Buscar todos los emojis
  while ((match = EMOJI_REGEX.exec(text)) !== null) {
    // Agregar texto antes del emoji
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index)
      if (textBefore) {
        parts.push(textBefore)
      }
    }

    // Agregar el emoji envuelto en un span con fuente más grande
    parts.push(
      <span
        key={`emoji-${messageId}-${emojiIndex++}`}
        className="inline-block text-2xl leading-none align-middle mx-0.5"
        role="img"
        aria-label="emoji"
      >
        {match[0]}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Agregar el texto restante después del último emoji
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex)
    if (textAfter) {
      parts.push(textAfter)
    }
  }

  // Si no se encontraron emojis, devolver el texto original
  return parts.length > 0 ? parts : text
}

export default function ChatMessage({
  message,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  showAvatar,
  user,
}) {
  const time = new Date(message.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
  

  // Memoizar el renderizado de emojis para mejorar el rendimiento
  const renderedText = useMemo(
    () => renderTextWithEmojis(message.text, message.id || message.timestamp),
    [message.text, message.id, message.timestamp]
  )

  // Mensaje de otro usuario
  if (!isOwn) {
    return (
      <div className="flex items-end gap-2 mb-1 justify-start">
        {/* Avatar izquierdo */}
        <div className="flex-shrink-0">
          {isFirstInGroup && showAvatar ? (
            <Avatar name={message.user} size="sm" />
          ) : (
            <div className="w-8"></div>
          )}
        </div>

        {/* Contenedor del mensaje */}
        <div className="flex flex-col max-w-[70%] items-start">
          {/* Nombre del usuario */}
          {isFirstInGroup && showAvatar && (
            <div className="mb-1">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {message.user}
              </span>
            </div>
          )}

          {/* Burbuja del mensaje */}
          <div
            className={`px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-neutral-200 dark:border-neutral-700 shadow-sm ${
              isFirstInGroup ? 'rounded-tl-sm' : 'rounded-tl-2xl'
            } ${isLastInGroup ? 'rounded-bl-sm' : 'rounded-bl-2xl'}`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {renderedText}
            </p>
          </div>

          {/* Timestamp */}
          {isLastInGroup && (
            <div className="mt-1 px-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {time}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mensaje propio
  return (
    <div className="flex items-end gap-2 mb-1 justify-end">
      {/* Contenedor del mensaje */}
      <div className="flex flex-col max-w-[70%] items-end">
        {/* Burbuja del mensaje */}
        <div
          className={`px-4 py-2.5 rounded-2xl bg-lime-500/50 text-lime-900 dark:text-white shadow-sm ${
            isFirstInGroup ? 'rounded-tr-sm' : 'rounded-tr-2xl'
          } ${isLastInGroup ? 'rounded-br-sm' : 'rounded-br-2xl'}`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {renderedText}
          </p>
        </div>

        {/* Timestamp */}
        {isLastInGroup && (
          <div className="mt-1 px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {time}
            </span>
          </div>
        )}
      </div>

      {/* Avatar derecho */}
      <div className="flex-shrink-0">
        {isFirstInGroup ? (
          <Avatar name={user?.fullName || user?.userName || 'Tú'} size="sm" />
        ) : (
          <div className="w-8"></div>
        )}
      </div>
    </div>
  )
}

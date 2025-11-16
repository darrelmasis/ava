import { useMemo, useState } from 'react'
import Avatar from '../commons/Avatar'

// Regex mejorado para detectar emojis (más completo y eficiente)
// Detecta: emojis Unicode, variantes, secuencias, banderas, etc.
const EMOJI_REGEX = /([\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2600-\u27BF])/gu;

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
  
  const fullDateTime = new Date(message.timestamp).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const [isHovered, setIsHovered] = useState(false)

  // Memoizar el renderizado de emojis
  const renderedText = useMemo(
    () => renderTextWithEmojis(message.text, message.id || message.timestamp),
    [message.text, message.id, message.timestamp]
  )

  // Mensaje de otro usuario
  if (!isOwn) {
    // Determinar clases de bordes redondeados
    let roundedClasses = 'rounded-2xl'
    if (isFirstInGroup && isLastInGroup) {
      // Único mensaje: solo la esquina superior izquierda menos redondeada
      roundedClasses = 'rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
    } else if (isFirstInGroup) {
      // Primer mensaje: esquina superior izquierda menos redondeada
      roundedClasses = 'rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
    } else if (isLastInGroup) {
      // Último mensaje: esquina inferior izquierda menos redondeada
      roundedClasses = 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm'
    }

    return (
      <div className="flex items-start gap-2 mb-1 justify-start">
        {/* Avatar izquierdo */}
        <div className="flex-shrink-0 w-8 h-8 flex items-start">
          {isFirstInGroup && showAvatar ? (
            <Avatar name={message.user} size="sm" />
          ) : null}
        </div>

        {/* Contenedor del mensaje */}
        <div className="flex flex-col max-w-[70%] items-start group">
          {/* Nombre del usuario */}
          {isFirstInGroup && showAvatar && (
            <div className="mb-0.5">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {message.user}
              </span>
            </div>
          )}

          {/* Contenedor de mensaje y hora */}
          <div className="relative">
            {/* Burbuja del mensaje */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`px-2.5 py-1.5 ${roundedClasses} bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-neutral-200 dark:border-neutral-700`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {renderedText}
              </p>
            </div>
            
            {/* Hora visible al hacer hover */}
            {isHovered && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap bg-white dark:bg-neutral-900 px-2 py-1 rounded shadow-lg border border-neutral-200 dark:border-neutral-700 z-10">
                {fullDateTime}
              </span>
            )}
          </div>

          {/* Timestamp */}
          {isLastInGroup && (
            <div className="mt-0.5 px-2">
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
  // Determinar clases de bordes redondeados
  let roundedClasses = 'rounded-2xl'
  if (isFirstInGroup && isLastInGroup) {
    // Único mensaje: solo la esquina superior derecha menos redondeada
    roundedClasses = 'rounded-tr-sm rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
  } else if (isFirstInGroup) {
    // Primer mensaje: esquina superior derecha menos redondeada
    roundedClasses = 'rounded-tr-sm rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
  } else if (isLastInGroup) {
    // Último mensaje: esquina inferior derecha menos redondeada
    roundedClasses = 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm'
  }

  return (
    <div className="flex items-start gap-2 mb-1 justify-end">
      {/* Contenedor del mensaje */}
      <div className="flex flex-col max-w-[70%] items-end group">
        {/* Contenedor de mensaje y hora */}
        <div className="relative">
          {/* Burbuja del mensaje */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`px-2.5 py-1.5 ${roundedClasses} bg-lime-500 dark:bg-lime-600 text-white`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {renderedText}
            </p>
          </div>
          
          {/* Hora visible al hacer hover */}
          {isHovered && (
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap bg-white dark:bg-neutral-900 px-2 py-1 rounded shadow-lg border border-neutral-200 dark:border-neutral-700 z-10">
              {fullDateTime}
            </span>
          )}
        </div>

        {/* Timestamp */}
        {isLastInGroup && (
          <div className="mt-0.5 px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {time}
            </span>
          </div>
        )}
      </div>

      {/* Avatar derecho */}
      <div className="flex-shrink-0 w-8 h-8 flex items-start">
        {isFirstInGroup ? (
          <Avatar name={user?.fullName || user?.userName || 'Tú'} size="sm" />
        ) : null}
      </div>
    </div>
  )
}

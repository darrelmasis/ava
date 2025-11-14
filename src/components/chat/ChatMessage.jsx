import Avatar from '../commons/Avatar'

// Función para detectar y renderizar emojis más grandes
const renderTextWithEmojis = text => {
  if (!text) return text

  // Regex para detectar emojis (incluye emojis Unicode, variantes, y secuencias)
  const emojiRegex =
    /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)/gu

  const parts = []
  let lastIndex = 0
  let match
  let hasEmojis = false

  while ((match = emojiRegex.exec(text)) !== null) {
    hasEmojis = true
    // Agregar texto antes del emoji
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Agregar el emoji envuelto en un span con fuente más grande
    parts.push(
      <span key={match.index} className="inline-block text-2xl leading-none align-middle">
        {match[0]}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Agregar el texto restante después del último emoji
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  // Si no hay emojis, devolver el texto original
  return hasEmojis ? parts : text
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

  // Mensaje de otro usuario
  if (!isOwn) {
    return (
      <div className="flex items-end gap-2 mb-1 justify-start">
        {/* Avatar izquierdo */}
        <div className="flex-shrink-0">
          {isFirstInGroup && showAvatar ? (
            <Avatar name={message.user || 'Usuario'} size="sm" />
          ) : (
            <div className="w-8"></div>
          )}
        </div>

        {/* Contenedor del mensaje */}
        <div className="flex flex-col max-w-[70%] items-start">
          {/* Nombre del usuario */}
          {isFirstInGroup && showAvatar && (
            <div className="mb-1 px-2">
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
              {renderTextWithEmojis(message.text)}
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
            {renderTextWithEmojis(message.text)}
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
          <Avatar
            name={user?.fullName || user?.userName || 'Tú'}
            size="sm"
          />
        ) : (
          <div className="w-8"></div>
        )}
      </div>
    </div>
  )
}


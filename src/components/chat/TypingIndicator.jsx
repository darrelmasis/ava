import { useMemo } from 'react'

export default function TypingIndicator({ typingUsers, currentUserId }) {
  // Filtrar usuarios escribiendo (excluir al usuario actual)
  const otherTypingUsers = useMemo(() => {
    if (!typingUsers || typingUsers.size === 0) return []

    const currentId = String(currentUserId || '')
    return Array.from(typingUsers.entries())
      .filter(([userId]) => {
        const userIdStr = String(userId || '')
        return userIdStr && userIdStr !== currentId
      })
      .map(([, userData]) => userData)
  }, [typingUsers, currentUserId])

  if (!otherTypingUsers || otherTypingUsers.length === 0) return null

  return (
    <div className="absolute right-0 left-0 bottom-4 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic">
      <div className="flex items-center gap-1.5">
        <span className="flex gap-0.5">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
            •
          </span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
            •
          </span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
            •
          </span>
        </span>
        <span>
          {otherTypingUsers.map((typingUser, index) => (
            <span key={typingUser.userName || index}>
              <strong className="font-medium">
                {typingUser.fullName || typingUser.userName}
              </strong>
              {index < otherTypingUsers.length - 1 && ', '}
            </span>
          ))}
          {otherTypingUsers.length === 1
            ? ' está escribiendo'
            : ' están escribiendo'}
        </span>
      </div>
    </div>
  )
}

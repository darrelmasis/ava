import { useMemo } from 'react'

export default function TypingIndicator({ typingUsers, currentUserId }) {
  // Filtrar usuarios escribiendo (excluir al usuario actual)

  const otherTypingUsers = useMemo(() => {
    if (!typingUsers || typingUsers.size === 0) return []

    const currentId = String(currentUserId || '')

    const currentTypingUsers = Array.from(typingUsers.entries())
      .filter(([userId]) => {
        const userIdStr = String(userId || '')
        return userIdStr && userIdStr !== currentId
      })
      .map(([, userData]) => userData)

    return currentTypingUsers
  }, [typingUsers, currentUserId])

  if (!otherTypingUsers || otherTypingUsers.length === 0) {
    return null
  }

  return (
    <p className=" right-0 left-0 bottom-4 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1.5">
        <span className="text-neutral-700 dark:text-neutral-300 text-xs">
          {otherTypingUsers.map((typingUser, index) => (
            <span key={typingUser.userName || index}>
              {typingUser.fullName.split(' ')[0]}
              {index < otherTypingUsers.length - 1 && ', '}
            </span>
          ))}
          {otherTypingUsers.length === 1
            ? ' está escribiendo...'
            : ' están escribiendo...'}
        </span>
      </div>
    </p>
  )
}

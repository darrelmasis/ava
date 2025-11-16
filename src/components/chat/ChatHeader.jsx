import { useMemo } from 'react'
import TypingIndicator from './TypingIndicator'
import ConnedtedUsers from './ConnectedUsers'

export default function ChatHeader({
  isConnected,
  user,
  typingUsers,
  currentUserId,
  connected,
}) {
  // Verificar si hay otros usuarios escribiendo (excluyendo al usuario actual)
  const hasOtherUsersTyping = useMemo(() => {
    if (!typingUsers || typingUsers.size === 0) return false

    const currentId = String(currentUserId || '')
    return Array.from(typingUsers.keys()).some(
      userId => String(userId) !== currentId
    )
  }, [typingUsers, currentUserId])

  return (
    <header className="sticky top-0 w-full z-20 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            <span>
              Auditoría Interna <span className="text-blue-500">✪</span>
            </span>
          </h1>
          {hasOtherUsersTyping ? (
            <TypingIndicator
              typingUsers={typingUsers}
              currentUserId={currentUserId}
            />
          ) : (
            <ConnedtedUsers
              connectedUsers={connected}
              loggedUser={user}
              typingUsers={typingUsers}
            />
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              isConnected 
                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
                : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
            }`}
          />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>
    </header>
  )
}

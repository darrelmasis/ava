import TypingIndicator from './TypingIndicator'
import ConnedtedUsers from './ConnectedUsers'

export default function ChatHeader({
  isConnected,
  user,
  typingUsers,
  currentUserId,
  connected,
}) {
  return (
    <header className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            <span>
              Auditoría Interna <span className="text-blue-500">✪</span>
            </span>
          </h1>
          {typingUsers.size > 0 ? (
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
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>
    </header>
  )
}

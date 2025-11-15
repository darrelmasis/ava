import { useChatSocket } from '../../hooks/chat/useChatSocket'

export default function ChatHeader({ isConnected, user }) {
  return (
    <header className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Chat
        </h1>
        <span className="text-lg text-white">
          {user?.fullName || 'Usuario'}
        </span>
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

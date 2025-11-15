import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast, { Toaster } from 'react-hot-toast'
import ChatHeader from '../components/chat/ChatHeader'
import ChatError from '../components/chat/ChatError'
import ChatMessageList from '../components/chat/ChatMessageList'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import { useChatSocket } from '../hooks/chat/useChatSocket'
import { useGroupedMessages } from '../hooks/chat/useGroupedMessages'

export default function Chat() {
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const {
    messages,
    isConnected,
    connectionError,
    sendMessage,
    typingUsers,
    sendTyping,
  } = useChatSocket()

  const groupedMessages = useGroupedMessages(messages)

  // Usar useLayoutEffect para scroll más seguro
  useLayoutEffect(() => {
    if (messages.length > 0) {
      // Usar doble requestAnimationFrame para asegurar que el DOM esté completamente renderizado
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (
            messagesEndRef.current &&
            messagesContainerRef.current &&
            messagesContainerRef.current.contains(messagesEndRef.current)
          ) {
            try {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
            } catch (error) {
              // Ignorar errores silenciosamente
            }
          }
        })
      })
    }
  }, [messages.length])

  const handleSendMessage = e => {
    e.preventDefault()
    if (!newMessage.trim() || !isConnected) return

    const userId = user?._id || user?.id
    const userName = user?.fullName || 'Usuario'
    if (sendMessage(newMessage, userName, userId)) {
      setNewMessage('')
    }
  }

  const isOwnMessage = msg => {
    if (!user || !msg.userId) return false
    const msgUserId = msg.userId
    const userCurrentId = user._id || user.id
    return String(msgUserId) === String(userCurrentId)
  }

  return (
    <div className="flex flex-col bg-neutral-100 dark:bg-neutral-900 max-w-3xl mx-auto h-[calc(100vh-71px)]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#84cc16',
              secondary: '#fff',
            },
          },
        }}
      />

      <ChatHeader isConnected={isConnected} user={user} />
      <ChatError message={connectionError} />

      <main
        ref={messagesContainerRef}
        key="chat-messages-main"
        className="relative flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <ChatMessageList
          key={`chat-messages-${groupedMessages.length}`}
          groupedMessages={groupedMessages}
          isOwnMessage={isOwnMessage}
          user={user}
          messagesEndRef={messagesEndRef}
        />
        <TypingIndicator
          typingUsers={typingUsers}
          currentUserId={user?._id || user?.id}
        />
      </main>

      {/* Indicador de usuarios escribiendo - arriba del input */}

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        isConnected={isConnected}
        sendTyping={sendTyping}
      />
    </div>
  )
}

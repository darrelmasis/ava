import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export function useChatSocket() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [connectedUsers, setConnectedUsers] = useState([])
  const socketRef = useRef(null)
  const isConnectingRef = useRef(false)

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, limpiar socket existente
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
        setMessages([])
        setConnectedUsers([])
      }
      return
    }

    // Evitar múltiples conexiones simultáneas
    if (socketRef.current?.connected || isConnectingRef.current) {
      return
    }

    const CHAT_SERVER_URL =
      import.meta.env.VITE_CHAT_SERVER_URL ||
      'https://violent-wini-dm-org-63795708.koyeb.app'

    // console.log('🔌 Conectando a:', CHAT_SERVER_URL)
    setConnectionError(null)
    isConnectingRef.current = true

    const socket = io(CHAT_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true,
    })

    const handleConnect = () => {
      // console.log('✅ Conectado al chat')
      setIsConnected(true)
      setConnectionError(null)
      isConnectingRef.current = false

      socket.emit('user:join', {
        userName: user.userName,
        id: user._id || user.id,
        fullName: user.fullName,
      })
    }

    const handleDisconnect = () => {
      // console.log('🔌 Desconectado del chat')
      setIsConnected(false)
      isConnectingRef.current = false
    }

    const handleConnectError = error => {
      // console.error('❌ Error de conexión:', error)
      setIsConnected(false)
      isConnectingRef.current = false
      setConnectionError(
        'No se pudo conectar al servidor. ¿Está el servidor de chat corriendo?'
      )
    }

    const handleUsersList = usersList => {
      // console.log('📋 Usuarios conectados recibidos:', usersList)
      setConnectedUsers(usersList || [])
    }

    const handleMessageHistory = history => {
      setMessages(history || [])
    }

    const handleMessageNew = message => {
      // console.log('📨 Nuevo mensaje recibido:', message)
      setMessages(prev => [...prev, message])

      if (String(message.userId) !== String(user?._id || user?.id)) {
        toast.success(`📨 Nuevo mensaje de ${message.user}`, {
          position: 'top-right',
          duration: 3000,
        })
      }
    }

    const handleUserJoined = data => {
      if (data.userName !== user?.userName) {
        toast.success(`🟢 ${data.userName} se ha conectado`, {
          position: 'top-right',
          duration: 3000,
          icon: '👋',
        })
      }
    }

    const handleUserLeft = data => {
      if (data.userName !== user?.userName) {
        toast(`🔴 ${data.userName} se ha desconectado`, {
          position: 'top-right',
          duration: 2000,
          icon: '👋',
        })
      }
    }

    // Registrar todos los listeners
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('users:list', handleUsersList)
    socket.on('message:history', handleMessageHistory)
    socket.on('message:new', handleMessageNew)
    socket.on('user:joined', handleUserJoined)
    socket.on('user:left', handleUserLeft)

    socketRef.current = socket

    return () => {
      isConnectingRef.current = false
      if (socketRef.current) {
        // Remover todos los listeners antes de desconectar
        socketRef.current.removeAllListeners()
        // Solo desconectar si está conectado
        if (socketRef.current.connected) {
          socketRef.current.disconnect()
        }
        socketRef.current = null
      }
    }
  }, [user])

  const sendMessage = (text, userName, userId) => {
    if (!isConnected || !socketRef.current) return false

    const message = {
      text: text.trim(),
      user: userName || 'Usuario',
      userId: userId,
    }

    socketRef.current.emit('message:send', message)
    return true
  }

  return {
    messages,
    setMessages,
    isConnected,
    connectionError,
    connectedUsers,
    sendMessage,
  }
}


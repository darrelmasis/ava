// Configuración del chat (cliente)
// Este archivo mantiene la misma configuración que el servidor

// Límite configurable de mensajes a mostrar en el chat
// Debe coincidir con MAX_MESSAGES_DISPLAY en ava-socket/config.js
export const MAX_MESSAGES_DISPLAY = parseInt(
  import.meta.env.VITE_MAX_MESSAGES_DISPLAY || '6',
  10
)


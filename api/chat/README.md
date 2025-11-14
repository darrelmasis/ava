# Chat en Tiempo Real - Servidor Socket.io

## Instalación

Las dependencias necesarias ya están instaladas:
- `socket.io` - Servidor Socket.io
- `socket.io-client` - Cliente Socket.io para React

## Ejecución

Para iniciar el servidor de chat Socket.io, ejecuta:

```bash
npm run chat:server
```

O directamente:
```bash
node api/chat/server.js
```

El servidor se ejecutará en el puerto **8080** por defecto (o el especificado en `CHAT_PORT`).

## Configuración

Puedes cambiar el puerto usando una variable de entorno:

```bash
CHAT_PORT=3001 node api/chat/server.js
```

## Uso

1. Inicia el servidor de chat: `npm run chat:server`
2. Inicia tu aplicación frontend: `npm run dev`
3. Navega a `/chat` en tu aplicación
4. ¡Listo! Puedes chatear en tiempo real

## Características

- ✅ Conexión en tiempo real con Socket.io
- ✅ Reconexión automática si se pierde la conexión
- ✅ Historial de mensajes (últimos 50 al conectarse)
- ✅ Lista de usuarios conectados en tiempo real
- ✅ Notificaciones de usuarios que se unen/salen
- ✅ Diseño moderno estilo QuickChat/Messenger
- ✅ Soporte para modo oscuro
- ✅ Indicador de estado de conexión

## Notas

- Los mensajes se almacenan en memoria (se pierden al reiniciar el servidor)
- Máximo 100 mensajes en historial
- Se envían los últimos 50 mensajes a nuevos usuarios que se conectan
- El servidor soporta CORS para desarrollo local

## Eventos Socket.io

### Cliente → Servidor
- `user:join` - Usuario se une al chat
- `message:send` - Enviar un mensaje

### Servidor → Cliente
- `message:history` - Historial de mensajes (al conectarse)
- `message:new` - Nuevo mensaje recibido
- `users:list` - Lista de usuarios conectados
- `user:joined` - Notificación de usuario que se unió
- `user:left` - Notificación de usuario que se fue


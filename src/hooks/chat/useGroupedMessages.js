import { useMemo } from 'react'

const TIME_THRESHOLD = 5 * 60 * 1000 // 5 minutos en milisegundos

export function useGroupedMessages(messages) {
  return useMemo(() => {
    // Primero agrupar por fecha
    const dateGroups = []
    let currentDate = null
    let currentDateGroup = []

    messages.forEach(msg => {
      const msgDate = new Date(msg.timestamp)
      const dateKey = msgDate.toDateString()

      if (dateKey !== currentDate) {
        if (currentDateGroup.length > 0) {
          dateGroups.push({ date: currentDate, messages: currentDateGroup })
        }
        currentDate = dateKey
        currentDateGroup = [msg]
      } else {
        currentDateGroup.push(msg)
      }
    })

    if (currentDateGroup.length > 0) {
      dateGroups.push({ date: currentDate, messages: currentDateGroup })
    }

    // Ahora agrupar mensajes consecutivos del mismo usuario dentro de cada fecha
    const finalGroups = dateGroups.map(dateGroup => {
      const userGroups = []
      let currentUserGroup = []
      let lastMsgTime = null
      let lastUserId = null

      dateGroup.messages.forEach((msg, index) => {
        const msgTime = new Date(msg.timestamp).getTime()
        const msgUserId = msg.userId || msg.user

        // Si es el primer mensaje, iniciar grupo
        if (index === 0) {
          currentUserGroup = [msg]
          lastMsgTime = msgTime
          lastUserId = msgUserId
          return
        }

        // Verificar si el mensaje pertenece al grupo actual:
        // - Mismo usuario
        // - Diferencia de tiempo menor al umbral
        const timeDiff = msgTime - lastMsgTime
        const isSameUser = String(msgUserId) === String(lastUserId)
        const isWithinTimeThreshold = timeDiff <= TIME_THRESHOLD

        if (isSameUser && isWithinTimeThreshold) {
          // Agregar al grupo actual
          currentUserGroup.push(msg)
        } else {
          // Guardar grupo anterior y empezar uno nuevo
          if (currentUserGroup.length > 0) {
            userGroups.push({
              userId: lastUserId,
              messages: currentUserGroup,
            })
          }
          currentUserGroup = [msg]
        }

        lastMsgTime = msgTime
        lastUserId = msgUserId
      })

      // Agregar el último grupo
      if (currentUserGroup.length > 0) {
        userGroups.push({
          userId: lastUserId,
          messages: currentUserGroup,
        })
      }

      return {
        date: dateGroup.date,
        userGroups,
      }
    })

    return finalGroups
  }, [messages])
}


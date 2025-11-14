import { useEffect, useRef } from 'react'

/**
 * Hook que detecta actividad del usuario y ejecuta un callback cuando hay actividad.
 * Si onActivity es null, el hook no hace nada (útil para desactivar la detección).
 */
export function useActivityTracker(onActivity, inactivityTimeout = 60000) {
  const onActivityRef = useRef(onActivity)
  const throttleTimerRef = useRef(null)

  useEffect(() => {
    onActivityRef.current = onActivity
  }, [onActivity])

  useEffect(() => {
    // Si no hay callback, no hacer nada
    if (!onActivity) return

    const events = ['click', 'mousedown', 'mousemove', 'keydown', 'keypress', 'touchstart']

    const handleActivity = () => {
      if (throttleTimerRef.current || !onActivityRef.current) return
      
      throttleTimerRef.current = setTimeout(() => {
        onActivityRef.current?.()
        throttleTimerRef.current = null
      }, 1000) // Throttle de 1 segundo
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current)
      }
    }
  }, [onActivity])
}

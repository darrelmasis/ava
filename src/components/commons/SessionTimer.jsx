import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const pad = value => value.toString().padStart(2, '0')

const getRemainingParts = ms => {
  if (!ms || ms <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  }

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  }
}

export default function SessionTimer({ className = '' }) {
  const { sessionExpiry, loading } = useAuth()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!sessionExpiry) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionExpiry])

  const remaining = useMemo(() => {
    if (!sessionExpiry) return null
    return sessionExpiry - now
  }, [sessionExpiry, now])

  if (loading || !sessionExpiry) return null

  const { days, hours, minutes, seconds } = getRemainingParts(remaining)
  const expired = remaining <= 0

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
        expired
          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
          : 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300'
      } ${className}`.trim()}
      title={
        expired
          ? 'La sesión expiró. Se cerrará automáticamente en breve.'
          : 'Tiempo restante antes de que la sesión caduque'
      }
    >
      <span>{expired ? 'Sesión expirada' : 'Sesión expira en'}</span>
      {!expired && (
        <span className="font-mono text-sm tracking-tight">
          {days}:{hours}:{minutes}:{seconds}
        </span>
      )}
    </div>
  )
}


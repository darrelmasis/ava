import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import axios from 'axios'
import { useActivityTracker } from '../hooks/useActivityTracker'

const AuthContext = createContext()
const API_URL = import.meta.env.VITE_LOCAL_URL || ''

// Configurar axios para enviar cookies en todas las peticiones
axios.defaults.withCredentials = true

// Constantes
const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutos

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)

  const inactivityTimerRef = useRef(null)
  const logoutRef = useRef(null)
  const rememberMeRef = useRef(false)
  const userRef = useRef(null)

  // Normalizar usuario
  const normalizeUser = useCallback(rawUser => {
    if (!rawUser || typeof rawUser !== 'object') return null
    const normalized = {
      ...rawUser,
      userName: rawUser.userName || rawUser.username,
    }
    if (normalized.username && normalized.userName) {
      delete normalized.username
    }
    return normalized
  }, [])

  // Limpiar timer de inactividad
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
  }, [])

  // Resetear timer de inactividad (solo si rememberMe = false)
  const resetInactivityTimer = useCallback(() => {
    // Usar refs para evitar problemas de sincronización
    if (rememberMeRef.current || !userRef.current) {
      clearInactivityTimer()
      return
    }

    clearInactivityTimer()

    const newExpiry = Date.now() + INACTIVITY_TIMEOUT
    setSessionExpiry(newExpiry)

    inactivityTimerRef.current = setTimeout(() => {
      if (logoutRef.current && userRef.current && !rememberMeRef.current) {
        logoutRef.current()
      }
    }, INACTIVITY_TIMEOUT)
  }, [clearInactivityTimer])

  // Actualizar refs cuando cambian los estados
  useEffect(() => {
    rememberMeRef.current = rememberMe
  }, [rememberMe])

  useEffect(() => {
    userRef.current = user
  }, [user])

  // Hook de actividad (solo activo si rememberMe = false)
  useActivityTracker(rememberMe ? null : resetInactivityTimer, INACTIVITY_TIMEOUT)

  // Logout
  const logout = useCallback(async () => {
    clearInactivityTimer()
    setSessionExpiry(null)
    setRememberMe(false)
    rememberMeRef.current = false
    userRef.current = null

    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true, // Asegurar que se envíen las cookies
        }
      )
    } catch (err) {
      console.error('Error en logout:', err)
    } finally {
      setUser(null)
      window.__role = null
      window.__username = null
    }
  }, [API_URL, clearInactivityTimer])

  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  // Login
  const login = async loginData => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        loginData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // Asegurar que se envíen/reciban cookies
        }
      )

      if (!res.data || !res.data.user) {
        return { ok: false, message: 'Respuesta inválida del servidor' }
      }

      const normalizedUser = normalizeUser(res.data.user)
      if (!normalizedUser) {
        return {
          ok: false,
          message: 'Usuario inválido en la respuesta del servidor',
        }
      }

      const isRememberMe = res.data.rememberMe === true

      // Actualizar refs primero para evitar problemas de sincronización
      userRef.current = normalizedUser
      rememberMeRef.current = isRememberMe

      setUser(normalizedUser)
      setRememberMe(isRememberMe)

      // Si rememberMe: usar expiración del token (30 días)
      // Si no: iniciar timer de inactividad (5 minutos)
      if (isRememberMe) {
        // Usar la expiración del token JWT (30 días)
        const tokenExpiry = res.data.tokenExpiresAt ?? null
        setSessionExpiry(tokenExpiry)
        clearInactivityTimer()
        console.log('Login con rememberMe activo. Expira en:', new Date(tokenExpiry).toLocaleString())
      } else {
        // Iniciar timer de inactividad de 5 minutos
        clearInactivityTimer()
        setTimeout(() => {
          resetInactivityTimer()
        }, 0)
        console.log('Login sin rememberMe. Timer de inactividad iniciado (5 minutos)')
      }

      window.__role = normalizedUser.role
      window.__username = normalizedUser.userName

      return { ok: true, user: normalizedUser }
    } catch (err) {
      return {
        ok: false,
        message:
          err.response?.data?.message ||
          err.message ||
          'No se pudo iniciar sesión',
      }
    }
  }

  // Verificar sesión al cargar
  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true, // Asegurar que se envíen las cookies
        })
        const data = res.data

        if (typeof data !== 'object' || !data.user) {
          setUser(null)
          setSessionExpiry(null)
          setRememberMe(false)
          userRef.current = null
          rememberMeRef.current = false
          return
        }

        const normalized = normalizeUser(data.user)
        if (!normalized) {
          setUser(null)
          setSessionExpiry(null)
          setRememberMe(false)
          userRef.current = null
          rememberMeRef.current = false
          return
        }

        const isRememberMe = data.rememberMe === true

        // Actualizar refs primero
        userRef.current = normalized
        rememberMeRef.current = isRememberMe

        setUser(normalized)
        setRememberMe(isRememberMe)

        // Si rememberMe: usar expiración del token (30 días)
        // Si no: iniciar timer de inactividad (5 minutos)
        if (isRememberMe) {
          // Usar la expiración del token JWT (30 días)
          const tokenExpiry = data.tokenExpiresAt ?? null
          setSessionExpiry(tokenExpiry)
          clearInactivityTimer()
          // console.log('Sesión con rememberMe activo. Expira en:', new Date(tokenExpiry).toLocaleString())
        } else {
          // Iniciar timer de inactividad de 5 minutos
          clearInactivityTimer()
          setTimeout(() => {
            resetInactivityTimer()
          }, 0)
          console.log('Sesión sin rememberMe. Timer de inactividad iniciado (5 minutos)')
        }

        window.__role = normalized?.role || null
        window.__username = normalized?.userName || null
      } catch (err) {
        // 401 es esperado cuando no hay sesión válida
        if (err.response?.status !== 401) {
          console.warn('Error al verificar autenticación:', err)
        }
        setUser(null)
        setSessionExpiry(null)
        setRememberMe(false)
        userRef.current = null
        rememberMeRef.current = false
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [API_URL, normalizeUser, resetInactivityTimer])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      clearInactivityTimer()
    }
  }, [clearInactivityTimer])

  // Reiniciar timer cuando user o rememberMe cambian
  // IMPORTANTE: Solo aplicar timer de inactividad si rememberMe = false
  useEffect(() => {
    if (!user) {
      clearInactivityTimer()
      return
    }

    if (rememberMe) {
      // Si rememberMe está activo, NO aplicar timer de inactividad
      // El sessionExpiry ya está establecido con la expiración del token (30 días)
      clearInactivityTimer()
      return
    }

    // Solo aplicar timer de inactividad si rememberMe = false
    const timer = setTimeout(() => {
      resetInactivityTimer()
    }, 100)
    return () => clearTimeout(timer)
  }, [user, rememberMe, resetInactivityTimer, clearInactivityTimer])

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, sessionExpiry }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

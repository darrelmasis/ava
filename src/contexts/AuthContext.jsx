// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()
const API_URL = import.meta.env.VITE_LOCAL_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Axios por defecto enviará las cookies
  axios.defaults.withCredentials = true

  // -----------------------------
  //   Verificar sesión al cargar
  // -----------------------------
  useEffect(() => {
    if (!API_URL) {
      console.error('VITE_APP_API_URL no está definido')
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`)

        if (typeof res.data !== 'object') {
          console.error('El servidor no devolvió JSON válido en /me')
          setUser(null)
          return
        }

        setUser(res.data || null)
      } catch (err) {
        console.warn('Error al verificar autenticación:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // -----------------------------
  //               LOGIN
  // -----------------------------
  const login = async loginData => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginData, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.data || !res.data.user) {
        return { ok: false, message: 'Respuesta inválida del servidor' }
      }

      setUser(res.data.user)

      return { ok: true, user: res.data.user }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'No se pudo iniciar sesión'

      return { ok: false, message: msg }
    }
  }

  // -----------------------------
  //              LOGOUT
  // -----------------------------
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`)
    } catch (err) {
      console.error('Error en logout:', err)
    } finally {
      // El servidor ya borró la cookie → soltamos el usuario
      const lastUser = user?.username || null
      setUser(null)
      return lastUser
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

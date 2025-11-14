import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Login'
import { useAuth } from '../contexts/AuthContext'
import ProtectedRoute from '../utils/ProtectedRoutes'
import PublicRoute from '../utils/PublicRoutes'
import NotFoundPage from '../pages/NotFound' // Asegúrate de tener esta página
import UserProfile from '../pages/Profile' // Página de perfil de usuario
import Chat from '../pages/Chat' // Página de chat

const AppRoutes = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Ruta 404 pública */}
      <Route path="/404" element={<NotFoundPage />} />

      <Route element={<ProtectedRoute />}>
        {/* Ruta del perfil */}
        <Route path="/me/:username" element={<UserProfile />} />
        {/* Ruta del chat */}
        <Route path="/chat" element={<Chat />} />
      </Route>

      {/* Redirección por defecto al perfil del usuario */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/me/${user.userName}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Ruta 404 para cualquier otra ruta no definida */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes

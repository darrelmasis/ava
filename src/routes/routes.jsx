import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Login'
import { useAuth } from '../contexts/AuthContext'
import ProtectedRoute from '../utils/ProtectedRoutes'
import PublicRoute from '../utils/PublicRoutes'
import NotFoundPage from '../pages/NotFound' // Asegúrate de tener esta página
import UserProfile from '../pages/Profile' // Página de perfil de usuario

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

      <Route element={<ProtectedRoute />}>
        {/* Ruta dinámica del perfil */}
        <Route path="/:username" element={<UserProfile />} />
      </Route>

      {/* Redirección por defecto al username */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.username}`} replace />
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

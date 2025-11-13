import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import Loader from '../components/commons/Loader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Si ya sabemos que no hay usuario, redirigimos inmediatamente
  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  // Mientras carga, mostramos un loader
  if (loading) {
    return <Loader />
  }

  // Si hay usuario, renderizamos los hijos
  return children ? children : <Outlet />
}

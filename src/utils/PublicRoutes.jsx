import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loader from '../components/commons/Loader'

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  

  // Mientras carga, mostramos el loader
  if (loading) {
    return <Loader />
  }

  // Si ya hay un usuario logueado, redirige al perfil
  if (user && user.userName) {
    return <Navigate to={`/me/${user.userName}`} replace />
  }

  // Si no hay usuario, renderiza el contenido (por ejemplo, LoginPage)
  return children
}

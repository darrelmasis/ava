import { useAuth } from '../contexts/AuthContext'
import { useParams, Navigate } from 'react-router-dom'
import Box from '../components/layout/Box'
import Avatar from '../components/commons/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Loader from '../components/commons/Loader'
import SessionTimer from '../components/commons/SessionTimer'

export default function UserProfile() {
  const { user, loading } = useAuth()
  const { username } = useParams()

  // Remover el @ si viene en la URL
  const urlUsername = username?.startsWith('@') ? username.slice(1) : username

  // Si está cargando, mostrar loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <Loader />
      </div>
    )
  }

  // Si no hay usuario logueado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Validar que el username de la URL coincida con el usuario logueado
  // Si no coincide, redirigir a 404
  if (urlUsername && urlUsername !== user.userName) {
    return <Navigate to="/404" replace />
  }

  // Calcular fecha de registro formateada
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 px-4 md:px-0 pb-8 mt-8">
      {/* Header sin gradiente */}
      <div className="grid grid-cols-12 gap-8 max-w-6xl mx-auto mb-8">
        <Box className="col-span-12 md:col-span-4 relative">
          {/* Badge del rol en la esquina superior derecha del Box */}
          {user?.role && (
            <div className="absolute top-4 right-4">
              <Badge variant="lime" size="xs">
                {user.role}
              </Badge>
            </div>
          )}

          <div className="flex flex-col items-center">
            {/* === Avatar === */}
            <div className="p-1 bg-neutral-200 dark:bg-neutral-700 rounded-full relative mb-4">
              <Avatar name={user?.fullName || user?.userName} size="xl" />
            </div>

            {/* === Información del usuario === */}
            <div className="w-full text-center">
              {/* Nombre y username */}
              <h1 className="text-xl text-gray-900 dark:text-white mb-2">
                {user?.fullName || 'Usuario'}
              </h1>
              <span className="text-gray-700 dark:text-neutral-500 text-lg mb-2 block">
                @{user?.userName}
              </span>

              {/* Email */}
              {user?.email && (
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </Box>

        <Box className="col-span-12 md:col-span-8 text-gray-600 dark:text-gray-400 place-content-center flex items-center">
          <p className="text-lg">
            (espacio disponible para futuras secciones o estadísticas)
          </p>
        </Box>
      </div>

      {/* Sección de arqueos */}
      <Box className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-lime-600 dark:text-lime-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Mis arqueos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestiona y visualiza todos tus arqueos registrados
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Arqueo
          </Button>
        </div>

        {/* Estado vacío mejorado */}
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-lime-600 dark:text-lime-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay arqueos registrados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Comienza creando tu primer arqueo para llevar un registro de tus
              ventas y operaciones.
            </p>
            <Button variant="primary" size="md" className="shadow-sm">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear mi primer arqueo
            </Button>
          </div>
        </div>
      </Box>
    </div>
  )
}

import { useAuth } from '../contexts/AuthContext'
import Box from '../components/layout/Box'
import Avatar from '../components/commons/Avatar'
import Button from '../components/ui/Button'

export default function UserProfile() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-neutral-100 dark:bg-neutral-900 px-4 py-12">
      {/* Encabezado de perfil */}
      <Box className="max-w-md w-full text-center p-8 mb-10">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative">
            <Avatar name={user?.fullName || user?.userName} size="xxl" />
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white dark:border-neutral-800 rounded-full"></span>
          </div>

          {/* Nombre */}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
            {user?.fullName}
          </h1>

          {/* Username */}
          <p className="text-gray-500 dark:text-gray-400">@{user?.userName}</p>

          {/* Rol */}
          <p className="mt-2 px-3 py-1 text-sm rounded-full bg-lime-100 dark:bg-lime-800/40 text-lime-700 dark:text-lime-300 font-medium capitalize">
            {user?.role}
          </p>
        </div>

        {/* Información básica */}
        <div className="mt-8 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-2">
            <span className="text-gray-600 dark:text-gray-400">Correo</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {user?.email}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-2">
            <span className="text-gray-600 dark:text-gray-400">Usuario</span>
            <span className="text-gray-900 dark:text-white font-medium">
              @{user?.userName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Miembro desde</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </div>
      </Box>

      {/* Sección de arqueos */}
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mis arqueos</h2>
          <Button
            variant="primary"
            className="px-4 py-2 text-sm font-medium rounded-lg shadow-sm"
          >
            + Nuevo Arqueo
          </Button>
        </div>

        {/* Tabla vacía */}
        <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Sucursal</th>
                <th className="px-4 py-3">Total Ventas</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No hay arqueos registrados todavía.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useAuth } from '@/contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import Avatar from '@/components/commons/Avatar'
import Logo from '@/assets/logo.svg'
import Button from '@/components/ui/Button'

export default function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()

  // No renderizar el Header si estamos en /login
  if (location.pathname === '/login') {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* === Logo AVA === */}
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Logo AVA"
            className="w-16 select-none"
            draggable="false"
          />
        </div>

        {/* === Usuario === */}
        <div className="flex items-center gap-4">
          {/* Datos del usuario */}
          {/* Avatar */}
          <div className="relative">
            <Avatar name={user?.fullName || user?.userName} size="sm" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {user?.fullName || user?.userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{user?.userName}
            </p>
          </div>


          {/* Botón de cierre de sesión */}
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}

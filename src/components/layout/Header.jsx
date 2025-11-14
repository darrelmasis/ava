import { useAuth } from '@/contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import Avatar from '@/components/commons/Avatar'
import Logo from '@/assets/logo.svg'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../ui/Dropdown'
import Toggle from '../ui/Toggle'
import { useTheme } from '../../hooks/useTheme'
import Badge from '../ui/Badge'

// Todos los hooks primero
export default function Header() {
  const { user, logout, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  // Redirecciona AL TERMINAR el logout (cuando user=null)
  useEffect(() => {
    if (loggingOut && !user && !loading) {
      navigate('/login', { replace: true })
    }
  }, [loggingOut, user, navigate, loading])

  // Después de TODOS los hooks, ahora sí el return condicional:
  if (['/login', '/404'].includes(location.pathname)) return null

  const displayName = user?.fullName || user?.userName || 'Invitado'

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
    } catch (err) {
      console.error(err)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-0">
      <div className="max-w-6xl mx-auto py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={Logo}
            alt="Logo AVA"
            className="w-16 select-none"
            draggable="false"
          />
        </div>

        <Dropdown placement="bottom-end" closeOnClickOutside closeOnScroll>
          <DropdownTrigger>
            <button
              className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1.5"
              disabled={loading}
            >
              <Avatar name={displayName} size="sm" />
              <span className="hidden sm:inline text-neutral-900 dark:text-white font-medium truncate max-w-[140px]">
                {displayName}
              </span>
            </button>
          </DropdownTrigger>

          <DropdownContent className="flex flex-col gap-4">
            {/* === HEADER === */}
            <div className="flex items-center px-2 py-4 border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 rounded-sm gap-4">
              <Avatar name={displayName} size="md" />
              <div className="text-sm">
                <div className="font-medium text-lime-900 dark:text-white gap-2 flex items-center">
                  <span>{displayName}</span>
                  <span className="text-neutral-400 text-xs">
                    @{user?.userName}
                  </span>
                </div>
                <div className="truncate text-neutral-400 dark:text-neutral-400 flex gap-5">
                  <span>{user?.email}</span>
                  <span className="px-[4px] py-[1px] text-xs rounded-full bg-lime-100 dark:bg-lime-800/40 text-lime-700 dark:text-lime-300 font-medium capitalize border border-lime-200 dark:border-lime-700">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* === MENU === */}
            <ul className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
              <DropdownItem
                as="a"
                onClick={() => navigate(`/me/${user?.userName}`)}
              >
                Perfil
              </DropdownItem>

              <DropdownItem
                as="a"
                onClick={() => navigate(`/chat`)}
                className='justify-between'
              >
                <span>Chat</span>
                <Badge size='sm' variant='success'>Beta</Badge>
              </DropdownItem>

              <DropdownItem variant="disabled" as="span">
                Configuración
              </DropdownItem>

              <DropdownItem
                onClick={() => toggleTheme(!isDark)}
                className="flex items-center justify-between select-none"
              >
                <span className="text-sm text-neutral-900 dark:text-white">
                  Modo oscuro
                </span>
                <Toggle
                  checked={isDark}
                  onChange={checked => toggleTheme(checked)}
                  onClick={e => e.stopPropagation()}
                />
              </DropdownItem>

              <DropdownSeparator />

              {/* === Logout === */}
              <DropdownItem
                variant="danger"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Cerrando...
                  </span>
                ) : (
                  'Cerrar sesión'
                )}
              </DropdownItem>
            </ul>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  )
}

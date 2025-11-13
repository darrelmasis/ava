import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginImage from '@/assets/login_image.svg'
import Logo from '@/assets/logo.svg'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import Box from '../components/layout/Box'
import Checkbox from '../components/ui/Checkbox'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [data, setData] = useState({
    username: '',
    password: '',
  })

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername')
    if (savedUsername) {
      setData(prev => ({ ...prev, username: savedUsername }))
      setRememberMe(true)
    }
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  // CORRECCIÓN: Función específica para el checkbox
  const handleRememberMeChange = checked => {
    setRememberMe(checked)
  }

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const loginData = {
        username: data.username,
        password: data.password,
        rememberMe,
      }

      const response = await login(loginData)

      if (response.ok) {
        // Guardar username en localStorage si corresponde
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', data.username)
        } else {
          localStorage.removeItem('rememberedUsername')
        }

        if (response.user?.username) {
          navigate(`/${response.user.username}`)
        } else {
          console.error('Username no disponible en la respuesta:', response)
          setError('No se pudo determinar el usuario autenticado.')
        }
      } else {
        setError(response.message || 'Credenciales inválidas')
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-lime-50 via-white to-lime-100 dark:from-neutral-800 dark:via-neutral-900 dark:to-lime-900/20 transition-colors duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
          {/* Sección de imagen con mejoras */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
            {/* <div className="relative">
              <img
                src={LoginImage}
                alt="Login Illustration"
                className="w-full max-w-sm"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-lime-200 to-green-200 rounded-2xl blur-xl opacity-30 -z-10"></div>
            </div> */}
            <div className="relative inline-block">
              <img src={Logo} alt="Logo" className="h-16" />
              <div className="absolute -inset-2 bg-gradient-to-r from-lime-500 to-green-500 rounded-full blur opacity-20 -z-10"></div>
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Arqueo de vendedores
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Herramienta para gestionar y controlar los arqueos de vendedores
                de manera eficiente y segura.
              </p>
            </div>
          </div>

          {/* Formulario con mejoras visuales */}
          <Box className="w-full max-w-md transform hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Usuario
                  </label>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                    required
                    autoComplete="username"
                    disabled={loading}
                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>
              </div>

              {/* Checkbox Recordar usuario - CORREGIDO */}
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange} // ← CORREGIDO: pasa la función directamente
                  label="Recordar usuario"
                  disabled={loading}
                />
                {/* 
                <a
                  href="#"
                  className="text-sm text-lime-600 hover:text-lime-800 dark:text-lime-400 dark:hover:text-lime-300 transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </a> */}
              </div>

              <Button
                type="submit"
                size="lg"
                loadingText="Ingresando..."
                disabled={loading}
                loading={loading}
                className="w-full transition-all duration-200"
              >
                Iniciar Sesión
              </Button>
            </form>

            {error && (
              <Alert
                variant="error"
                message={error}
                className="mt-6 animate-in slide-in-from-top duration-300"
                dismissible
                onDismiss={() => setError('')}
              />
            )}
          </Box>
        </div>
      </div>
    </>
  )
}

export default LoginPage

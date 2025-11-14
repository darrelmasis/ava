// pages/NotFound.jsx
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-lime-900/10 px-4">
      <div className="text-center max-w-md">
        {/* Número 404 con estilo mejorado */}
        <div className="relative mb-6">
          <h1 className="text-8xl md:text-9xl font-black text-lime-600 dark:text-lime-400 tracking-tight">
            404
          </h1>
          {/* Efecto de sombra text */}
          <div className="absolute inset-0 text-8xl md:text-9xl font-black text-lime-700 dark:text-lime-500 opacity-20 blur-sm -z-10">
            404
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            La página que estás buscando no existe o ha sido movida. Verifica la
            URL o regresa al inicio.
          </p>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <Link to="/">
            <Button
              size="lg"
              className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Volver al inicio</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

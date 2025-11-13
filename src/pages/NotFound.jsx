// pages/NotFound.jsx
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-lime-900/10 px-4">
      <div className="text-center max-w-md">
        {/* Ilustración/Icono */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-lime-600 dark:text-lime-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8a7.962 7.962 0 01-2 5.291" 
              />
            </svg>
          </div>
          {/* Efecto de fondo decorativo */}
          <div className="absolute -inset-4 bg-lime-200 dark:bg-lime-800/20 rounded-full blur-xl opacity-30 -z-10"></div>
        </div>

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
            La página que estás buscando no existe o ha sido movida. 
            Verifica la URL o regresa al inicio.
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
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Volver al inicio</span>
              </div>
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ¿Necesitas ayuda?{' '}
            <a 
              href="#" 
              className="text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium transition-colors duration-200"
            >
              Contactar soporte
            </a>
          </div>
        </div>

        {/* Elementos decorativos de fondo */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-lime-300 dark:bg-lime-600 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-lime-400 dark:bg-lime-500 rounded-full opacity-10 blur-xl"></div>
      </div>
    </div>
  )
}

export default NotFoundPage
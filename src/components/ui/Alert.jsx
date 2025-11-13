import { useState } from "react";

/**
 * Componente Alert reutilizable para mensajes
 * 
 * @param {string} variant - Variante: 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} dismissible - Si se puede cerrar
 * @param {function} onDismiss - Handler para cerrar
 * @param {string} className - Clases CSS adicionales
 */
export default function Alert({
  variant = "info",
  message,
  dismissible = false,
  onDismiss,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !message) return null;

  const variants = {
    success: "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300",
    error: "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-300",
    info: "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300",
  };

  const variantClass = variants[variant] || variants.info;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div
      className={`p-3 border rounded-lg ${variantClass} ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Cerrar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

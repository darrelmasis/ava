import { forwardRef } from 'react'
import classNames from 'classnames'

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      type = 'button',
      loadingText = 'Cargando...',
      className = '',
      children,
      ...props
    },
    ref
  ) => {

    // ---- BASE ----
    const baseClasses =
      'inline-flex items-center justify-center font-semibold transition-all ' +
      'focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed'

    // ---- SIZES ----
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    // ---- VARIANTS ----
    const variants = {
      primary:
        'rounded-lg bg-lime-500 text-neutral-900 hover:bg-lime-400 ' +
        'focus:ring-lime-500 dark:bg-lime-600 dark:text-neutral-50 ' +
        'dark:hover:bg-lime-700 dark:focus:ring-lime-100',

      capsule:
        'rounded-full bg-lime-500 text-neutral-900 hover:bg-lime-400 ' +
        'focus:ring-lime-500 dark:bg-lime-600 dark:text-neutral-50 ' +
        'dark:hover:bg-lime-700 dark:focus:ring-lime-100',

      outline:
        'rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-100 ' +
        'dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800',

      link:
        'rounded-md px-1 text-lime-600 hover:underline dark:text-lime-400 ' +
        'bg-transparent border-none shadow-none',
    }

    const variantClass = variants[variant] || variants.primary
    const sizeClass = sizes[size] || sizes.md

    const buttonClasses = classNames(baseClasses, variantClass, sizeClass, className)

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={buttonClasses}
        {...props}
      >
        {loading ? (
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
            {loadingText}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

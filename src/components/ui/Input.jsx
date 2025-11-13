import { forwardRef } from 'react'
import classNames from 'classnames'

const Input = forwardRef(
  (
    {
      type = 'text',
      name,
      value,
      onChange,
      placeholder,
      label,
      error,
      required = false,
      disabled = false,
      icon = null,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputClasses = classNames(
      'w-full px-4 py-3 rounded-lg border outline-none transition-all',
      'focus:ring-1 focus:ring-lime-500 focus:border-lime-500',
      'bg-neutral-100 text-black border-gray-300', // modo claro
      'dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-600', // modo oscuro
      {
        'border-red-500 ring-2 ring-red-500/40 focus:ring-red-500': error,
        'opacity-50 cursor-not-allowed': disabled,
        'pl-10': icon, // espacio para ícono
      },
      className
    )

    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {error && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

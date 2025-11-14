import React from 'react'
import classNames from 'classnames'

export default function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) {
  const id = React.useId()

  return (
    <label
      htmlFor={id}
      className={classNames(
        'inline-flex items-center cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />

      <div
        className={classNames(
          'relative w-9 h-5 rounded-full',
          'peer-focus:outline-none',
          'peer-focus:ring-4 peer-focus:ring-lime-300 dark:peer-focus:ring-lime-900',
          // Track - Unchecked state
          'bg-neutral-300 dark:bg-neutral-600',
          // Track - Checked state
          'peer-checked:bg-lime-500 dark:peer-checked:bg-lime-600',
          // Handle using after pseudo-element
          'after:content-[""]',
          'after:absolute after:top-[2px] after:start-[2px]',
          'after:bg-white dark:after:bg-neutral-100',
          'after:rounded-full after:h-4 after:w-4',
          'after:transition-all after:duration-300 after:ease-in-out',
          // Handle movement when checked
          'peer-checked:after:translate-x-full',
          'rtl:peer-checked:after:-translate-x-full',
          // Disabled state
          'peer-disabled:bg-neutral-200 dark:peer-disabled:bg-neutral-700',
          'peer-disabled:after:bg-neutral-100 dark:peer-disabled:after:bg-neutral-500'
        )}
      />

      {label && (
        <span className="select-none ms-3 text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
      )}
    </label>
  )
}

import React from 'react'
import classNames from 'classnames'

export default function Badge({
  children,
  variant = 'default', // 'default', 'lime', 'neutral', 'success', 'warning', 'danger'
  size = 'md', // 'xs', 'sm', 'md', 'lg'
  className = '',
}) {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full border capitalize'

  const variantClasses = {
    default: classNames(
      'bg-neutral-100 dark:bg-neutral-800/40',
      'text-neutral-700 dark:text-neutral-300',
      'border-neutral-200 dark:border-neutral-700'
    ),
    lime: classNames(
      'bg-lime-100 dark:bg-lime-800/40',
      'text-lime-700 dark:text-lime-300',
      'border-lime-200 dark:border-lime-700'
    ),
    neutral: classNames(
      'bg-neutral-200 dark:bg-neutral-700',
      'text-neutral-800 dark:text-neutral-200',
      'border-neutral-300 dark:border-neutral-600'
    ),
    success: classNames(
      'bg-green-100 dark:bg-green-800/40',
      'text-green-700 dark:text-green-300',
      'border-green-200 dark:border-green-700'
    ),
    warning: classNames(
      'bg-yellow-100 dark:bg-yellow-800/40',
      'text-yellow-700 dark:text-yellow-300',
      'border-yellow-200 dark:border-yellow-700'
    ),
    danger: classNames(
      'bg-red-100 dark:bg-red-800/40',
      'text-red-700 dark:text-red-300',
      'border-red-200 dark:border-red-700'
    ),
  }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}


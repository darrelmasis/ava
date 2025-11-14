import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
  arrow,
} from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames'

export const DropdownContext = createContext(null)

export const Dropdown = ({
  children,
  closeOnClickOutside = true,
  closeOnScroll = true,
  placement = 'bottom-end',
  offsetX = 0,
}) => {
  const [open, setOpen] = useState(false)
  const [arrowEl, setArrowEl] = useState(null)

  const middleware = useMemo(
    () => [
      offset({ mainAxis: 8, crossAxis: offsetX }),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowEl }),
    ],
    [arrowEl, offsetX]
  )

  // Cierre al hacer scroll
  useEffect(() => {
    if (!closeOnScroll) return

    const handleScroll = () => {
      if (open) setOpen(false)
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open, closeOnScroll])

  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePress: closeOnClickOutside,
  })
  const role = useRole(context, { role: 'listbox' })
  const interactions = useInteractions([click, dismiss, role])

  const contextValue = {
    open,
    setOpen,
    toggle: () => setOpen(prev => !prev),
    close: () => setOpen(false),
    refs,
    context,
    interactions,
    x,
    y,
    strategy,
    setArrowEl,
  }

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  )
}

export const DropdownTrigger = ({ children, className }) => {
  const { refs, interactions, open } = useContext(DropdownContext)

  if (!refs || !interactions) {
    throw new Error(
      'DropdownTrigger debe usarse dentro de un componente <Dropdown>'
    )
  }

  const triggerClasses = classNames('dropdown-trigger', { open }, className)

  return (
    <div
      className={triggerClasses}
      ref={refs.setReference}
      {...interactions.getReferenceProps()}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  )
}

export const DropdownContent = ({ children, className }) => {
  const { refs, interactions, strategy, x, y, context, setArrowEl, open } =
    useContext(DropdownContext)

  if (!refs || !interactions) {
    throw new Error(
      'DropdownContent debe usarse dentro de un componente <Dropdown>'
    )
  }

  // Determinar el origen de la transformación basado en la posición
  const getTransformOrigin = () => {
    if (!context) return 'top'
    const placement = context.placement
    if (placement.startsWith('top')) return 'bottom'
    if (placement.startsWith('bottom')) return 'top'
    if (placement.startsWith('left')) return 'right'
    if (placement.startsWith('right')) return 'left'
    return 'top'
  }

  const transformOrigin = getTransformOrigin()

  return (
    <FloatingPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={refs.setFloating}
            {...interactions.getFloatingProps()}
            className={classNames(
              'dropdown-content bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50 p-2',
              className
            )}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              transformOrigin,
            }}
            initial={{ opacity: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            transition={{
              duration: 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <FloatingArrow
              ref={setArrowEl}
              context={context}
              width={16}
              height={8}
              tipRadius={2}
              fill="white"
              stroke="#171717"
              strokeWidth={0.25}
              className="[&>path]:fill-white [&>path]:dark:fill-neutral-900 [&>path]:stroke-neutral-200 [&>path]:dark:stroke-neutral-700"
              style={{ transform: 'translateY(-0.25px)' }}
            />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  )
}

export const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  variant = 'default', // 'default', 'danger', 'disabled'
  className = '',
  as = 'button', // 'button', 'a', 'div'
  ...props
}) => {
  const baseClasses = classNames(
    'inline-flex items-center w-full p-2 rounded transition',
    className
  )

  const variantClasses = {
    default: classNames(
      'cursor-pointer',
      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      'hover:text-neutral-900 dark:hover:text-white',
      'text-neutral-700 dark:text-neutral-300',
      'font-medium'
    ),
    danger: classNames(
      'cursor-pointer',
      'text-red-600 dark:text-red-400',
      'hover:bg-red-300/20 dark:hover:bg-red-900/30',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ),
    disabled: classNames(
      'text-neutral-400 dark:text-neutral-600',
      'cursor-not-allowed opacity-60'
    ),
  }

  const classes = classNames(
    baseClasses,
    variantClasses[variant],
    disabled && 'opacity-50 cursor-not-allowed'
  )

  const Component = as

  return (
    <li>
      <Component
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {children}
      </Component>
    </li>
  )
}

export const DropdownSeparator = ({ className = '' }) => {
  return (
    <li
      className={classNames(
        'border-t border-neutral-300 dark:border-neutral-700 my-1.5',
        className
      )}
    />
  )
}

export const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error(
      'useDropdown debe usarse dentro de un componente <Dropdown>'
    )
  }
  return context
}

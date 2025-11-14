import toast, { Toaster } from 'react-hot-toast'

const MAX_TOASTS = 3
const activeToastIds = []

const baseStyles = {
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--fs-medium)',
  fontWeight: 'var(--fw-bold)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-color)',
}

const toastTypes = {
  success: {
    style: {
      ...baseStyles,
      background: 'var(--success-50)',
      color: 'var(--success-800)',
      borderColor: 'var(--success-200)',
    },
  },
  error: {
    style: {
      ...baseStyles,
      background: 'var(--danger-50)',
      color: 'var(--danger-800)',
      borderColor: 'var(--danger-200)',
    },
  },
  warning: {
    style: {
      ...baseStyles,
      background: 'var(--warning-50)',
      color: 'var(--warning-800)',
      borderColor: 'var(--warning-200)',
    },
  },
  info: {
    style: {
      ...baseStyles,
      background: 'var(--info-50)',
      color: 'var(--info-800)',
      borderColor: 'var(--info-200)',
    },
  },
}

const limitedToast = (message, options = { sound: 'notifyInfo' }) => {
  if (activeToastIds.length >= MAX_TOASTS) {
    const oldestId = activeToastIds.shift()
    toast.dismiss(oldestId)
  }

  const id = options.id || Math.random().toString(36).slice(2)
  activeToastIds.push(id)

  const showToast = () => {
    const toastId = toast(message, {
      duration: 3000,
      position: 'bottom-right',
      ...options,
      id,
      onDismiss: t => {
        const index = activeToastIds.indexOf(t.id)
        if (index > -1) activeToastIds.splice(index, 1)
        options.onDismiss?.(t)
      },
    })

    return toastId
  }

  if (options.delay > 0) return setTimeout(showToast, options.delay * 1000)

  return showToast()
}

// Métodos específicos con soporte de delay
Object.keys(toastTypes).forEach(type => {
  limitedToast[type] = (message, options = {}) =>
    limitedToast(message, {
      ...toastTypes[type],
      ...options,
    })
})

// Re-exportar utilidades
limitedToast.dismiss = toast.dismiss
limitedToast.remove = toast.remove
limitedToast.promise = toast.promise
limitedToast.loading = toast.loading

export { limitedToast }

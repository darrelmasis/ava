/**
 * Valida un campo según su tipo.
 * @param {string} value - Valor a validar
 * @param {string} type - Tipo de validación: "text", "email", "password", "username", "confirm-password"
 * @param {string} currentPassword - Contraseña actual (solo necesario para confirm-password)
 * @returns {string|null} - Mensaje de error o null si es válido
 */
export const validateFields = (value, type = 'text', currentPassword) => {
  // Validación básica de campo obligatorio
  if (!value || value.trim() === '') {
    return 'Este campo es obligatorio.'
  }

  switch (type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!value.includes('@'))
        return 'El correo electrónico debe contener "@".'
      if (!value.includes('.'))
        return 'El correo electrónico debe incluir un dominio válido (por ejemplo: .com, .org).'
      if (!emailRegex.test(value))
        return 'El formato del correo electrónico no es válido.'

      break
    }

    case 'password': {
      // Mínimo 6 caracteres, al menos una mayúscula, un número y un carácter especial
      const pwdRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/

      if (value.length < 6)
        return 'La contraseña debe tener al menos 6 caracteres.'
      if (!/[A-Z]/.test(value))
        return 'La contraseña debe incluir al menos una letra mayúscula.'
      if (!/\d/.test(value))
        return 'La contraseña debe incluir al menos un número.'
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))
        return 'La contraseña debe incluir al menos un carácter especial.'
      if (!pwdRegex.test(value))
        return 'La contraseña no cumple con los requisitos de seguridad.'

      break
    }

    case 'confirm-password': {
      if (value !== currentPassword) return 'Las contraseñas no coinciden'
      break
    }

    case 'username': {
      // Solo letras, números, guiones y guiones bajos; entre 3 y 20 caracteres
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
      if (!usernameRegex.test(value))
        return 'El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números, guiones o guiones bajos.'
      break
    }

    case 'text':
    default:
      // Solo verificar que no esté vacío y tenga longitud mínima
      if (value.trim().length < 2)
        return 'Este campo debe tener al menos 2 caracteres.'
      break
  }

  return null
}

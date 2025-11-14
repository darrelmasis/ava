import { connectDB } from '../_config/db_connection.js'
import User from '../_models/User.model.js'
import { getCorsHeaders } from '../_utils/cors.js'
import bcrypt from 'bcryptjs'
import { validateFields } from '../_utils/validateFields.js'

const buildValidationSchema = body => ({
  fullName: { value: body.fullName?.trim(), type: 'text' },
  email: { value: body.email?.trim(), type: 'email' },
  password: { value: body.password, type: 'password' },
  confirmPassword: {
    value: body.confirmPassword,
    type: 'confirm-password',
    currentPassword: body.password,
  },
})

const insertUser = async (req, res) => {
  // Configurar CORS
  const CORS_HEADERS = getCorsHeaders(req)
  Object.entries(CORS_HEADERS).forEach(([key, value]) =>
    res.setHeader(key, value)
  )

  const METHOD = req.method

  if (METHOD === 'OPTIONS') return res.status(200).end()
  if (METHOD !== 'POST')
    return res.status(405).json({ message: 'Método no permitido' })

  const { fullName, email, password, confirmPassword } = req.body // Agregué confirmPassword
  const fields = buildValidationSchema(req.body)
  const errors = {}

  for (const [key, field] of Object.entries(fields)) {
    const error = validateFields(field.value, field.type, field.currentPassword)
    if (error) errors[key] = error
  }

  // Si hay errores de validación, detenemos el flujo
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors,
    })
  }

  try {
    await connectDB()

    // Extraer nombre de usuario del email
    const userName = email.split('@')[0]

    // 🔍 Comprobamos que no exista usuario duplicado
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    })
    if (existingUser) {
      return res.status(409).json({
        message: 'El nombre de usuario o email ya está en uso',
      })
    }

    // 🔒 Encriptar contraseña
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // 🧾 Crear usuario y guardar la referencia
    const newUser = await User.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
      // El campo 'role' no se incluye porque el modelo ya tiene el valor por defecto 'auditor'
    })

    // Retornar los datos del usuario creado (sin la contraseña)
    return res.status(201).json({
      message: '¡Usuario creado con éxito!',
      // data: {
      //   id: newUser._id,
      //   fullName: newUser.fullName,
      //   userName: newUser.userName,
      //   email: newUser.email,
      //   role: newUser.role, // Esto debería ser 'auditor' por defecto
      //   createdAt: newUser.createdAt
      // },
    })
  } catch (error) {
    console.error('Error en /api/user/register:', error)

    return res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message, // Para debugging
    })
  }
}

export default insertUser

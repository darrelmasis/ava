import { connectDB } from '../config/db_connection.js'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { getCorsHeaders } from '../utils/cors.js'

const handler = async (req, res) => {
  const CORS_HEADERS = getCorsHeaders(req)

  Object.entries(CORS_HEADERS).forEach(([key, value]) =>
    res.setHeader(key, value)
  )

  const METHOD = req.method

  if (METHOD === 'OPTIONS') return res.status(200).end()
  if (METHOD !== 'POST')
    return res.status(405).json({ message: 'Método no permitido' })

  const { username, password, rememberMe } = req.body

  if (!username || !password)
    return res.status(400).json({ message: 'Credenciales Obligatorias' })

  try {
    await connectDB()
    const user = await User.findOne({ userName: username })
    if (!user)
      return res.status(401).json({ message: 'No se encontró el usuario' })

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch)
      return res.status(401).json({ message: 'Contraseña Incorrecta' })

    // Configuración de expiración según rememberMe
    const expiresIn = rememberMe ? '30d' : '30d' // Token largo siempre (el frontend controla inactividad)
    const maxAgeSeconds = rememberMe ? 30 * 24 * 60 * 60 : 30 * 24 * 60 * 60 // Cookie larga siempre

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.userName, 
        role: user.role,
        rememberMe: rememberMe === true // Guardar rememberMe en el token
      },
      process.env.JWT_SECRET,
      { expiresIn }
    )

    const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000)

    res.setHeader(
      'Set-Cookie',
      [
        `token=${token}`,
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=None',
        `Max-Age=${maxAgeSeconds}`,
        `Expires=${expiresAt.toUTCString()}`,
      ].join('; ')
    )

    return res.status(200).json({
      message: 'Sesión iniciada con éxito',
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      rememberMe, // Enviar rememberMe al frontend
      tokenExpiresAt: expiresAt.getTime(),
    })
  } catch (error) {
    console.error('Error al iniciar sesión', error)
    return res.status(500).json({ message: '500 - Error interno del servidor' })
  }
}

export default handler

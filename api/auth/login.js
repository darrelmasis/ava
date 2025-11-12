import { connectDB } from '../config/db_connection.js'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { getCorsHeaders } from '../utils/cors.js'

const handler = async (req, res) => {
  const CORS_HEADERS = getCorsHeaders(req)

  Object.entries(CORS_HEADERS).forEach(([keyframes, value]) =>
    res.setHeader(keyframes, value)
  )

  const METHOD = req.method

  if (METHOD === 'OPTIONS') return res.status(200).end()
  if (METHOD !== 'POST')
    return res.status(405).json({ message: 'Método no permitido' })

  const { username, password, rememberMe } = req.body

  if (!username || !password)
    return res.status(400).json({ message: 'Credenciales Obligatorias' })
  const expiresIn = rememberMe ? '30d' : '1h'
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 1 * 60 * 60

  try {
    await connectDB()
    const user = await User.findOne({ userName: username })
    if (!user)
      return res.status(401).json({ message: 'No se encontró el usuario' })

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch)
      return res.status(401).json({ message: 'Contraseña Incorrecta' })

    const token = jwt.sign(
      { id: user._id, username: user.userName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: expiresIn }
    )

    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age${maxAge}`
    )

    return res.status(200).json({
      message: 'Sesión iniciada con éxito',
    })
  } catch (error) {
    console.error('Error al iniciar sesión', error)
    return res.status(500).json({ message: '500 - Error interno del servidor' })
  }
}

export default handler

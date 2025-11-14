import { verifyToken } from '../_utils/verifyToken.js'
import { connectDB } from '../_config/db_connection.js'
import User from '../_models/User.model.js'
import { getCorsHeaders } from '../_utils/cors.js'

const handler = async (req, res) => {
  const CORS_HEADERS = getCorsHeaders(req)

  Object.entries(CORS_HEADERS).forEach(([key, value]) =>
    res.setHeader(key, value)
  )

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Método no permitido' })

  try {
    const decoded = verifyToken(req)

    if (!decoded) {
      console.log('Token no válido o no encontrado en /api/auth/me')
      return res.status(401).json({ message: 'Usuario no autenticado' })
    }

    await connectDB()
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      console.log('Usuario no encontrado en BD para ID:', decoded.id)
      res.setHeader(
        'Set-Cookie',
        'token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'
      )
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    console.log('Sesión recuperada exitosamente para:', user.userName)

    res.status(200).json({
      user,
      rememberMe: decoded?.rememberMe === true,
      tokenExpiresAt: decoded?.exp ? decoded.exp * 1000 : null,
    })
  } catch (error) {
    console.error('Error en /api/auth/me: ', error)

    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      res.setHeader(
        'Set-Cookie',
        'token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'
      )
    }

    return res.status(401).json({
      message:
        error.name === 'JsonWebTokenError'
          ? 'Token inválido'
          : error.name === 'TokenExpiredError'
            ? 'Token expirado'
            : 'Error de autenticación',
    })
  }
}

export default handler

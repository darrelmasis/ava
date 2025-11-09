import { verifyToken } from '../../server/utils/auth.js' // ← Función común
import { connectDB } from '../../server/config/db_connection'
import User from '../../server/models/User'
import { getCorsHeaders } from '../../server/utils/cors'

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
      return res.status(401).json({ message: 'Usuario no autenticado' })
    }

    await connectDB()
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      res.setHeader(
        'Set-Cookie',
        'token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'
      )
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(user)
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

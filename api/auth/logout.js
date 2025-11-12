import { getCorsHeaders } from '../utils/cors.js'
import { verifyToken } from '../utils/verifyToken.js'

export default function handler(req, res) {
  const CORS_HEADERS = getCorsHeaders(req)

  Object.entries(CORS_HEADERS).forEach(([key, value]) =>
    res.setHeader(key, value)
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).json({})
  }

  const loguedUser = verifyToken(req)

  if (!loguedUser)
    return res.status(401).json({ message: 'No autorizado. Token inválido.' })

  res.setHeader(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  )

  res.status(200).json({
    message: 'Sesión cerrada exitosamente',
    success: true,
    loguedUser,
  })
}

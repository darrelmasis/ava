import jwt from 'jsonwebtoken'

function parseCookies(req) {
  const cookies = {}
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=')
      if (parts.length === 2) cookies[parts[0]] = decodeURIComponent(parts[1])
    })
  }
  return cookies
}

export function verifyToken(req) {
  try {
    const cookies = parseCookies(req)
    const token = cookies.token

    if (!token) {
      console.log('No se encontró token en las cookies')
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expirado:', error.expiredAt)
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Token inválido:', error.message)
    } else {
      console.error('Error verificando token:', error)
    }
    return null
  }
}
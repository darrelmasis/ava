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
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    console.error('Error verificando token:', error)
    return null
  }
}
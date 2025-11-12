const getCorsOrigin = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.LOCAL_URL
  }

  return process.env.VERCEL_URL
}

export const getCorsHeaders = (
  req,
  methods = 'GET, POST, PUT, DELETE, OPTIONS'
) => ({
  'Access-Control-Allow-Origin': getCorsOrigin(req),

  'Access-Control-Allow-Credentials': 'true',

  'Access-Control-Allow-Methods': methods,

  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, x-role, x-username',
})

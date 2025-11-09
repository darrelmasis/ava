import mongoose from 'mongoose'
import { connectDB } from '../../server/config/db_connection.js'
import { getCorsHeaders } from '../../server/utils/cors.js'
import 'dotenv/config'
import handleGetRequest from './_GET.js'
import handlePostRequest from './_POST.js'
// import handlePatchRequest from './_PATCH.js'
// import handleDeleteRequest from './_DELETE.js'
import { verifyToken } from '../../server/utils/verifyToken.js'

const handler = async (req, res) => {
  const CORS_HEADERS = getCorsHeaders(req)

  Object.entries(CORS_HEADERS).forEach(([keyframes, value]) =>
    res.setHeader(keyframes, value)
  )

  const METHOD = req.method
  if (METHOD === 'OPTIONS') return res.status(200).end()

  const loguedUser = verifyToken(req)

  if (!loguedUser)
    return res.status(401).json({ message: 'No autorizado. Token inválido.' })

  const { role } = loguedUser

  try {
    await connectDB()
    const salesAuditCollection =
      mongoose.connection.db.collection('sales_audits')

    switch (METHOD) {
      case 'GET':
        return await handleGetRequest(req, res, salesAuditCollection)
      case 'POST':
        return await handlePostRequest(req, res, salesAuditCollection, role)
      case 'PATCH':
        return await handlePatchRequest(req, res, salesAuditCollection)
      case 'DELETE':
        return await handleDeleteRequest(req, res, salesAuditCollection)

      default:
        return res.status(405).json({ error: 'Método no permitido' })
    }

    //
  } catch (error) {
    console.error('Error al registrar arqueo: ', error)
    return res.status(500).json({ message: '500 - Error interno del servidor' })
  }
}

export default handler

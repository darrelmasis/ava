import { verifyToken } from '../../server/utils/verifyToken.js'
import SalesAudit from '../../server/models/SalesAudit.js'

const handlePostRequest = async (req, res, collection, usuario) => {
  try {
    const salesAuditData = req.body

    // Validar ID del arqueo
    if (!salesAuditData.id) {
      return res.status(400).json({
        message: 'El ID del arqueo es obligatorio',
      })
    }

    // Verificar si ya existe un arqueo con este ID
    const arqueoExistente = await SalesAudit.findOne({ id: salesAuditData.id })
    
    if (arqueoExistente) {
      return res.status(409).json({ 
        message: 'Ya existe un arqueo con este ID',
        id: salesAuditData.id 
      })
    }

    // Preparar datos según el schema del modelo
    const nuevoArqueoData = {
      ...salesAuditData,
      // Campos requeridos por tu schema que podrían faltar
      userId: usuario.id, // Del JWT - debe ser ObjectId
      sellerId: salesAuditData.sellerId, // Debe venir del frontend
      start: salesAuditData.start || new Date(), // Required en tu schema
      config: {
        exchangeRate: salesAuditData.config?.exchangeRate, // Required
        routeNumber: salesAuditData.config?.routeNumber, // Required
        truckNumber: salesAuditData.config?.truckNumber, // Required
        licensePlate: salesAuditData.config?.licensePlate, // Required
        routeAuxiliary: salesAuditData.config?.routeAuxiliary || []
      },
      // Inicializar estructuras vacías si no vienen
      cashCount: salesAuditData.cashCount || {
        cordobas: {},
        dollars: {}
      },
      documents: salesAuditData.documents || {
        checks: [],
        transfers: [],
        deposits: [],
        others: []
      },
      invoices: salesAuditData.invoices || {},
      manualInvoices: salesAuditData.manualInvoices || {},
      creditInvoices: salesAuditData.creditInvoices || {},
      receipts: salesAuditData.receipts || {}
    }

    // Validar campos requeridos
    if (!nuevoArqueoData.sellerId) {
      return res.status(400).json({
        message: 'sellerId es obligatorio',
      })
    }

    if (!nuevoArqueoData.config.exchangeRate || 
        !nuevoArqueoData.config.routeNumber || 
        !nuevoArqueoData.config.truckNumber || 
        !nuevoArqueoData.config.licensePlate) {
      return res.status(400).json({
        message: 'Todos los campos de config son obligatorios: exchangeRate, routeNumber, truckNumber, licensePlate',
      })
    }

    // Crear el nuevo arqueo
    const newSalesAudit = await SalesAudit.create(nuevoArqueoData)

    // Responder con el arqueo creado
    return res.status(201).json({
      message: 'Arqueo creado exitosamente',
      arqueo: newSalesAudit
    })

  } catch (error) {
    console.error('Error creando arqueo:', error)
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        message: 'Error de validación',
        errors 
      })
    }

    // Manejar error de duplicado (aunque ya lo verificamos)
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Ya existe un arqueo con este ID' 
      })
    }

    return res.status(500).json({ 
      message: 'Error al crear el arqueo',
      error: error.message 
    })
  }
}

export default handlePostRequest
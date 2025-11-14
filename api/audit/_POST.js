import mongoose from 'mongoose'
import SalesAudit from '../_models/SalesAudit.model.js'

const handlePostRequest = async (req, res, loguedUser) => {
  try {
    const salesAuditData = req.body

    // Validar ID del arqueo
    if (!salesAuditData.id) {
      return res.status(400).json({
        message: 'El ID del arqueo es obligatorio',
      })
    }

    // Verificar si ya existe un arqueo con este ID
    const existSalesAudit = await SalesAudit.findOne({ id: salesAuditData.id })

    if (existSalesAudit) {
      return res.status(409).json({
        message: 'Ya existe un arqueo con este ID',
        id: salesAuditData.id,
      })
    }

    // Obtener userId del token - CONVERTIR a ObjectId
    const userId = loguedUser.id
    if (!userId) {
      return res.status(400).json({
        message: 'No se pudo obtener el ID del usuario del token',
      })
    }

    // Convertir sellerId a ObjectId si es string
    let sellerId
    try {
      sellerId = mongoose.Types.ObjectId.isValid(salesAuditData.sellerId)
        ? salesAuditData.sellerId
        : new mongoose.Types.ObjectId(salesAuditData.sellerId)
    } catch (error) {
      return res.status(400).json({
        message: 'sellerId no es un ObjectId válido',
      })
    }

    // Preparar datos según el schema del modelo
    const nuevoArqueoData = {
      ...salesAuditData,
      // Campos requeridos por tu schema
      userId: new mongoose.Types.ObjectId(userId), // ← CONVERTIR a ObjectId
      sellerId: sellerId, // ← Ya convertido
      start: salesAuditData.start || new Date(),
      config: {
        exchangeRate: salesAuditData.config?.exchangeRate,
        routeNumber: salesAuditData.config?.routeNumber,
        truckNumber: salesAuditData.config?.truckNumber,
        licensePlate: salesAuditData.config?.licensePlate,
        routeAuxiliary: salesAuditData.config?.routeAuxiliary || [],
      },
      // Inicializar estructuras vacías si no vienen
      cashCount: salesAuditData.cashCount || {
        cordobas: {},
        dollars: {},
      },
      documents: salesAuditData.documents || {
        checks: [],
        transfers: [],
        deposits: [],
        others: [],
      },
      invoices: salesAuditData.invoices || {
        start: '',
        end: '',
        quantity: 0,
        totalAmount: 0,
      },
      manualInvoices: salesAuditData.manualInvoices || {
        start: '',
        end: '',
        quantity: 0,
        totalAmount: 0,
      },
      creditInvoices: salesAuditData.creditInvoices || {
        start: '',
        end: '',
        quantity: 0,
        totalAmount: 0,
      },
      receipts: salesAuditData.receipts || {
        start: '',
        end: '',
        quantity: 0,
        totalAmount: 0,
      },
    }

    // Validar campos requeridos
    if (!nuevoArqueoData.sellerId) {
      return res.status(400).json({
        message: 'sellerId es obligatorio',
      })
    }

    if (
      !nuevoArqueoData.config.exchangeRate ||
      !nuevoArqueoData.config.routeNumber ||
      !nuevoArqueoData.config.truckNumber ||
      !nuevoArqueoData.config.licensePlate
    ) {
      return res.status(400).json({
        message:
          'Todos los campos de config son obligatorios: exchangeRate, routeNumber, truckNumber, licensePlate',
      })
    }

    // Crear el nuevo arqueo
    const newSalesAudit = await SalesAudit.create(nuevoArqueoData)

    // Responder con el arqueo creado
    return res.status(201).json({
      message: 'Arqueo creado exitosamente',
      arqueo: newSalesAudit,
    })
  } catch (error) {
    console.error('Error creando arqueo:', error)

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        message: 'Error de validación',
        errors,
      })
    }

    // Manejar error de duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Ya existe un arqueo con este ID',
      })
    }

    // Manejar error de ObjectId inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID de usuario o vendedor inválido',
      })
    }

    return res.status(500).json({
      message: 'Error al crear el arqueo',
      error: error.message,
    })
  }
}

export default handlePostRequest

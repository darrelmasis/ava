import SalesAudit from '../models/SalesAudit.model.js'

const handlePatchRequest = async (req, res, collection, usuario) => {
  try {
    const { id } = req.query
    const updateData = req.body

    if (!id) {
      return res.status(400).json({
        message: 'El ID del arqueo es obligatorio',
      })
    }

    // Verificar que el arqueo existe
    const arqueoExistente = await SalesAudit.findOne({ id })

    if (!arqueoExistente) {
      return res.status(404).json({
        message: 'Arqueo no encontrado',
        id,
      })
    }

    // Verificar permisos: solo el usuario que creó el arqueo puede actualizarlo
    const userId = usuario.id || usuario.userId
    if (!userId) {
      return res.status(400).json({
        message: 'No se pudo obtener el ID del usuario del token',
      })
    }

    if (arqueoExistente.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'No tienes permisos para actualizar este arqueo',
      })
    }

    // Mongoose convertirá automáticamente sellerId a ObjectId si es necesario

    // Actualizar el arqueo
    const arqueoActualizado = await SalesAudit.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      message: 'Arqueo actualizado exitosamente',
      arqueo: arqueoActualizado,
    })
  } catch (error) {
    console.error('Error actualizando arqueo:', error)

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        message: 'Error de validación',
        errors,
      })
    }

    return res.status(500).json({
      message: 'Error al actualizar el arqueo',
      error: error.message,
    })
  }
}

export default handlePatchRequest

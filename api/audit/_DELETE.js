import SalesAudit from '../models/SalesAudit.model.js'

const handleDeleteRequest = async (req, res, collection, usuario) => {
  try {
    const { id } = req.query

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

    // Verificar permisos: solo el usuario que creó el arqueo puede eliminarlo
    const userId = usuario.id || usuario.userId
    if (!userId) {
      return res.status(400).json({
        message: 'No se pudo obtener el ID del usuario del token',
      })
    }

    if (arqueoExistente.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'No tienes permisos para eliminar este arqueo',
      })
    }

    // Eliminar el arqueo
    await SalesAudit.findOneAndDelete({ id })

    return res.status(200).json({
      message: 'Arqueo eliminado exitosamente',
      id,
    })
  } catch (error) {
    console.error('Error eliminando arqueo:', error)

    return res.status(500).json({
      message: 'Error al eliminar el arqueo',
      error: error.message,
    })
  }
}

export default handleDeleteRequest

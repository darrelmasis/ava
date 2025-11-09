const handleGetRequest = async (req, res, collection) => {
  const { id, userId, state } = req.query || {}

  // Búsqueda por ID específico
  if (id) {
    const arqueo = await collection.findOne({ id })

    !arqueo ? res.status(404).json({ message: 'Arqueo no encontrado' }) : null

    return res.status(200).json(arqueo)
  }

  // Búsqueda por userId y/o state
  const query = {}
  if (userId) query.userId = userId
  if (state) query.state = state

  const arqueos = await collection
    .find(query)
    .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
    .limit(50) // Limitar a 50 resultados
    .toArray()

  !arqueos.length
    ? res.status(404).json({ message: 'No se encontraron arqueos' })
    : null

  return res.status(200).json(arqueos)
}

export default handleGetRequest

import mongoose from 'mongoose'
import 'dotenv/config'

let cached = global.mongoose
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) throw new Error('¡MONGODB_URI no está definido!')

if (!cached) cached = global.mongoose = { conn: null, promise: null }

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }

  try {
    console.log(
      'MongoDB conectado satisfactoriamente: ',
      new Date().toLocaleString('es-NI')
    )

    cached.conn = await cached.promise
  } catch (err) {
    console.log('Error al conectarse a MongoDB')
    cached.promise = null
    throw err
  }

  return cached.conn
}

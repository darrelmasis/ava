import mongoose from 'mongoose'
import { attachDatabasePool } from '@vercel/functions'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('¡MONGODB_URI no está definido!')

let cached = global.mongoose
if (!cached) cached = global.mongoose = { conn: null, promise: null, logged: false }

export const connectDB = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = { bufferCommands: false }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      const client = mongoose.connection.getClient()
      attachDatabasePool(client)

      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise

    if (!cached.logged) {
      console.log(
        'MongoDB conectado satisfactoriamente:',
        new Date().toLocaleString('es-NI')
      )
      cached.logged = true
    }
  } catch (err) {
    cached.promise = null
    console.log('Error al conectarse a MongoDB')
    throw err
  }

  return cached.conn
}

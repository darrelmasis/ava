import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['auditor', 'admin', 'user', 'dev'],
      default: 'auditor',
    },
  },
  { timestamps: true }
)

const User = model('User', userSchema)

export default User

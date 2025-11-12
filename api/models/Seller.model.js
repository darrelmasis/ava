import { Schema, model } from 'mongoose'

const sellerSchema = new Schema({
  sellerId: { type: String, required: true, unique: true },
  sellerName: { type: String, required: true },
  sellerAlias: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const Seller = model('Seller', sellerSchema)

export default Seller

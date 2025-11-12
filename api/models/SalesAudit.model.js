import { Schema, model } from 'mongoose'

const salesAuditSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    start: { type: Date, required: true },
    end: { type: Date },
    state: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    sellerSign: { type: String }, // almacenará la firma en formato base64

    config: {
      exchangeRate: { type: Number, required: true }, // tipo de cambio definido en la configuración del arqueo
      routeNumber: { type: Number, required: true }, // número de ruta (definida por ventas)
      routeAuxiliary: [{ type: String }], // nombres de auxiliare(s) de la ruta
      truckNumber: { type: String, required: true }, // número de unidad ej. U125
      licensePlate: { type: String, required: true }, // placa del camión ej. GR-5234
    },

    cashCount: {
      cordobas: {
        1000: Number,
        500: Number,
        200: Number,
        100: Number,
        50: Number,
        20: Number,
        10: Number,
        5: Number,
        1: Number,
        0.5: Number,
        0.25: Number,
        0.1: Number,
      },
      dollars: {
        100: Number,
        50: Number,
        20: Number,
        10: Number,
        5: Number,
        1: Number,
      },
    },

    /* Los documentos asociados al arqueo de ventas recibirán los siguientes campos:
      date: Fecha del documento
      refNumber: Número de referencia (número de cheque, número de transferencia, etc.)
      bank: Banco emisor
      amount: Monto total del documento
      currency: Moneda del documento (Córdobas o Dólares) [NIO, USD]
      customerName: Nombre del cliente
    */
    documents: {
      checks: [Schema.Types.Mixed], // cheques
      transfers: [Schema.Types.Mixed], // transferencias bancarias
      deposits: [Schema.Types.Mixed], // depósitos
      others: [Schema.Types.Mixed], // otros tipos de pago/documentos
    },

    // 6️⃣ Billing / Invoicing
    invoices: {
      start: String, // factura inicial
      end: String, // factura final
      quantity: Number, // cantidad total de facturas
      totalAmount: Number, // monto total
    },
    manualInvoices: {
      start: String,
      end: String,
      quantity: Number,
      totalAmount: Number,
    },
    creditInvoices: {
      start: String,
      end: String,
      quantity: Number,
      totalAmount: Number,
    },
    receipts: {
      start: String,
      end: String,
      quantity: Number,
      totalAmount: Number,
    },
  },
  { timestamps: true }
)

const SalesAudit = model('SalesAudit', salesAuditSchema)
export default SalesAudit

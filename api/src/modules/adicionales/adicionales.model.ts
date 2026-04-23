import mongoose, { Schema, Document } from 'mongoose'

export interface iAdicional extends Document {
  title: string
  price: number
  category: string
  active: boolean
}

const AdicionalSchema = new Schema<iAdicional>({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    index: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export const AdicionalModel = mongoose.model<iAdicional>('Adicional', AdicionalSchema)

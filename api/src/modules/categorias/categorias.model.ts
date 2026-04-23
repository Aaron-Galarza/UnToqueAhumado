import mongoose, { Schema, Document } from 'mongoose'

export interface iCategoria extends Document {
  name: string
  active: boolean
}

const CategoriaSchema = new Schema<iCategoria>({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    unique: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export const CategoriaModel = mongoose.model<iCategoria>('Categoria', CategoriaSchema)

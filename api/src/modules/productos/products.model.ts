import mongoose, { Schema, model, Document } from "mongoose"

export interface iProducto extends Document {
    title: string
    price: number
    description?: string
    image?: string
    category: mongoose.Types.ObjectId
    active: boolean

}

const ProductoSchema = new Schema<iProducto>({

    title: {
        type: String,
        required: [true, 'El titulo es Obligatorio'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'El titulo es Obligatorio'],
        min: 0
    },
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoria es obligatoria'],
        index: true
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },

}, {
    timestamps:true
})

// Crear y exportar el modelo de Mongoose
export const ProductModel = mongoose.model<iProducto>('Producto', ProductoSchema);

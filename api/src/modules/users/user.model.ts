import mongoose, { Schema, Document } from 'mongoose'

export interface iUser extends Document {
  email: string
  passwordHash: string
}

const UserSchema = new Schema<iUser>({
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true })

export const UserModel = mongoose.model<iUser>('User', UserSchema)

import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyAnalytics extends Document {
  date: string; // Formato "YYYY-MM-DD"
  total: number;
  efectivo: number;
  trans: number;
  entregados: number;
  products: Map<string, number>; // productId -> cantidad
}

const dailyAnalyticsSchema = new Schema<IDailyAnalytics>({
  date: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  total: { type: Number, default: 0 },
  efectivo: { type: Number, default: 0 },
  trans: { type: Number, default: 0 },
  entregados: { type: Number, default: 0 },
  products: { 
    type: Map, 
    of: new Schema({
      qty: { type: Number, default: 0 },
      title: { type: String }
    }, { _id: false }),
    default: {} 
  }
}, { timestamps: true });

export const DailyAnalyticsModel = mongoose.model<IDailyAnalytics>('AnalyticsDaily', dailyAnalyticsSchema);
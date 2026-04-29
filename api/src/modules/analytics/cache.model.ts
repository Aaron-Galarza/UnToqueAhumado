import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsCache extends Document {
  type: 'week' | 'month';
  range: string; // Ej: "2026-W17" o "2026-04"
  stats: {
    total: number;
    efectivo: number;
    trans: number;
    entregados: number;
    topProduct: {
      title: string;
      quantity: number;
    } | null;
  };
  updatedAt: Date;
}

const analyticsCacheSchema = new Schema<IAnalyticsCache>({
  type: { type: String, enum: ['week', 'month'], required: true },
  range: { type: String, required: true }, // "YYYY-Wxx" o "YYYY-MM"
  stats: {
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
  },
  updatedAt: { type: Date, default: Date.now }
});

// Índice único: No puede haber dos caches para la misma semana
analyticsCacheSchema.index({ type: 1, range: 1 }, { unique: true });

export const AnalyticsCacheModel = mongoose.model<IAnalyticsCache>('AnalyticsCache', analyticsCacheSchema);
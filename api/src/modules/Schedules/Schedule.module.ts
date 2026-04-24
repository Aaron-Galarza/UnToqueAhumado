import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDaySchedule {
    day: string;
    openTime: string; 
    closeTime: string; 
    isStoreOpen: boolean;
}

export interface IConfig extends Document {
    dailySchedule: IDaySchedule[];
    isAllClose: boolean; // Un "botón de pánico" para cerrar si se quedaron sin stock
}

const dayScheduleSchema = new Schema<IDaySchedule>({
    day: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isStoreOpen: { type: Boolean, required: true },
}, { _id: false });

const configSchema = new Schema<IConfig>({
    dailySchedule: [dayScheduleSchema],
    isAllClose: { type: Boolean, default: false }
}, { timestamps: true });

// Función estática para obtener la config única
configSchema.statics.getOrCreateConfig = async function() {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({
            dailySchedule: [
                { day: 'Domingo', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
                { day: 'Lunes', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
                { day: 'Martes', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
                { day: 'Miércoles', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
                { day: 'Jueves', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
                { day: 'Viernes', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
                { day: 'Sábado', openTime: '20:00', closeTime: '23:59', isStoreOpen: true },
            ]
        });
    }
    return config;
};

interface IConfigModel extends Model<IConfig> {
    getOrCreateConfig(): Promise<IConfig>;
}

export const ConfigModel = mongoose.model<IConfig, IConfigModel>('Config', configSchema);
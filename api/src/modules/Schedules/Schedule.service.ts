import { model } from 'mongoose';
import { ConfigModel, IDaySchedule, IConfig } from './Schedule.module';
import { stat } from 'fs';

export const checkStoreStatus = async () => {
    const config = await ConfigModel.getOrCreateConfig();
    
    if (config.isAllClose) return { isClose: true, message: "Cerrado por falta de stock o fuerza mayor" };

    const now = new Date();
    // Ajuste de hora: MongoDB suele usar UTC, asegurate de manejar la hora local de Argentina
    const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('es-AR', options);
    
    const parts = formatter.formatToParts(now);
    const dayName = parts.find(p => p.type === 'weekday')?.value; // Ej: "miércoles"
    const currentTime = `${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}`;

    // Buscamos el horario de hoy (ojo con las tildes y mayúsculas)
    const todaySchedule = config.dailySchedule.find(s => 
        s.day.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 
        dayName?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    if (!todaySchedule || !todaySchedule.isStoreOpen) {
        return { isClose: true, message: "Hoy el local permanece cerrado" };
    }

    const isOpen = currentTime >= todaySchedule.openTime && currentTime <= todaySchedule.closeTime;

    return {
        isOpen,
        message: isOpen ? "¡Estamos cocinando!" : `Abrimos a las ${todaySchedule.openTime}`,
        schedule: todaySchedule
    };
};

export const closeStore = async (): Promise<IConfig| null> => {
    const config = await ConfigModel.findOne()

    if (!config) return null

    config.isAllClose = !config.isAllClose 
    return await config.save()
}
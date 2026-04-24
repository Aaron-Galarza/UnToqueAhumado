import { Request, Response } from 'express';
import * as ConfigService from './Schedule.service';
import { sendSucces, sendError } from '../../utils/response';

export const getStatus = async (req: Request, res: Response) => {
    try {
        const status = await ConfigService.checkStoreStatus();
        return sendSucces(res, status);
    } catch (error) {
        return sendError(res, "Error al consultar el estado del local");
    }
};

export const closeStore = async (req: Request, res: Response) => {
    try {
        const status = await ConfigService.closeStore()
        return sendSucces(res, status) 
    } catch (error) {
        return sendError(res, 'Error al cambiar la disponibilidad del negocio')
    }
}
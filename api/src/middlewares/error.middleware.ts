import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// Captura cualquier error que llegue con next(err) desde controllers o middlewares
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`)
  return sendError(res, 'Error interno del servidor', 500)
}

import { Request, Response } from 'express';
import * as AnalyticsService from './analytics.service';

export const getAnalyticsReport = async (req: Request, res: Response) => {
  try {
    // Tomamos el rango de la query, por defecto 'hoy'
    const range = (req.query.range as 'hoy' | 'semana' | 'mes') || 'hoy';

    // Validamos que el rango sea uno de los permitidos
    if (!['hoy', 'semana', 'mes'].includes(range)) {
      return res.status(400).json({ 
        success: false, 
        message: "Rango no válido. Usa 'hoy', 'semana' o 'mes'." 
      });
    }

    const data = await AnalyticsService.getAnalytics(range);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[ANALYTICS_ERROR]:', error);
    return res.status(500).json({
      success: false,
      message: "Error al calcular las estadísticas"
    });
  }
};
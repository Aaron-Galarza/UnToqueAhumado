import { DailyAnalyticsModel } from './daily.model';
import { AnalyticsCacheModel } from './cache.model';
import { ProductModel } from '../productos/products.model';
import { iOrder } from '../orders/orders.model';
import { startOfDay, endOfDay, startOfWeek, startOfMonth, format, subMinutes } from 'date-fns';

const CACHE_TTL_MINUTES = 5;

export const getAnalytics = async (range: 'hoy' | 'semana' | 'mes') => {
  const now = new Date();

  // --- CASO 1: HOY (Sin cache, siempre real) ---
  if (range === 'hoy') {
    const todayStr = format(now, 'yyyy-MM-dd');
    const daily = await DailyAnalyticsModel.findOne({ date: todayStr }).lean();
    
    if (!daily) return getEmptyStats();

    // Calculamos el top product del día sobre la marcha
    const topProduct = await calculateTopProduct(daily.products);
    return {
      ...daily,
      topProduct,
      fromCache: false
    };
  }

  // --- CASO 2: SEMANA / MES (Con lógica de Cache) ---
  const { type, rangeKey, startDate, endDate } = getRangeConfig(now, range);

  // 1. Intentar buscar en Cache
  const cached = await AnalyticsCacheModel.findOne({ type, range: rangeKey });

  if (cached) {
    const isExpired = cached.updatedAt < subMinutes(now, CACHE_TTL_MINUTES);
    if (!isExpired) {
      return { ...cached.stats, fromCache: true, updatedAt: cached.updatedAt };
    }
  }

  // 2. Cache Miss o Expirado: Calcular sumando DailyAnalytics
  const dailies = await DailyAnalyticsModel.find({
    date: { $gte: startDate, $lte: endDate }
  }).lean();

  if (dailies.length === 0) return getEmptyStats();

  // 3. Reducir todos los días en un solo objeto de estadísticas

const totals = dailies.reduce((acc, curr) => {
  acc.total += curr.total || 0;
  acc.entregados += curr.entregados || 0;
  acc.efectivo += curr.efectivo || 0;
  acc.trans += curr.trans || 0;

  // Recorremos los productos del día actual
  if (curr.products) {
    // Si curr.products es un Map de Mongo, usamos .entries()
    const entries = curr.products instanceof Map ? curr.products.entries() : Object.entries(curr.products);

    for (const [productId, data] of entries) {
      const item = data as { qty: number; title: string };
      
      if (!acc.productMap[productId]) {
        acc.productMap[productId] = { 
          qty: 0, 
          title: item.title || 'Sin nombre' 
        };
      }
      
      // ASEGURAMOS que sumamos el número, no el objeto completo
      const quantityToAdd = typeof item.qty === 'number' ? item.qty : (item as any).quantity || 0;
      acc.productMap[productId].qty += quantityToAdd;
    }
  }
  return acc;
}, { total: 0, entregados: 0, efectivo: 0, trans: 0, productMap: {} as Record<string, {qty: number, title: string}> });

  // 4. Obtener el producto más vendido del periodo
  const topProduct = await calculateTopProduct(totals.productMap);

  const finalStats = {
    total: totals.total,
    entregados: totals.entregados,
    efectivo: totals.efectivo,
    trans: totals.trans,
    topProduct
  };

  // 5. Guardar/Actualizar el Cache
  await AnalyticsCacheModel.findOneAndUpdate(
    { type, range: rangeKey },
    { stats: finalStats, updatedAt: new Date() },
    { upsert: true }
  );

  return { ...finalStats, fromCache: false };
};

// --- FUNCIONES AUXILIARES ---

async function calculateTopProduct(productMap: any) {
  const entries = Object.entries(productMap);
  if (entries.length === 0) return null;

  // Encontrar el ID con mayor cantidad
  const [topId, quantity] = entries.reduce((a, b) => (b[1] as number) > (a[1] as number) ? b : a);

  const product = await ProductModel.findById(topId).select('title').lean();
  return {
    title: product?.title || "Producto eliminado",
    quantity
  };
}

function getRangeConfig(now: Date, range: 'semana' | 'mes') {
  if (range === 'semana') {
    const start = startOfWeek(now, { weekStartsOn: 1 });
    return {
      type: 'week' as const,
      rangeKey: format(start, 'yyyy-w'), // Cambiado a año-semana simple
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    };
  } else {
    const start = startOfMonth(now);
    return {
      type: 'month' as const,
      rangeKey: format(start, 'yyyy-MM'),
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    };
  }
}

function getEmptyStats() {
  return {
    total: 0,
    entregados: 0,
    efectivo: 0,
    trans: 0,
    topProduct: null,
    message: "No hay datos para este periodo"
  };
}

export const updateAnalyticsDaily = async (
  order: iOrder,
  revert: boolean = false
) => {
  const date = format(new Date(order.createdAt), 'yyyy-MM-dd');
  const multiplier = revert ? -1 : 1;

  // --- 1. Construcción de updates ---
  const incUpdates: Record<string, number> = {};
  const setUpdates: Record<string, any> = {};

  for (const item of order.items) {
    const basePath = `products.${item.productId}`;

    // Incremento SOLO numérico
    incUpdates[`${basePath}.qty`] =
      (incUpdates[`${basePath}.qty`] || 0) + item.quantity * multiplier;

    // Set SOLO si no es revert (evita sobrescribir innecesariamente)
    if (!revert) {
      setUpdates[`${basePath}.title`] = item.title;
    }
  }

  // --- 2. Construcción del update final ---
  const updateQuery: any = {
    $inc: {
      total: order.total * multiplier,
      entregados: 1 * multiplier,
      ...(order.paymentMethod === 'Efectivo'
        ? { efectivo: order.total * multiplier }
        : { trans: order.total * multiplier }),
      ...incUpdates
    }
  };

  if (Object.keys(setUpdates).length > 0) {
    updateQuery.$set = setUpdates;
  }

  // --- 3. Ejecución ---
await DailyAnalyticsModel.findOneAndUpdate(
  { date },
  updateQuery,
  {
    upsert: true,
    returnDocument: 'after'
  }
  );

  console.log(
    `[ANALYTICS] ${revert ? 'REVERT' : 'ADD'} → ${date} | total: ${order.total}`
  );
};
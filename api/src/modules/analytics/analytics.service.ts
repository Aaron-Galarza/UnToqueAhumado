import { DailyAnalyticsModel } from './daily.model';
import { iOrder } from '../orders/orders.model';
import { startOfWeek, startOfMonth, format, subDays } from 'date-fns';

// ─── Tipos ───────────────────────────────────────────────

interface AnalyticsStats {
  total: number;
  efectivo: number;
  trans: number;
  entregados: number;
  topProduct: { title: string; quantity: number } | null;
}

// ─── Consulta principal ──────────────────────────────────

export const getAnalytics = async (
  range: 'hoy' | 'ayer' | 'semana' | 'mes'
): Promise<AnalyticsStats> => {
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');

  let startDate: string;
  let endDate: string = todayStr;

  if (range === 'hoy') {
    startDate = todayStr;
  } else if (range === 'ayer') {
    const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
    startDate = yesterdayStr;
    endDate   = yesterdayStr;
  } else if (range === 'semana') {
    startDate = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  } else {
    startDate = format(startOfMonth(now), 'yyyy-MM-dd');
  }

  const dailies = await DailyAnalyticsModel.find({
    date: { $gte: startDate, $lte: endDate },
  }).lean();

  if (dailies.length === 0) {
    return { total: 0, efectivo: 0, trans: 0, entregados: 0, topProduct: null };
  }

  // Reducir a totales
  const productMap: Record<string, { qty: number; title: string }> = {};

  let total = 0;
  let efectivo = 0;
  let trans = 0;
  let entregados = 0;

  for (const day of dailies) {
    total += day.total ?? 0;
    efectivo += day.efectivo ?? 0;
    trans += day.trans ?? 0;
    entregados += day.entregados ?? 0;

    // Acumular productos — day.products puede ser Map o plain object (por .lean())
    const products = day.products;
    if (!products) continue;

    const entries =
      products instanceof Map ? [...products.entries()] : Object.entries(products);

    for (const [productId, data] of entries) {
      const entry = data as { qty: number; title: string };
      if (!productMap[productId]) {
        productMap[productId] = { qty: 0, title: entry.title || 'Sin nombre' };
      }
      productMap[productId].qty += entry.qty ?? 0;
    }
  }

  // Top product del periodo
  const topProduct = getTopProduct(productMap);

  return { total, efectivo, trans, entregados, topProduct };
};

// ─── Actualizar stats diarias cuando una orden cambia a "delivered" ──

export const updateAnalyticsOnDelivery = async (order: iOrder) => {
  const date = format(new Date(order.createdAt), 'yyyy-MM-dd');

  const incUpdates: Record<string, number> = {};
  const setUpdates: Record<string, string> = {};

  for (const item of order.items) {
    const key = `products.${item.productId}`;
    incUpdates[`${key}.qty`] = (incUpdates[`${key}.qty`] ?? 0) + item.quantity;
    setUpdates[`${key}.title`] = item.title;
  }

  await DailyAnalyticsModel.findOneAndUpdate(
    { date },
    {
      $inc: {
        total: order.total,
        entregados: 1,
        ...(order.paymentMethod === 'Efectivo'
          ? { efectivo: order.total }
          : { trans: order.total }),
        ...incUpdates,
      },
      $set: setUpdates,
    },
    { upsert: true }
  );

  console.log(`[ANALYTICS] ADD → ${date} | $${order.total}`);
};

// ─── Revertir stats cuando una orden delivered se cancela/devuelve ──

export const revertAnalyticsOnDelivery = async (order: iOrder) => {
  const date = format(new Date(order.createdAt), 'yyyy-MM-dd');

  // Primero verificamos que el daily exista y tenga saldo suficiente
  const daily = await DailyAnalyticsModel.findOne({ date });
  if (!daily) {
    console.warn(`[ANALYTICS] REVERT ignorado — no hay registro para ${date}`);
    return;
  }

  // Calcular decrementos de productos con protección contra negativos
  const incUpdates: Record<string, number> = {};

  for (const item of order.items) {
    const key = `products.${item.productId}.qty`;
    const currentQty = daily.products?.get(item.productId)?.qty ?? 0;
    // No restar más de lo que hay
    const safeDecrement = Math.min(item.quantity, currentQty);
    incUpdates[key] = (incUpdates[key] ?? 0) - safeDecrement;
  }

  // Protección contra negativos en totales
  const safeTotal = Math.min(order.total, daily.total);
  const safeEntregados = Math.min(1, daily.entregados);
  const safeEfectivo =
    order.paymentMethod === 'Efectivo'
      ? Math.min(order.total, daily.efectivo)
      : 0;
  const safeTrans =
    order.paymentMethod !== 'Efectivo'
      ? Math.min(order.total, daily.trans)
      : 0;

  await DailyAnalyticsModel.findOneAndUpdate(
    { date },
    {
      $inc: {
        total: -safeTotal,
        entregados: -safeEntregados,
        efectivo: -safeEfectivo,
        trans: -safeTrans,
        ...incUpdates,
      },
    }
  );

  console.log(`[ANALYTICS] REVERT → ${date} | $${order.total}`);
};

// ─── Helpers ─────────────────────────────────────────────

function getTopProduct(
  productMap: Record<string, { qty: number; title: string }>
): { title: string; quantity: number } | null {
  let topId: string | null = null;
  let maxQty = 0;

  for (const [id, data] of Object.entries(productMap)) {
    if (data.qty > maxQty) {
      maxQty = data.qty;
      topId = id;
    }
  }

  if (!topId) return null;

  return {
    title: productMap[topId].title,
    quantity: maxQty,
  };
}
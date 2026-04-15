import { Order, OrderStatus } from './orders.model';

const orders: Order[] = [];

export const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Order => {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(Math.random() * 10000)}`, // ID temporal
    status: 'pending',
    createdAt: new Date()
  };
  
  orders.push(newOrder);
  return newOrder;
};

export const getAllOrders = (): Order[] => {
  return orders;
};
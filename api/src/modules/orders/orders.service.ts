import { Order, OrderStatus } from './orders.model';

const orders: Order[] = [
  {
    id: "ORD-8712",
    customer: {
      name: "Juan Perez",
      phone: "12345678"
    },
    items: [
      {
        productId: "1",
        title: "Doble Smash",
        price: 10900,
        quantity: 1
      }
    ],
    deliveryType: "delivery",
    status: "pending",
    createdAt: new Date("2026-04-19T15:07:19.188Z"),
    total: 10900
  }

];

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
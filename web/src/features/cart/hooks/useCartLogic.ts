"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItemWithExtras } from '@/stores/cartStore';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Addon, useAddons } from '@/features/menu/hooks/useAddons';

type FeedbackType = 'error' | 'success' | null;

export function useCartLogic() {
  const router = useRouter();
  const { addons } = useAddons();

  // --- ZONA DE ESTADOS GLOBALES ---
  const cartItems = useCartStore((state) => state.items);
  const orderData = useCartStore((state) => state.orderData);
  const handleRemoveItem = useCartStore((state) => state.removeItem);
  const updateMainQuantity = useCartStore((state) => state.updateQuantity);
  const setAdicional = useCartStore((state) => state.updateAdicional);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderData = useCartStore((state) => state.setOrderData);
  const setItems = useCartStore((state) => state.setItems);

  // --- ZONA DE ESTADOS LOCALES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>(orderData.paymentMethod || 'Efectivo');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>(orderData.deliveryType || 'pickup');
  const [customerData, setCustomerData] = useState({
    name: orderData.name || '',
    phone: orderData.phone || '',
    address: orderData.address || '',
  });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', address: '' });
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState<FeedbackType>(null);

  // --- CÁLCULOS ---
  const itemTotal = (item: CartItemWithExtras) => {
    const adExtra = addons.reduce((acc, a) => acc + (item.adicionales?.[a._id] || 0) * a.price, 0);
    return (item.price + adExtra) * item.quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + itemTotal(item), 0);
  const discount = orderData.couponPercent ? subtotal * (orderData.couponPercent / 100) : 0;
  const deliveryFee = deliveryType === 'delivery' ? 'a convenir' : 0;
  const total = subtotal - discount + (typeof deliveryFee === 'number' ? deliveryFee : 0);

  // --- HANDLERS BÁSICOS ---
  const handleCustomerDataChange = (field: keyof typeof customerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
    if (submitType) { setSubmitType(null); setSubmitMessage(''); }
  };

  const handleClearCart = () => clearCart();

  // --- LÓGICA DE NEGOCIO (REFACTORIZADA) ---
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', address: '' };

    if (customerData.name.trim().length < 3) { newErrors.name = 'Mínimo 3 letras.'; isValid = false; }
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(customerData.name)) { newErrors.name = 'Solo letras.'; isValid = false; }

    if (!/^\+?[0-9]{8,15}$/.test(customerData.phone.replace(/\s/g, ''))) { newErrors.phone = 'Celular inválido.'; isValid = false; }
    if (deliveryType === 'delivery' && customerData.address.trim().length < 5) { newErrors.address = 'Dirección muy corta.'; isValid = false; }

    return { isValid, newErrors };
  };

  const syncCartWithBackend = async () => {
    const [productsResp, addonsResp] = await Promise.all([
      api.get<Product[]>('/api/productos'),
      api.get<Addon[]>('/api/adicionales'),
    ]);

    if (!productsResp.success || !productsResp.data) throw new Error(productsResp.error || 'Error validando productos.');
    if (!addonsResp.success || !addonsResp.data) throw new Error(addonsResp.error || 'Error validando adicionales.');

    const productsMap = new Map(productsResp.data.map((p) => [p._id, p]));
    const addonsMap = new Map(addonsResp.data.map((a) => [a._id, a]));
    const missingProducts: string[] = [];

    const syncedItems: CartItemWithExtras[] = cartItems.map((item) => {
      const product = productsMap.get(item.productId);
      if (!product) { missingProducts.push(item.title); return item; }

      const filteredExtras = Object.entries(item.adicionales || {}).reduce<Record<string, number>>((acc, [id, qty]) => {
        if (qty > 0 && addonsMap.has(id)) acc[id] = qty;
        return acc;
      }, {});

      return { ...item, title: product.title, price: product.price, adicionales: filteredExtras };
    });

    if (missingProducts.length > 0) throw new Error(`Sin disponibilidad: ${missingProducts.join(', ')}`);
    setItems(syncedItems);
    return syncedItems;
  };

  const handleConfirmOrder = async () => {
    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      setFormErrors(newErrors);
      setSubmitType('error');
      setSubmitMessage('Revisá los campos obligatorios antes de continuar.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setOrderData({ ...orderData, name: customerData.name, phone: customerData.phone, address: customerData.address, deliveryType, paymentMethod });
    setIsSubmitting(true);
    setSubmitType(null);

    try {
      const syncedItems = await syncCartWithBackend();

      const payload = {
        customer: {
          name: customerData.name,
          phone: customerData.phone,
          address: deliveryType === 'delivery' ? customerData.address : undefined,
        },
        items: syncedItems.map((item) => {
          const addons = Object.entries(item.adicionales || {})
            .filter(([, qty]) => Number(qty) > 0)
            .map(([addonId, quantity]) => ({ addonId, quantity: Number(quantity) }));
            
          return addons.length > 0 
            ? { productId: item.productId, quantity: Number(item.quantity), addons }
            : { productId: item.productId, quantity: Number(item.quantity) };
        }),
        deliveryType,
        paymentMethod,
        couponCode: orderData.couponCode,
      };

      const response = await api.post<{ _id: string }>('/api/orders', payload);

      if (response.success) {
        setSubmitType('success');
        setSubmitMessage('Pedido validado y enviado correctamente.');
        router.push('/checkout');
      } else {
        setSubmitType('error');
        setSubmitMessage(
          response.status === 400 ? (response.error || 'Datos inválidos.') :
          response.status === 404 ? 'No se encontró un producto o adicional.' :
          response.status === 500 ? 'Error interno del servidor.' :
          (response.error || 'Hubo un error al enviar el pedido.')
        );
      }
    } catch (error) {
      setSubmitType('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Error de red al enviar pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cartItems, paymentMethod, setPaymentMethod, deliveryType, setDeliveryType,
    customerData, formErrors, subtotal, discount, deliveryFee, total,
    handleRemoveItem, updateMainQuantity, setAdicional, handleCustomerDataChange,
    handleClearCart, handleConfirmOrder, isSubmitting, orderData, router,
    submitMessage, submitType,
  };
}

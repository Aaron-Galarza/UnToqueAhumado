import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Asegurate de que esta ruta apunte a tu cartStore real
import { useCartStore, CartItemWithExtras } from '@/stores/cartStore'; 
import { CART_EXTRAS } from '@/features/cart/data/extras';
import { useCheckout } from '@/features/cart/hooks/useCheckout';

export function useCartLogic() {
  const router = useRouter();

  // 1. ZUSTAND
  const cartItems = useCartStore((state) => state.items);
  const orderData = useCartStore((state) => state.orderData);
  const handleRemoveItem = useCartStore((state) => state.removeItem);
  const updateMainQuantity = useCartStore((state) => state.updateQuantity);
  const setAdicional = useCartStore((state) => state.updateAdicional);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderData = useCartStore((state) => state.setOrderData);
  
  // 1.5 BACKEND MAGIC (Punto 6)
  const { submitOrder, isLoading: isSubmitting } = useCheckout();

  // 2. ESTADOS LOCALES
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
  // Acá corregimos takeaway por pickup
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup'); 
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', address: '' });
  
  // 3. CÁLCULOS
  const itemTotal = (item: CartItemWithExtras) => {
    const adExtra = CART_EXTRAS.reduce((acc, a) => acc + (item.adicionales?.[a.id] || 0) * a.price, 0);
    return (item.price + adExtra) * item.quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + itemTotal(item), 0);
  const discount = orderData.couponCode ? subtotal * 0.10 : 0; 
  const deliveryFee = deliveryType === 'delivery' ? 'a convenir' : 0;
  const total = subtotal - discount + (typeof deliveryFee === 'number' ? deliveryFee : 0);

  // 4. HANDLERS
  const handleCustomerDataChange = (field: keyof typeof customerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro que querés vaciar todo el carrito?')) {
      clearCart();
    }
  };

  const handleConfirmOrder = async () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', address: '' };

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (customerData.name.trim().length < 3) {
      newErrors.name = 'Mínimo 3 letras.'; isValid = false;
    } else if (!nameRegex.test(customerData.name)) {
      newErrors.name = 'Solo letras.'; isValid = false;
    }

    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(customerData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Celular inválido.'; isValid = false;
    }

    if (deliveryType === 'delivery' && customerData.address.trim().length < 5) {
      newErrors.address = 'Dirección muy corta.'; isValid = false;
    }

    if (!isValid) {
      setFormErrors(newErrors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return; 
    }

    // Actualizamos el estado global antes de mandar
    setOrderData({
      ...orderData,
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      deliveryType: deliveryType,
      paymentMethod: paymentMethod
    });

    // ¡DISPARAMOS EL PEDIDO AL BACKEND DE AARON!
    // Fijate que borré toda la lógica de "detalleProductos", ya no hace falta.
    const result = await submitOrder();

    if (result.success) {
      router.push('/checkout'); // O a tu página de gracias
    } else {
      alert("Hubo un error al enviar el pedido. Por favor, intentá de nuevo.");
    }
  };

  // 5. RETORNAMOS LO QUE LA VISTA NECESITA
  return {
    cartItems,
    paymentMethod, setPaymentMethod,
    deliveryType, setDeliveryType,
    customerData,
    formErrors,
    subtotal, discount, deliveryFee, total,
    handleRemoveItem, updateMainQuantity, setAdicional,
    handleCustomerDataChange, handleClearCart, handleConfirmOrder,
    isSubmitting, 
    orderData,
    router
  };
}
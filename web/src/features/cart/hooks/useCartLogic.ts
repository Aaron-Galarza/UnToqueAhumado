import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItemWithExtras } from '@/stores/cartStore'; 
import { useAddons } from '@/features/menu/hooks/useAddons'; // <-- Traemos los reales
import { api } from '@/lib/api';

export function useCartLogic() {
  const router = useRouter();
  const addons = useAddons(); // <-- Instanciamos el hook

  // 1. ZUSTAND
  const cartItems = useCartStore((state) => state.items);
  const orderData = useCartStore((state) => state.orderData);
  const handleRemoveItem = useCartStore((state) => state.removeItem);
  const updateMainQuantity = useCartStore((state) => state.updateQuantity);
  const setAdicional = useCartStore((state) => state.updateAdicional);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderData = useCartStore((state) => state.setOrderData);

  // 2. ESTADOS LOCALES
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup'); 
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', address: '' });
  
  // 3. CÁLCULOS
  const itemTotal = (item: CartItemWithExtras) => {
    // Usamos los addons reales y su _id
    const adExtra = addons.reduce((acc, a) => acc + (item.adicionales?.[a._id] || 0) * a.price, 0);
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
    // --- VALIDACIONES ---
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

    // --- GUARDAMOS DATOS DEL CLIENTE ---
    setOrderData({
      ...orderData,
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      deliveryType: deliveryType,
      paymentMethod: paymentMethod
    });

    setIsSubmitting(true);

    try {
      // --- TRADUCCIÓN PARA LA API ---
      const itemsParaLaApi = cartItems.map(item => {
        const addonsArray = Object.entries(item.adicionales || {})
          .filter(([_, qty]) => (qty as number) > 0)
          .map(([addonId, qty]) => ({
            addonId: String(addonId),
            quantity: Number(qty)
          }));

        const apiItem: any = {
          productId: item.productId,
          quantity: Number(item.quantity)
        };

        if (addonsArray.length > 0) {
          apiItem.addons = addonsArray;
        }

        return apiItem;
      });

      const payload = {
        customer: {
          name: customerData.name,
          phone: customerData.phone,
          address: deliveryType === 'delivery' ? customerData.address : undefined
        },
        items: itemsParaLaApi,
        deliveryType: deliveryType,
        paymentMethod: paymentMethod
      };

      // --- DISPARAMOS LA PETICIÓN ---
      const response = await api.post<any>('/api/orders', payload);

      if (response.success) {
        router.push('/checkout'); 
      } else {
        alert("Error al crear el pedido: " + response.error);
      }
    } catch (error) {
      console.error("Error confirmando pedido:", error);
      alert("Hubo un error de conexión al enviar tu pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAdminStore } from '@/stores/adminStore';
import { CART_EXTRAS } from '@/features/cart/data/extras';
import { CartItem } from '@/features/cart/types/cart';

export function useCartLogic() {
  const router = useRouter();

  // 1. ZUSTAND
  const cartItems = useCartStore((state) => state.items);
  const handleRemoveItem = useCartStore((state) => state.removeItem);
  const updateMainQuantity = useCartStore((state) => state.updateQuantity);
  const setAdicional = useCartStore((state) => state.updateAdicional);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderData = useCartStore((state) => state.setOrderData);
  // Aaron: esto hoy "duplica" el pedido en el panel admin (modo demo). Con backend real debería ser un POST y el admin leer desde API.
  const addOrderToAdmin = useAdminStore((state) => state.addOrder); 

  // 2. ESTADOS LOCALES
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
  const [deliveryType, setDeliveryType] = useState<'takeaway' | 'delivery'>('takeaway');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', address: '' });
  
  // 3. CÁLCULOS
  const itemTotal = (item: CartItem) => {
    const adExtra = CART_EXTRAS.reduce((acc, a) => acc + (item.adicionales[a.id] || 0) * a.price, 0);
    return (item.price + adExtra) * item.quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + itemTotal(item), 0);
  const discount = discountApplied ? subtotal * 0.10 : 0;
  const deliveryFee = deliveryType === 'delivery' ? 'a convenir' : 0;
  const total = subtotal - discount + (typeof deliveryFee === 'number' ? deliveryFee : 0);

  // 4. HANDLERS
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SMASHTIKTOK') {
      setDiscountApplied(true);
    } else {
      alert("El código ingresado no es válido o está vencido.");
      setDiscountApplied(false);
      setPromoCode(''); 
    }
  };

  const handleCustomerDataChange = (field: keyof typeof customerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro que querés vaciar todo el carrito?')) {
      clearCart();
    }
  };

  const handleConfirmOrder = () => {
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

    setOrderData({
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      deliveryType: deliveryType,
      discountApplied: discountApplied,
      paymentMethod: paymentMethod
    });

    const detalleProductos = cartItems.map(item => {
      const texto = `${item.quantity}x ${item.name}`;
      const extras = Object.entries(item.adicionales)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const extraDef = CART_EXTRAS.find(e => e.id === id);
          return extraDef ? `\n  + ${qty}x ${extraDef.label}` : '';
        }).join('');
      return texto + extras;
    }).join('\n\n'); 

    addOrderToAdmin({
      customerName: customerData.name,
      phone: customerData.phone,
      items: detalleProductos, 
      total: total,
      status: 'Pendiente',
      paymentMethod: paymentMethod
    });

    router.push('/checkout');
  };

  // 5. RETORNAMOS TODO LO QUE LA VISTA NECESITA
  return {
    cartItems,
    paymentMethod, setPaymentMethod,
    deliveryType, setDeliveryType,
    promoCode, setPromoCode,
    discountApplied,
    customerData,
    formErrors,
    subtotal, discount, deliveryFee, total,
    handleRemoveItem, updateMainQuantity, setAdicional,
    handleApplyPromo, handleCustomerDataChange, handleClearCart, handleConfirmOrder,
    router
  };
}

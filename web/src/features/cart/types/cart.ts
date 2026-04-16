export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string; // <-- ¡Nuevo! Clave para aplicar reglas de negocio
  adicionales: Record<string, number>; 
}
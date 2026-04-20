"use client";

import React, { useState } from 'react';
import { Trash2, Tag } from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';

export function CouponsPanel() {
  // 1. CONEXIÓN CON ZUSTAND
  const coupons = useAdminStore((state) => state.coupons);
  const addCoupon = useAdminStore((state) => state.addCoupon);
  const deleteCoupon = useAdminStore((state) => state.deleteCoupon);

  // 2. ESTADOS DEL FORMULARIO
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('10'); // Por defecto 10%

  // 3. HANDLER
  const handleCreateCoupon = () => {
    if (newCode.trim().length < 3) {
      alert('El código debe tener al menos 3 letras.');
      return;
    }
    
    // Verificamos que no exista uno igual
    const exists = coupons.some(c => c.code === newCode.trim().toUpperCase());
    if (exists) {
      alert('¡Ese código ya existe!');
      return;
    }

    addCoupon(newCode.trim().toUpperCase(), newDiscount);
    setNewCode(''); // Limpiamos el input después de crear
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm h-[500px] flex flex-col">
      <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-gray-900 tracking-wide flex items-center gap-2 font-['Bebas_Neue']">
        <Tag className="w-5 h-5 md:w-6 md:h-6 text-[#FF5500]" />
        Marketing y Cupones
      </h3>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        
        {/* COLUMNA IZQUIERDA: CREAR CUPÓN */}
        <div className="space-y-4 md:pr-6 md:border-r border-gray-200">
          <h4 className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider mb-2 md:mb-4">
            Nuevo Cupón
          </h4>
          
          <div>
            <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Código (Ej: VERANO20)</label>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="SMASHTIKTOK"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#FF5500] uppercase"
            />
          </div>
          
          <div>
            <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">% de Descuento</label>
            <select
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#FF5500] cursor-pointer"
            >
              <option value="10">10% OFF</option>
              <option value="15">15% OFF</option>
              <option value="20">20% OFF</option>
              <option value="25">25% OFF</option>
              <option value="30">30% OFF</option>
            </select>
          </div>
          
          <button 
            onClick={handleCreateCoupon}
            disabled={!newCode.trim()}
            className="w-full mt-2 bg-gray-100 hover:bg-[#FF5500] hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 text-sm md:text-base font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Generar Cupón
          </button>
        </div>

        {/* COLUMNA DERECHA: CUPONES ACTIVOS */}
        <div className="flex flex-col min-h-[200px] md:min-h-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
          <h4 className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider mb-2 md:mb-4">
            Activos ({coupons.length})
          </h4>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {coupons.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-4">No hay cupones activos.</p>
            )}

            {coupons.map(coupon => (
              <div key={coupon.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center group hover:border-[#FF5500]/50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{coupon.code}</p>
                  <p className="text-xs text-[#FF5500] font-bold">{coupon.discount}% OFF</p>
                </div>
                <button 
                  onClick={() => deleteCoupon(coupon.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar cupón"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
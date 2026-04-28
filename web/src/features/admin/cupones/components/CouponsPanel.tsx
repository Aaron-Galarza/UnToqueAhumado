"use client";

import { useState } from 'react';
import { Trash2, Ticket, Percent as PercentIcon, RefreshCcw } from 'lucide-react';
import { useAdminCoupons } from '../data/useAdminCoupons';

export function CouponsPanel() {
  const { coupons, isLoading, createCoupon, deleteCoupon, refreshCoupons } = useAdminCoupons();
  
  // Estado local para el formulario
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!newCode.trim() || !newPercent || newPercent <= 0 || newPercent > 100) {
      alert("Por favor, ingresá un código válido y un porcentaje entre 1 y 100.");
      return;
    }

    setIsSubmitting(true);
    // Lo mandamos en mayúscula para que quede prolijo (ej: "SALE20")
    const success = await createCoupon(newCode.trim().toUpperCase(), Number(newPercent));
    
    if (success) {
      setNewCode('');
      setNewPercent('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: CREAR CUPÓN */}
        <div className="space-y-4 lg:pr-8 lg:border-r border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="w-6 h-6 text-primary" />
            <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue']">
              Crear Nuevo Cupón
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-bold uppercase tracking-wider">Código de Descuento</label>
              <div className="relative">
                <input 
                  type="text" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="Ej: VERANO20" maxLength={15}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary uppercase placeholder:normal-case" 
                />
                <Ticket className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-bold uppercase tracking-wider">Porcentaje de Descuento (%)</label>
              <div className="relative">
                <input 
                  type="number" value={newPercent} onChange={(e) => setNewPercent(Number(e.target.value))}
                  placeholder="Ej: 15" min="1" max="100"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-3 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary" 
                />
                <PercentIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button 
              onClick={handleCreate} disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? 'Guardando...' : 'Generar Cupón'}
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: LISTA DE CUPONES */}
        <div className="flex flex-col h-96 md:h-80 mt-2 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue']">
              Cupones Activos
            </h3>
            <button onClick={refreshCoupons} className="p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer">
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {isLoading && coupons.length === 0 ? (
               <div className="text-center py-8 text-gray-500 font-medium animate-pulse">Cargando cupones...</div>
            ) : coupons.map((coupon) => {
              const couponId = coupon._id || coupon.id || '';
              return (
                <div key={couponId} className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3 md:p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-2 md:p-3 rounded-lg border border-primary/20">
                      <PercentIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm md:text-base tracking-widest">{coupon.code}</h4>
                      <p className="text-xs md:text-sm font-semibold text-gray-500">Descuento del {coupon.Percent}%</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteCoupon(couponId)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                    title="Eliminar cupón"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}

            {!isLoading && coupons.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <Ticket className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm font-medium">No hay cupones activos.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
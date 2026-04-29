"use client";

// 1. Importamos a nuestro Patovica
import { AdminGuard } from '@/features/admin/login/AdminGuard'; 
import { AdminHeader } from '@/features/admin/AdminHeader';
import { AnalyticsPanel } from '@/features/admin/analytics/components/AnalyticsPanel';
import { OrdersPanel } from '@/features/admin/orders/components/OrdersPanel';
import { CouponsPanel } from '@/features/admin/cupones/components/CouponsPanel';
import { ProductsPanel } from '@/features/admin/products/components/ProductsPanel';
import { CategoriesPanel } from '@/features/admin/products/components/CategoriesPanel';
import { StoreSettingsPanel } from '@/features/admin/config/components/StoreSettingsPanel';
export default function AdminDashboard() {
  return (
    // 2. Envolvemos todo el Dashboard adentro del Guardián
    <AdminGuard>
      <div className="min-h-screen bg-[#F8F7F4] text-gray-900 pb-12">
        
        <AdminHeader />

        <main className="max-w-[1400px] mx-auto px-4 md:px-6 mt-6 md:mt-8 space-y-6">
          
          {/* FILA 1: KPIs */}
          <AnalyticsPanel />

          {/* FILA 2: Pedidos y Cupones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrdersPanel />
            <CouponsPanel />
          </div>

          {/* FILA 3: Productos */}
          <CategoriesPanel />
          <ProductsPanel />
          <StoreSettingsPanel />
        </main>

        {/* ESTILOS PARA EL SCROLLBAR DEL PANEL (Vienen del diseño original) */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          @media (min-width: 768px) {
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          }
          .custom-scrollbar::-webkit-scrollbar-track { background: #F5F5F5; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--primary); }
        `}</style>
      </div>
    </AdminGuard>
  );
}
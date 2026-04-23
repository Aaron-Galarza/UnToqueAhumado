"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Buscamos la llave en los bolsillos del navegador
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 2. Si no hay llave, lo pateamos a la pantalla de login inmediatamente
      router.push('/admin/login');
    } else {
      // 3. Si hay llave, le damos luz verde para ver el contenido
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si pasó la prueba, renderizamos la página Admin normal
  return <>{children}</>;
}
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useLogin } from '@/features/admin/login/useLogin'; // Ajustá la ruta de ser necesario

export default function AdminLoginPage() {
  const router = useRouter();
  const { 
    email, setEmail, 
    password, setPassword, 
    isLoading, error, handleLogin 
  } = useLogin();

  // NUEVO: Agregamos un estado para saber si todavía estamos revisando el token
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token, lo mandamos al panel (no cambiamos isChecking a false para que no haya flashazo)
      router.push('/admin');
    } else {
      // Si no hay token, bajamos el "telón" de carga y mostramos el formulario
      setIsChecking(false);
    }
  }, [router]);

  // NUEVO: Mientras revisa (esa milésima de segundo), mostramos un spinner en lugar del formulario
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border-2 border-border rounded-3xl p-8 shadow-xl">
        
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl text-center text-foreground mb-2 tracking-widest">
          PANEL DE CONTROL
        </h1>
        <p className="text-center text-muted-foreground font-medium mb-8">
          Ingresá tus credenciales para administrar el menú.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
              Contraseña
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold text-center animate-in fade-in">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-extrabold text-lg py-4 rounded-xl mt-2 hover:bg-primary/90 hover:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            {isLoading ? 'Ingresando...' : 'Entrar al Sistema'}
          </button>
        </form>

      </div>
    </div>
  );
}
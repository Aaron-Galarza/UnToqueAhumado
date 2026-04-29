import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast'; // Importamos el toast que ya tenés en el proyecto

export function useLogin() {
  // 1. Limpiamos las credenciales por defecto. ¡Seguridad ante todo!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica antes de llamar a la API
    if (!email || !password) {
      toast.error('Completá todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await api.post<{ token: string }>('/api/user/login', {
      email,
      password
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      
      // 2. Un toque de feedback positivo
      toast.success('¡Bienvenido, Admin! ');
      
      router.push('/admin');
    } else {
      // MAPEAMOS EL ERROR 401 A UN MENSAJE AMIGABLE
      let friendlyError = 'Ocurrió un error inesperado';

      if (response.error?.includes('401')) {
        friendlyError = 'Email o contraseña incorrectos';
      } else if (response.error?.includes('500')) {
        friendlyError = 'Error en el servidor, intentá más tarde';
      } else {
        friendlyError = response.error || 'No se pudo iniciar sesión';
      }

      setError(friendlyError);
      toast.error(friendlyError);
    }

    setIsLoading(false);
  };

  return {
    email, setEmail,
    password, setPassword,
    isLoading,
    error,
    handleLogin
  };
}
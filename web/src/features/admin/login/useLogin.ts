import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export function useLogin() {
  const [email, setEmail] = useState('admin@ahumado.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await api.post<{ token: string }>('/api/user/login', {
      email,
      password
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      
      router.push('/admin');
    } else {
      // Si le pifiamos a la contraseña, mostramos el error
      setError(response.error || 'Credenciales incorrectas');
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
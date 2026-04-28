import { io, Socket } from 'socket.io-client';

// Tomamos la URL directo de las variables de entorno
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Buscamos el token como lo hace tu api.ts
    const token = localStorage.getItem('token')?.replace(/"/g, '');

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect_error', (err) => {
      console.error('[SOCKET] Error de conexión:', err.message);
    });
    
    socket.on('connect', () => {
      console.log('[SOCKET] ¡Conectado al servidor en tiempo real! 🚀');
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[SOCKET] Desconectado.');
  }
};
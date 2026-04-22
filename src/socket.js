import { io } from 'socket.io-client';

// Reemplaza 'TU_URL_DE_RAILWAY_AQUI' con el enlace público que te generó Railway. 
// Ejemplo: 'https://mi-servidor-chattify.up.railway.app'
const URL = import.meta.env.VITE_SOCKET_URL || 'chatify-server-production-9820.up.railway.app';

export const socket = io(URL, {
  auth: {
    serverOffset: 0,
    ackTimeout: 10000,
    retries: 3,
  },
});
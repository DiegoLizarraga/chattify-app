import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'https://chatify-server-production-9820.up.railway.app';

export const socket = io(URL, {
  autoConnect: true,
  ackTimeout: 10000,
  retries: 3,
});
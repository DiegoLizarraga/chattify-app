import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export const socket = io(URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
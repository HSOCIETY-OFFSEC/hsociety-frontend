import { io } from 'socket.io-client';
import { envConfig } from '../../config/env.config';
import { sessionManager } from '../../core/auth/session.manager';

export const resolveSocketBaseURL = () => {
  const socketEnv =
    (typeof import.meta !== 'undefined' && import.meta.env
      ? String(import.meta.env.VITE_SOCKET_URL || '').trim()
      : '') || '';
  if (socketEnv) return socketEnv.replace(/\/+$/, '');

  const base = String(envConfig.api.baseURL || '').trim();
  if (base.startsWith('http://') || base.startsWith('https://')) {
    try {
      const parsed = new URL(base);
      return `${parsed.protocol}//${parsed.host}`;
    } catch (_err) {
      return base;
    }
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost:5173')) {
      return origin.replace('localhost:5173', 'localhost:3000');
    }
    if (origin.includes('127.0.0.1:5173')) {
      return origin.replace('127.0.0.1:5173', '127.0.0.1:3000');
    }
    return origin;
  }

  return '';
};

export const createAuthSocket = (options = {}) => {
  const token = sessionManager.getToken();
  return io(resolveSocketBaseURL(), {
    transports: ['websocket', 'polling'],
    auth: { token },
    ...options,
  });
};

export default {
  resolveSocketBaseURL,
  createAuthSocket,
};

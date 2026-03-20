import { io } from 'socket.io-client';
import { envConfig } from '../../config/app/env.config';
import { sessionManager } from '../../core/auth/session.manager';

export const resolveSocketBaseURL = () => {
  const pageProtocol =
    typeof window !== 'undefined' && window.location ? window.location.protocol : '';

  const normalizeProtocol = (raw) => {
    const value = String(raw || '').trim();
    if (!value) return '';

    if (value.startsWith('ws://') || value.startsWith('wss://')) {
      if (pageProtocol === 'https:' && value.startsWith('ws://')) {
        return `wss://${value.slice(5)}`;
      }
      return value;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
      if (pageProtocol === 'https:' && value.startsWith('http://')) {
        return `https://${value.slice(7)}`;
      }
      return value;
    }

    return value;
  };

  const socketEnv =
    (typeof import.meta !== 'undefined' && import.meta.env
      ? String(import.meta.env.VITE_SOCKET_URL || '').trim()
      : '') || '';
  if (socketEnv) return normalizeProtocol(socketEnv).replace(/\/+$/, '');

  const base = String(envConfig.api.baseURL || '').trim();
  if (base.startsWith('http://') || base.startsWith('https://')) {
    try {
      const parsed = new URL(base);
      const origin = `${parsed.protocol}//${parsed.host}`;
      return normalizeProtocol(origin);
    } catch (_err) {
      return normalizeProtocol(base);
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
    return normalizeProtocol(origin);
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

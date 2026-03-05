import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../features/student/services/notifications.service';
import BinaryToast from '../components/ui/BinaryToast';
import { getPendingToast, clearPendingToast } from './toastStorage';
import { createAuthSocket } from '../services/socket.client';

const NotificationContext = createContext(undefined);

const createAudioContext = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  return AudioCtx ? new AudioCtx() : null;
};

const playTone = (ctx, { frequency = 520, duration = 0.12, type = 'sine', gain = 0.06 }) => {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const toastTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const lastIdsRef = useRef(new Set());
  const firstLoadRef = useRef(true);
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const lastClickRef = useRef(0);

  const ensureAudio = async () => {
    if (typeof window === 'undefined') return null;
    if (!audioRef.current) audioRef.current = createAudioContext();
    if (!audioRef.current) return null;
    if (audioRef.current.state === 'suspended') {
      try {
        await audioRef.current.resume();
      } catch (err) {
        return null;
      }
    }
    return audioRef.current;
  };

  const playClickSound = async () => {
    const now = performance.now();
    if (now - lastClickRef.current < 60) return;
    lastClickRef.current = now;
    const ctx = await ensureAudio();
    if (!ctx) return;
    playTone(ctx, { frequency: 620, duration: 0.06, type: 'triangle', gain: 0.03 });
  };

  const playSuccessSound = async () => {
    const ctx = await ensureAudio();
    if (!ctx) return;
    playTone(ctx, { frequency: 520, duration: 0.1, type: 'sine', gain: 0.05 });
    playTone(ctx, { frequency: 760, duration: 0.08, type: 'sine', gain: 0.03 });
  };

  const playNotificationSound = async () => {
    const ctx = await ensureAudio();
    if (!ctx) return;
    playTone(ctx, { frequency: 460, duration: 0.12, type: 'sine', gain: 0.045 });
  };

  const showToast = (payload = {}) => {
    const duration = Number(payload.duration || 3600);
    const nextToast = {
      id: Date.now(),
      variant: payload.variant || 'success',
      title: payload.title || 'Success',
      message: payload.message || '',
      duration,
    };
    setToast(nextToast);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, duration);
    if (payload.tone === 'notify') {
      playNotificationSound();
    } else {
      playSuccessSound();
    }
  };

  const refreshNotifications = async (opts = {}) => {
    if (!isAuthenticated) return;
    const response = await listNotifications();
    if (!response.success) return;
    const items = response.data || [];
    setNotifications(items);

    if (firstLoadRef.current) {
      lastIdsRef.current = new Set(items.map((item) => item.id));
      firstLoadRef.current = false;
      return;
    }

    const newItems = items.filter((item) => !lastIdsRef.current.has(item.id));
    if (newItems.length > 0 && opts?.shouldToast !== false) {
      const unread = newItems.find((item) => !item.read) || newItems[0];
      showToast({
        variant: 'info',
        title: unread.title || 'New notification',
        message: unread.message || 'You have new activity.',
        tone: 'notify',
        duration: 4200,
      });
    }

    lastIdsRef.current = new Set(items.map((item) => item.id));
  };

  const markRead = async (id) => {
    if (!id) return;
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleClick = (event) => {
      const target = event.target;
      const clickable = target.closest('button, a, [role="button"]');
      if (!clickable) return;
      if (clickable.disabled || clickable.getAttribute('aria-disabled') === 'true') return;
      if (clickable.closest('[data-sound="off"]')) return;
      playClickSound();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const stored = getPendingToast();
    if (stored) {
      showToast(stored);
      clearPendingToast();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      firstLoadRef.current = true;
      lastIdsRef.current = new Set();
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
      return undefined;
    }

    let mounted = true;
    const load = async () => {
      if (!mounted) return;
      setIsPolling(true);
      await refreshNotifications({ shouldToast: false });
      setIsPolling(false);
    };

    load();

    const socket = createAuthSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      refreshNotifications({ shouldToast: false });
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('notification:new', (payload) => {
      if (!payload?.id) return;
      setNotifications((prev) => {
        const exists = prev.some((item) => item.id === payload.id);
        if (exists) return prev;
        return [payload, ...prev].slice(0, 50);
      });
      lastIdsRef.current.add(payload.id);
      showToast({
        variant: 'info',
        title: payload.title || 'New notification',
        message: payload.message || 'You have new activity.',
        tone: 'notify',
        duration: 4200,
      });
    });

    return () => {
      mounted = false;
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);

    const interval = socketConnected ? 120000 : 30000;
    pollTimerRef.current = window.setInterval(() => {
      if (!socketConnected) {
        refreshNotifications({ shouldToast: true });
      }
    }, interval);

    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
    };
  }, [isAuthenticated, socketConnected]);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isPolling,
    refreshNotifications,
    markRead,
    markAllRead,
    showToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <BinaryToast toast={toast} onClose={() => setToast(null)} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationProvider;

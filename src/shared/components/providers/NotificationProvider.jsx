import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../features/student/services/notifications.service';
import BinaryToast from '../ui/BinaryToast';
import { getPendingToast, clearPendingToast } from '../../utils/toastStorage';
import { createAuthSocket } from '../../services/socket.client';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const [cpModal, setCpModal] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const toastTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const lastIdsRef = useRef(new Set());
  const firstLoadRef = useRef(true);
  const socketRef = useRef(null);

  const showBrowserNotification = (payload = {}) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (!document.hidden) return;
    try {
      new Notification(payload.title || 'HSOCIETY', {
        body: payload.message || 'You have new activity.',
        icon: '/FAVICON_HSOCIETY_BLACK/android-chrome-192x192.png',
        tag: payload.tag || 'hsociety-notification',
      });
    } catch {
      // ignore
    }
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
      showBrowserNotification(payload);
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
      const cpGrant = newItems.find((item) => item.type === 'cp_points_granted');
      if (cpGrant) {
        setCpModal({
          id: cpGrant.id,
          title: cpGrant.title || 'CP Points Added',
          message: cpGrant.message || 'You received CP points.',
          points: cpGrant.metadata?.points,
        });
      }
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
      if (payload.type === 'cp_points_granted') {
        setCpModal({
          id: payload.id,
          title: payload.title || 'CP Points Added',
          message: payload.message || 'You received CP points.',
          points: payload.metadata?.points,
        });
      }
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
      {cpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay-bg)] p-6 backdrop-blur"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex w-[min(420px,92vw)] flex-col gap-3 rounded-2xl border border-border bg-bg-secondary p-6 text-center shadow-xl animate-modal-card-in">
            <h3 className="text-lg font-semibold">{cpModal.title}</h3>
            <p className="text-text-secondary">{cpModal.message}</p>
            {cpModal.points !== undefined && (
              <span className="text-3xl font-bold text-brand">+{cpModal.points} CP</span>
            )}
            <button
              type="button"
              className="rounded-sm border border-border bg-bg-tertiary px-4 py-2 font-semibold text-text-primary"
              onClick={() => {
                if (cpModal.id) markRead(cpModal.id);
                setCpModal(null);
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiBell, FiCheckCircle, FiInbox, FiRefreshCcw, FiShield, FiMessageSquare, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../shared/components/providers/NotificationProvider';
import { openNotificationTarget } from '../../../shared/utils/notificationNavigation';

const NotificationsInbox = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    refreshNotifications,
    isPolling,
  } = useNotifications();
  const [filter, setFilter] = useState('all');
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    refreshNotifications({ shouldToast: false });
  }, [refreshNotifications]);

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter((item) => !item.read);
    return notifications;
  }, [notifications, filter]);

  const totalCount = notifications.length;

  const typeCounts = useMemo(() => {
    return notifications.reduce((acc, n) => {
      const type = n.type || 'general';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, [notifications]);

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 pb-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-bg-secondary">
              <FiBell size={20} className="text-brand" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
                <span className="font-semibold text-text-secondary">HSOCIETY</span>
                <span className="text-text-tertiary">/</span>
                <span className="font-semibold text-text-secondary">notifications</span>
                <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
                  Private
                </span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                Review all alerts, mentions, and account updates in one feed.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary disabled:opacity-60"
              onClick={() => refreshNotifications({ shouldToast: false })}
              data-sound="off"
            >
              <FiRefreshCcw size={14} />
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-2 text-sm font-medium text-ink-onBrand transition hover:bg-brand-hover disabled:opacity-60"
              onClick={markAllRead}
              disabled={totalCount === 0 || unreadCount === 0}
            >
              <FiCheckCircle size={14} />
              Mark all read
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiInbox size={13} className="text-text-tertiary" />
            <span>Total</span>
            <strong className="text-text-primary">{totalCount}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiBell size={13} className="text-text-tertiary" />
            <span>Unread</span>
            <strong className="text-text-primary">{unreadCount}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiRefreshCcw size={13} className="text-text-tertiary" />
            <span>Status</span>
            <strong className="text-text-primary">{isPolling ? 'Syncing' : 'Idle'}</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <main className="min-w-0">
          <section className="py-4">
            <h2 className="text-base font-semibold text-text-primary">All notifications</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Open a notification to jump to the linked message or resource.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className={`rounded-xs border px-3 py-1 text-xs font-semibold transition ${
                  filter === 'all'
                    ? 'border-brand/40 bg-bg-tertiary text-text-primary'
                    : 'border-border bg-bg-secondary text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`rounded-xs border px-3 py-1 text-xs font-semibold transition ${
                  filter === 'unread'
                    ? 'border-brand/40 bg-bg-tertiary text-text-primary'
                    : 'border-border bg-bg-secondary text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-sm border border-border">
              {filtered.length === 0 ? (
                <div className="bg-bg-secondary px-4 py-4 text-sm text-text-tertiary">
                  No notifications to show.
                </div>
              ) : (
                filtered.map((item) => (
                  <article
                    key={item.id}
                    className={`flex flex-col gap-4 border-b border-border px-4 py-3 transition sm:flex-row sm:items-center sm:justify-between ${
                      item.read ? 'bg-bg-secondary hover:bg-bg-tertiary' : 'bg-brand/5 hover:bg-bg-tertiary'
                    }`}
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                      <span className="text-sm text-text-secondary">{item.message}</span>
                      <span className="text-xs text-text-tertiary">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!item.read && (
                        <span className="inline-flex items-center rounded-full border border-status-warning/40 bg-status-warning/10 px-2 py-0.5 text-xs font-semibold text-status-warning">
                          Unread
                        </span>
                      )}
                      {item.read && (
                        <span className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                          Read
                        </span>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-tertiary"
                        onClick={async () => {
                          await markRead(item.id);
                          openNotificationTarget(item, navigate);
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default NotificationsInbox;

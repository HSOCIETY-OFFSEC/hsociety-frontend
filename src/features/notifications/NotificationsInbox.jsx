import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiBell, FiCheckCircle, FiInbox, FiRefreshCcw, FiShield, FiMessageSquare, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../shared/notifications/NotificationProvider';
import { openNotificationTarget } from '../../shared/utils/notificationNavigation';
import './notifications.css';

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
    <div className="nb-page">
      <header className="nb-page-header">
        <div className="nb-page-header-inner">
          <div className="nb-header-left">
            <div className="nb-header-icon-wrap">
              <FiBell size={20} className="nb-header-icon" />
            </div>
            <div>
              <div className="nb-header-breadcrumb">
                <span className="nb-breadcrumb-org">HSOCIETY</span>
                <span className="nb-breadcrumb-sep">/</span>
                <span className="nb-breadcrumb-page">notifications</span>
                <span className="nb-header-visibility">Private</span>
              </div>
              <p className="nb-header-desc">Review all alerts, mentions, and account updates in one feed.</p>
            </div>
          </div>
          <div className="nb-header-actions">
            <button
              type="button"
              className="nb-btn nb-btn-secondary"
              onClick={() => refreshNotifications({ shouldToast: false })}
              data-sound="off"
            >
              <FiRefreshCcw size={14} />
              Refresh
            </button>
            <button
              type="button"
              className="nb-btn nb-btn-primary"
              onClick={markAllRead}
              disabled={totalCount === 0 || unreadCount === 0}
            >
              <FiCheckCircle size={14} />
              Mark all read
            </button>
          </div>
        </div>
        <div className="nb-header-meta">
          <span className="nb-meta-pill">
            <FiInbox size={13} className="nb-meta-icon" />
            <span className="nb-meta-label">Total</span>
            <strong className="nb-meta-value">{totalCount}</strong>
          </span>
          <span className="nb-meta-pill">
            <FiBell size={13} className="nb-meta-icon" />
            <span className="nb-meta-label">Unread</span>
            <strong className="nb-meta-value">{unreadCount}</strong>
          </span>
          <span className="nb-meta-pill">
            <FiRefreshCcw size={13} className="nb-meta-icon" />
            <span className="nb-meta-label">Status</span>
            <strong className="nb-meta-value">{isPolling ? 'Syncing' : 'Idle'}</strong>
          </span>
        </div>
      </header>

      <div className="nb-layout">
        <main className="nb-main">
          <section className="nb-section">
            <h2 className="nb-section-title">All notifications</h2>
            <p className="nb-section-desc">Open a notification to jump to the linked message or resource.</p>

            <div className="nb-filter-row">
              <button
                type="button"
                className={`nb-filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`nb-filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>

            <div className="nb-item-list">
              {filtered.length === 0 ? (
                <div className="nb-empty">No notifications to show.</div>
              ) : (
                filtered.map((item) => (
                  <article
                    key={item.id}
                    className={`nb-item-row ${item.read ? '' : 'unread'}`}
                  >
                    <div className="nb-item-main">
                      <span className="nb-item-title">{item.title}</span>
                      <span className="nb-item-subtitle">{item.message}</span>
                      <span className="nb-item-time">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <div className="nb-item-meta">
                      {!item.read && <span className="nb-label nb-label-gamma">Unread</span>}
                      {item.read && <span className="nb-label nb-label-alpha">Read</span>}
                      <button
                        type="button"
                        className="nb-btn nb-btn-secondary"
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

        <aside className="nb-sidebar">
          <div className="nb-sidebar-box nb-status-box">
            <div className="nb-status-row">
              <span className="nb-status-dot" />
              <span className="nb-status-label">INBOX STATUS</span>
            </div>
            <strong className="nb-status-value">{unreadCount > 0 ? 'ACTIVE' : 'CLEAR'}</strong>
            <div className="nb-status-track">
              <div
                className="nb-status-fill"
                style={{ width: unreadCount > 0 ? '70%' : '100%' }}
              />
            </div>
            <p className="nb-status-note">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'} waiting.` : 'All caught up.'}
            </p>
          </div>

          <div className="nb-sidebar-box">
            <h3 className="nb-sidebar-heading">Summary</h3>
            <div className="nb-sidebar-divider" />
            <ul className="nb-sidebar-list">
              <li>
                <FiInbox size={13} className="nb-sidebar-icon" />
                <span>Total</span>
                <strong className="nb-sidebar-count">{totalCount}</strong>
              </li>
              <li>
                <FiBell size={13} className="nb-sidebar-icon" />
                <span>Unread</span>
                <strong className="nb-sidebar-count">{unreadCount}</strong>
              </li>
              <li>
                <FiCheckCircle size={13} className="nb-sidebar-icon" />
                <span>Read</span>
                <strong className="nb-sidebar-count">{totalCount - unreadCount}</strong>
              </li>
            </ul>
          </div>

          {Object.keys(typeCounts).length > 0 && (
            <div className="nb-sidebar-box">
              <h3 className="nb-sidebar-heading">By Type</h3>
              <div className="nb-sidebar-divider" />
              <ul className="nb-sidebar-list">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <li key={type}>
                    <FiInfo size={13} className="nb-sidebar-icon" />
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    <strong className="nb-sidebar-count">{count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="nb-sidebar-box">
            <h3 className="nb-sidebar-heading">Filters</h3>
            <div className="nb-sidebar-divider" />
            <div className="nb-sidebar-filters">
              <button
                type="button"
                className={`nb-sidebar-filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <FiInbox size={13} /> All notifications
              </button>
              <button
                type="button"
                className={`nb-sidebar-filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                <FiBell size={13} /> Unread only
              </button>
            </div>
          </div>

          <div className="nb-sidebar-box">
            <h3 className="nb-sidebar-heading">Topics</h3>
            <div className="nb-topics">
              <span className="nb-topic">mentions</span>
              <span className="nb-topic">alerts</span>
              <span className="nb-topic">community</span>
              <span className="nb-topic">security</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NotificationsInbox;

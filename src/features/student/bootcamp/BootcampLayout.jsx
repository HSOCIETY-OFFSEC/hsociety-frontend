import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LuArrowLeft,
  LuBookOpen,
  LuBell,
  LuChevronDown,
  LuGrid2X2,
  LuHouse,
  LuLayers,
  LuLogOut,
  LuTrendingUp,
  LuUser,
} from 'react-icons/lu';
import { IoFlameOutline } from 'react-icons/io5';
import { useAuth } from '../../../core/auth/AuthContext';
import { registerBootcamp } from '../../dashboards/student/student.service';
import StudentAccessModal from '../components/StudentAccessModal';
import useBootcampAccess from '../hooks/useBootcampAccess';
import BootcampSidebar from './BootcampSidebar';
import BottomNav from '../../../shared/components/layout/BottomNav';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import { useNotifications } from '../../../shared/notifications/NotificationProvider';
import { useUserStats } from '../../../shared/hooks/useUserStats';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { WORKSPACE_UI } from '../../../data/shared/workspaceUiData';
import '../../../styles/shared/components/layout/WorkspaceLayout.css';
import '../../../styles/student/bootcamp-app.css';

const BootcampLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [navMode, setNavMode] = useState('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanel, setRightPanel] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [accessModalCopy, setAccessModalCopy] = useState({
    title: 'Bootcamp access required',
    description: 'Please complete registration and payment to unlock the bootcamp dashboard.',
    primaryLabel: 'Go to Payments',
    onPrimary: () => navigate('/student-payments'),
  });
  const [registering, setRegistering] = useState(false);
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  } = useNotifications();
  const role = user?.role === 'client' ? 'corporate' : user?.role;
  const { cpTotal, streakDays } = useUserStats(user?.id, role);
  const menuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const resolveMode = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };
    const handleResize = () => setNavMode(resolveMode());
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stored = window?.sessionStorage?.getItem('hsociety.bootcamp.sidebar.collapsed');
    if (stored === 'true' || stored === 'false') {
      setSidebarCollapsed(stored === 'true');
      return;
    }
    setSidebarCollapsed(navMode === 'tablet');
  }, [navMode]);

  useEffect(() => {
    document.body.classList.remove('bootcamp-lock-scroll');
    return () => document.body.classList.remove('bootcamp-lock-scroll');
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotificationMenuOpen(false);
  }, [location.pathname]);

  const avatarFallback = useMemo(
    () => getGithubAvatarDataUri(user?.email || user?.name || 'user'),
    [user?.email, user?.name]
  );
  const avatarSrc = user?.avatarUrl || avatarFallback;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!notificationMenuOpen) return undefined;
    const handleClick = (event) => {
      if (!notificationMenuRef.current || notificationMenuRef.current.contains(event.target)) return;
      setNotificationMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notificationMenuOpen]);

  const gateAccess = Boolean(user) && (!isRegistered || !isPaid);

  useEffect(() => {
    if (!gateAccess) {
      setAccessModalOpen(false);
      return;
    }

    if (!isRegistered) {
      setAccessModalCopy({
        title: 'Bootcamp registration required',
        description: 'You have not registered for the bootcamp yet. Register now to begin the enrollment process.',
        primaryLabel: registering ? 'Registering…' : 'Register for Bootcamp',
        onPrimary: null,
      });
      setAccessModalOpen(true);
      return;
    }

    setAccessModalCopy({
      title: 'Bootcamp payment required',
      description: 'Have you completed payment for the bootcamp? Payment unlocks your dashboard access.',
      primaryLabel: 'Go to Payments',
      onPrimary: () => navigate('/student-payments'),
    });
    setAccessModalOpen(true);
  }, [gateAccess, isRegistered, isPaid, navigate, registering]);

  const handleRegisterBootcamp = useCallback(async () => {
    if (registering) return;
    setRegistering(true);
    const response = await registerBootcamp({
      experienceLevel: 'beginner',
      goal: 'Join Hacker Protocol',
      availability: '6-10',
    });

    if (response.success) {
      updateUser({
        bootcampRegistered: true,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid',
      });
      navigate('/student-payments');
    }

    setRegistering(false);
  }, [navigate, registering, updateUser]);

  const bottomNavLinks = useMemo(
    () => [
      { path: '/student-dashboard', label: 'Dashboard', icon: LuHouse },
      { path: '/student-bootcamps/overview', label: 'Overview', icon: LuLayers },
      { path: '/student-bootcamps/modules', label: 'Modules', icon: LuGrid2X2 },
      { path: '/student-bootcamps/resources', label: 'Resources', icon: LuBookOpen },
      { path: '/student-bootcamps/progress', label: 'Progress', icon: LuTrendingUp },
    ],
    []
  );

  return (
    <div
      className={`bootcamp-app ${gateAccess ? 'bootcamp-gated' : ''} ${
        sidebarCollapsed ? 'bootcamp-collapsed' : ''
      } ${navMode}`}
      style={{
        '--bootcamp-sidebar-width': sidebarCollapsed ? '84px' : '260px',
        '--bootcamp-sidebar-collapsed-width': '84px',
        '--bottom-nav-height': '64px',
      }}
    >
      <header className="workspace-topbar bootcamp-topbar">
        <div className="workspace-topbar-content bootcamp-topbar-content">
          <div className="bootcamp-topbar-left">
            <button
              type="button"
              className="workspace-home-button"
              onClick={() => navigate('/')}
              aria-label={WORKSPACE_UI.aria.goHome}
            >
              <LuHouse size={16} />
              <span>{WORKSPACE_UI.topbar.home}</span>
            </button>
            <button
              type="button"
              className="workspace-home-button bootcamp-back-btn"
              onClick={() => navigate('/student-dashboard')}
              aria-label="Back to student dashboard"
            >
              <LuArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <div className="workspace-topbar-actions">
            {user?.id && (
              <div className="workspace-cp-chip" title={WORKSPACE_UI.cpChipTitle}>
                <img src={cpIcon} alt="CP" className="workspace-cp-chip-icon" />
                <span>{cpTotal}</span>
              </div>
            )}

            {role === 'student' && (
              <div className="workspace-streak-chip" title={WORKSPACE_UI.streakTitle}>
                <IoFlameOutline size={15} />
                <span>{streakDays}</span>
              </div>
            )}

            <div
              className="workspace-notification-wrap"
              ref={notificationMenuRef}
              onMouseLeave={() => setNotificationMenuOpen(false)}
            >
              <button
                type="button"
                className="workspace-notification-btn"
                onClick={() => setNotificationMenuOpen((prev) => !prev)}
                aria-label={WORKSPACE_UI.aria.notifications}
              >
                <LuBell size={16} />
                {unreadCount > 0 && <span className="workspace-notification-badge">{unreadCount}</span>}
              </button>

              {notificationMenuOpen && (
                <div className="workspace-notification-menu">
                  <div className="workspace-notification-head">
                    <strong>{WORKSPACE_UI.notifications.title}</strong>
                    <button
                      type="button"
                      onClick={async () => {
                        await markAllRead();
                      }}
                    >
                      {WORKSPACE_UI.notifications.markAllRead}
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="workspace-notification-empty">{WORKSPACE_UI.notifications.empty}</p>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`workspace-notification-item ${item.read ? '' : 'unread'}`}
                        onClick={async () => {
                          await markRead(item.id);
                          if (item.metadata?.meetUrl) {
                            window.open(item.metadata.meetUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <strong>{item.title}</strong>
                        <span>{item.message}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div ref={menuRef} onMouseLeave={() => setMenuOpen(false)}>
              <button
                type="button"
                className="workspace-profile-button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="workspace-avatar">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    onError={(e) => {
                      if (e.currentTarget.src !== avatarFallback) {
                        e.currentTarget.src = avatarFallback;
                      }
                    }}
                  />
                </span>
                <span className="workspace-profile-name">
                  {user?.name || user?.email || WORKSPACE_UI.topbar.userFallback}
                </span>
                <LuChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className="workspace-profile-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <LuUser size={16} />
                    {WORKSPACE_UI.topbar.profile}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/settings');
                    }}
                  >
                    {WORKSPACE_UI.topbar.accountSettings}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={async () => {
                      setMenuOpen(false);
                      await logout();
                    }}
                  >
                    <LuLogOut size={16} />
                    {WORKSPACE_UI.topbar.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {!gateAccess && navMode !== 'mobile' && (
        <aside className="bootcamp-sidebar">
          <BootcampSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              const next = !sidebarCollapsed;
              setSidebarCollapsed(next);
              window?.sessionStorage?.setItem('hsociety.bootcamp.sidebar.collapsed', String(next));
            }}
          />
        </aside>
      )}

      <main className="bootcamp-main">
        {!gateAccess && <Outlet context={{ setRightPanel }} />}
      </main>

      {!gateAccess && navMode !== 'mobile' && (
        <aside className={`bootcamp-right ${rightPanel ? 'active' : ''}`}>
          {rightPanel}
        </aside>
      )}

      {!gateAccess && navMode !== 'mobile' && (
        <footer className="bootcamp-footer">
          <span>HSOCIETY Bootcamp Learning</span>
          <span>Live classes + guided progression</span>
        </footer>
      )}

      {navMode === 'mobile' && !gateAccess && <BottomNav links={bottomNavLinks} />}

      {accessModalOpen && (
        <StudentAccessModal
          title={accessModalCopy.title}
          description={accessModalCopy.description}
          primaryLabel={accessModalCopy.primaryLabel}
          onPrimary={() => {
            if (!isRegistered) {
              handleRegisterBootcamp();
              return;
            }
            accessModalCopy.onPrimary?.();
          }}
          onClose={() => {
            setAccessModalOpen(false);
            navigate('/student-dashboard');
          }}
        />
      )}
    </div>
  );
};

export default BootcampLayout;

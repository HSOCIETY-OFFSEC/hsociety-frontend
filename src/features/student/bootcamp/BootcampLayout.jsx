import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LuArrowLeft,
  LuChevronsLeft,
  LuChevronsRight,
  LuBookOpen,
  LuGrid2X2,
  LuHouse,
  LuLayers,
  LuTrendingUp,
} from 'react-icons/lu';
import { useAuth } from '../../../core/auth/AuthContext';
import { registerBootcamp } from '../../dashboards/student/student.service';
import StudentAccessModal from '../components/StudentAccessModal';
import useBootcampAccess from '../hooks/useBootcampAccess';
import BootcampSidebar from './BootcampSidebar';
import BottomNav from '../../../shared/components/layout/BottomNav';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../../data/bootcamps/hackerProtocolData';
import '../../../styles/shared/components/layout/WorkspaceLayout.css';
import '../../../styles/student/bootcamp-app.css';

const BootcampLayout = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [navMode, setNavMode] = useState('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanel, setRightPanel] = useState(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [accessModalCopy, setAccessModalCopy] = useState({
    title: 'Bootcamp access required',
    description: 'Please complete registration and payment to unlock the bootcamp dashboard.',
    primaryLabel: 'Go to Payments',
    onPrimary: () => navigate('/student-payments'),
  });
  const [registering, setRegistering] = useState(false);

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

  const title = useMemo(() => HACKER_PROTOCOL_BOOTCAMP.title, []);
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
              className="bootcamp-collapse-btn"
              onClick={() => {
                const next = !sidebarCollapsed;
                setSidebarCollapsed(next);
                window?.sessionStorage?.setItem('hsociety.bootcamp.sidebar.collapsed', String(next));
              }}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <LuChevronsRight size={16} /> : <LuChevronsLeft size={16} />}
            </button>
            <button
              type="button"
              className="workspace-home-button bootcamp-back-btn"
              onClick={() => navigate('/student-dashboard')}
            >
              <LuArrowLeft size={16} />
              Back to Dashboard
            </button>
            <div className="bootcamp-title">
              <span className="bootcamp-title-label">Bootcamp</span>
              <strong>{title}</strong>
            </div>
          </div>
          <div className="bootcamp-topbar-right">
            <div className="bootcamp-user-chip">
              <span>{user?.name || user?.email || 'Student'}</span>
            </div>
          </div>
        </div>
      </header>

      {!gateAccess && navMode !== 'mobile' && (
        <aside className="bootcamp-sidebar">
          <BootcampSidebar collapsed={sidebarCollapsed} />
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiExternalLink, FiShield } from 'react-icons/fi';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import '../../styles/student/base.css';
import '../../styles/student/components.css';
import '../../styles/student/pages/resources.css';

const StudentResources = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, isPaid, hasAccess } = useBootcampAccess();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const triggerAccessModal = () => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    setShowPaymentModal(true);
  };

  useEffect(() => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      setShowPaymentModal(false);
      return;
    }
    if (!isPaid) {
      setShowPaymentModal(true);
      setShowRegisterModal(false);
      return;
    }
    setShowRegisterModal(false);
    setShowPaymentModal(false);
  }, [isRegistered, isPaid]);

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Bootcamp Resources</p>
            <h1 className="dashboard-shell-title">Curated materials for every module.</h1>
            <p className="dashboard-shell-subtitle">
              Review the readings, playbooks, and tools shared by the cohort instructors.
            </p>
          </div>
          <div className="dashboard-shell-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => (hasAccess ? navigate('/student-learning') : triggerAccessModal())}
            >
              <FiBookOpen size={18} />
              {hasAccess ? 'Open Learning Path' : 'Access Denied'}
            </Button>
          </div>
        </header>

        <div className="student-grid">
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiShield size={20} />
              <h3>Core Playbooks</h3>
            </div>
            <p>
              Step-by-step tactical notes used in live sessions, plus follow-up checklists for each
              module.
            </p>
            <Button variant="secondary" size="small" disabled={!hasAccess}>
              {hasAccess ? 'View playbooks' : 'Access Denied'}
            </Button>
          </Card>
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiBookOpen size={20} />
              <h3>Reading Bundles</h3>
            </div>
            <p>
              Recommended readings, whitepapers, and quick references curated for the bootcamp
              track.
            </p>
            <Button variant="secondary" size="small" disabled={!hasAccess}>
              {hasAccess ? 'Open bundle' : 'Access Denied'}
            </Button>
          </Card>
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiExternalLink size={20} />
              <h3>Tooling Vault</h3>
            </div>
            <p>
              Installer kits, VM snapshots, and lab resources prepared for the cohort.
            </p>
            <Button variant="secondary" size="small" disabled={!hasAccess}>
              {hasAccess ? 'Download tools' : 'Access Denied'}
            </Button>
          </Card>
        </div>
      </div>

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register for the bootcamp before you can access learning resources."
          primaryLabel="Go to Bootcamp"
          onPrimary={() => navigate('/student-bootcamp')}
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showPaymentModal && !showRegisterModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentResources;

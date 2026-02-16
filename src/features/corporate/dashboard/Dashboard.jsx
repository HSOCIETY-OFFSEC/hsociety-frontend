import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiShield } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import Card from '../../../shared/components/ui/Card';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getDashboardOverview } from './dashboard.service';
import StatsGrid from './components/StatsGrid';
import QuickActions from './components/QuickActions';
import ActivityList from './components/ActivityList';
import SecurityNotice from './components/SecurityNotice';
import '../../../styles/features/dashboard.css';

/**
 * Dashboard Component
 * Location: src/features/corporate/dashboard/Dashboard.jsx
 * 
 * Features:
 * - User overview and stats
 * - Quick action cards
 * - Recent activity feed
 * - Service status overview
 * - 3D card effects
 * - Responsive layout
 * 
 * TODO: Backend integration for real data
 */

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useScrollReveal('.reveal-on-scroll', {}, [loading]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      const response = await getDashboardOverview();
      if (!response.success) {
        throw new Error(response.error || 'Failed to load dashboard');
      }
      setStats(response.data.stats);
      setRecentActivities(response.data.recentActivity);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Request Pentest',
      description: 'Schedule a new penetration testing engagement',
      icon: FiShield,
      path: '/pentest',
      color: '#10b981'
    },
    {
      title: 'View Audits',
      description: 'Access your security audit reports',
      icon: FiFileText,
      path: '/audits',
      color: '#3b82f6'
    },
    {
      title: 'Submit Feedback',
      description: 'Share your experience or report issues',
      icon: FiMessageSquare,
      path: '/feedback',
      color: '#f59e0b'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
          <div className="dashboard-wrapper">
            <div className="dashboard-header">
              <div>
                <Skeleton className="skeleton-line" style={{ width: '220px' }} />
                <Skeleton className="skeleton-line" style={{ width: '320px', marginTop: '0.75rem' }} />
              </div>
            </div>

            <div className="stats-grid">
              {[...Array(4)].map((_, index) => (
                <Card key={index} padding="large" shadow="medium">
                  <div className="stat-card">
                    <Skeleton className="skeleton-circle" style={{ width: '64px', height: '64px' }} />
                    <div className="stat-content">
                      <Skeleton className="skeleton-line" style={{ width: '120px' }} />
                      <Skeleton className="skeleton-line" style={{ width: '70px', height: '26px', marginTop: '0.75rem' }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="section">
              <Skeleton className="skeleton-line" style={{ width: '140px' }} />
              <div className="quick-actions-grid">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} padding="large" shadow="medium" className="quick-action-card">
                    <div className="quick-action-content">
                      <Skeleton className="skeleton-rect" style={{ width: '80px', height: '80px', borderRadius: '16px' }} />
                      <Skeleton className="skeleton-line" style={{ width: '160px' }} />
                      <Skeleton className="skeleton-line" style={{ width: '220px' }} />
                      <Skeleton className="skeleton-line" style={{ width: '120px', marginTop: 'auto' }} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <Skeleton className="skeleton-line" style={{ width: '160px' }} />
                <Skeleton className="skeleton-line" style={{ width: '90px' }} />
              </div>
              <Card padding="none" shadow="medium">
                <div className="activity-list">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="activity-item"
                      style={{
                        borderBottom: index < 2 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <Skeleton className="skeleton-circle" style={{ width: '48px', height: '48px' }} />
                      <div className="activity-content">
                        <Skeleton className="skeleton-line" style={{ width: '180px' }} />
                        <Skeleton className="skeleton-line" style={{ width: '120px', marginTop: '0.5rem' }} />
                      </div>
                      <Skeleton className="skeleton-line" style={{ width: '90px', height: '20px' }} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="dashboard-container">
        <div className="dashboard-wrapper">
          {/* Header */}
          <div className="dashboard-header reveal-on-scroll dramatic-header">
            <div>
              <h1 className="dashboard-title">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="dashboard-subtitle">
                Here's your security overview and recent activity
              </p>
            </div>
          </div>

          {error && (
            <Card padding="large" shadow="small" className="security-notice reveal-on-scroll">
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
            </Card>
          )}

          <StatsGrid stats={stats || {}} />
          <QuickActions actions={quickActions} onAction={(action) => navigate(action.path)} />
          <ActivityList
            activities={recentActivities}
            onViewAll={() => navigate('/audits')}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
          <SecurityNotice />
        </div>
      </div>
  );
};

export default Dashboard;

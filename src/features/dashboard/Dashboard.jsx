import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiFileText, FiLock, FiMessageSquare, FiShield } from 'react-icons/fi';
import { useAuth } from '../../core/auth/AuthContext';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Navbar from '../../shared/components/layout/Navbar';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import '../../styles/features/dashboard.css';

/**
 * Dashboard Component
 * Location: src/features/dashboard/Dashboard.jsx
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
  const [stats, setStats] = useState({
    activePentests: 0,
    completedAudits: 0,
    pendingReports: 0,
    vulnerabilitiesFound: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useScrollReveal('.reveal-on-scroll', {}, [loading]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // TODO: Backend integration - Fetch dashboard data
      // const data = await dashboardService.getDashboardData();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        activePentests: 3,
        completedAudits: 12,
        pendingReports: 2,
        vulnerabilitiesFound: 47
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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

  const recentActivities = [
    {
      id: 1,
      type: 'pentest',
      title: 'Web Application Pentest',
      status: 'in-progress',
      date: '2 days ago',
      icon: FiShield
    },
    {
      id: 2,
      type: 'audit',
      title: 'Security Audit Report',
      status: 'completed',
      date: '5 days ago',
      icon: FiFileText
    },
    {
      id: 3,
      type: 'report',
      title: 'Vulnerability Assessment',
      status: 'pending',
      date: '1 week ago',
      icon: FiAlertTriangle
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
      <>
        <Navbar />
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
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          {/* Header */}
          <div className="dashboard-header reveal-on-scroll">
            <div>
              <h1 className="dashboard-title">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="dashboard-subtitle">
                Here's your security overview and recent activity
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid reveal-on-scroll">
            <Card hover3d={true} padding="large" shadow="medium" className="reveal-on-scroll">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <FiShield size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Active Pentests</p>
                  <h2 className="stat-value">{stats.activePentests}</h2>
                </div>
              </div>
            </Card>

            <Card hover3d={true} padding="large" shadow="medium" className="reveal-on-scroll">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <FiFileText size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Completed Audits</p>
                  <h2 className="stat-value">{stats.completedAudits}</h2>
                </div>
              </div>
            </Card>

            <Card hover3d={true} padding="large" shadow="medium" className="reveal-on-scroll">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <FiFileText size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Pending Reports</p>
                  <h2 className="stat-value">{stats.pendingReports}</h2>
                </div>
              </div>
            </Card>

            <Card hover3d={true} padding="large" shadow="medium" className="reveal-on-scroll">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <FiAlertTriangle size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Vulnerabilities Found</p>
                  <h2 className="stat-value">{stats.vulnerabilitiesFound}</h2>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="section reveal-on-scroll">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  hover3d={true}
                  onClick={() => navigate(action.path)}
                  padding="large"
                  shadow="medium"
                  className="quick-action-card reveal-on-scroll"
                >
                  <div className="quick-action-content">
                    <div
                      className="quick-action-icon"
                      style={{ background: `${action.color}20`, color: action.color }}
                    >
                      <action.icon size={28} />
                    </div>
                    <h3 className="quick-action-title">{action.title}</h3>
                    <p className="quick-action-description">{action.description}</p>
                    <Button variant="card" size="small" style={{ marginTop: 'auto' }}>
                      Get Started →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section reveal-on-scroll">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <button
                onClick={() => navigate('/audits')}
                className="view-all-link"
              >
                View All →
              </button>
            </div>

            <Card padding="none" shadow="medium">
              <div className="activity-list">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="activity-item"
                    style={{
                      borderBottom: index < recentActivities.length - 1
                        ? '1px solid var(--border-color)'
                        : 'none'
                    }}
                  >
                    <div className="activity-icon">
                      <activity.icon size={20} />
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-date">{activity.date}</p>
                    </div>
                    <div className="activity-status">
                      <span
                        className="status-badge"
                        style={{
                          background: `${getStatusColor(activity.status)}20`,
                          color: getStatusColor(activity.status),
                          border: `1px solid ${getStatusColor(activity.status)}50`
                        }}
                      >
                        {getStatusLabel(activity.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Security Notice */}
          <Card padding="large" shadow="small" className="security-notice reveal-on-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <FiLock size={28} />
              <div>
                <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Security Notice
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  All your data is encrypted and stored securely. We never share your information
                  with third parties. For any security concerns, please contact our team immediately.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

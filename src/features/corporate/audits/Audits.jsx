import React, { useState, useEffect } from 'react';
import { FiDownload, FiFileText, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import { downloadAuditReport, getAudits } from './audits.service';
import '../../../styles/features/audits.css';

/**
 * Audits Component
 * Location: src/features/corporate/audits/Audits.jsx
 * 
 * Features:
 * - View security audit reports
 * - Filter and search audits
 * - Download audit reports
 * - View vulnerability details
 * - Track remediation status
 * 
 * TODO: Backend integration for audit data
 */

const Audits = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useScrollReveal('.reveal-on-scroll', {}, [loading, filteredAudits.length]);

  useEffect(() => {
    loadAudits();
  }, []);

  useEffect(() => {
    filterAudits();
  }, [audits, filterStatus, searchQuery]);

  const loadAudits = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAudits();
      if (!response.success) {
        throw new Error(response.error || 'Failed to load audits');
      }
      setAudits(response.data);
    } catch (error) {
      console.error('Failed to load audits:', error);
      setError('Failed to load audits.');
    } finally {
      setLoading(false);
    }
  };

  const filterAudits = () => {
    let filtered = [...audits];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(audit => audit.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(audit =>
        audit.title.toLowerCase().includes(query) ||
        audit.type.toLowerCase().includes(query) ||
        audit.tester.toLowerCase().includes(query)
      );
    }

    setFilteredAudits(filtered);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      case 'info': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-review': return '#f59e0b';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-review': return 'In Review';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const getTotalFindings = (severity) => {
    return Object.values(severity).reduce((sum, count) => sum + count, 0);
  };

  const handleDownloadReport = async (auditId) => {
    const response = await downloadAuditReport(auditId);
    if (!response.success) {
      setError(response.error || 'Failed to download report.');
    }
  };

  const handleViewDetails = (audit) => {
    setSelectedAudit(audit);
  };

  const renderAuditCard = (audit) => (
    <Card key={audit.id} hover3d={true} padding="large" shadow="medium">
      <div className="audit-card">
        {/* Header */}
        <div className="audit-header">
          <div className="audit-title-section">
            <h3 className="audit-title">{audit.title}</h3>
            <div className="audit-meta">
              <span className="audit-type">{audit.type}</span>
              <span className="audit-date">{getRelativeTime(audit.date)}</span>
            </div>
          </div>
          <span
            className="status-badge"
            style={{
              background: `${getStatusColor(audit.status)}20`,
              color: getStatusColor(audit.status),
              border: `1px solid ${getStatusColor(audit.status)}50`
            }}
          >
            {getStatusLabel(audit.status)}
          </span>
        </div>

        {/* Severity Summary */}
        <div className="severity-summary">
          <h4 className="summary-title">Findings by Severity</h4>
          <div className="severity-grid">
            {Object.entries(audit.severity).map(([level, count]) => (
              <div key={level} className="severity-item">
                <div
                  className="severity-badge"
                  style={{
                    background: `${getSeverityColor(level)}20`,
                    color: getSeverityColor(level),
                    border: `1px solid ${getSeverityColor(level)}50`
                  }}
                >
                  <span className="severity-count">{count}</span>
                  <span className="severity-label">{level}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total-findings">
            Total: {getTotalFindings(audit.severity)} findings
          </div>
        </div>

        {/* Remediation Progress */}
        {audit.status === 'completed' && (
          <div className="remediation-section">
            <div className="remediation-header">
              <span className="remediation-label">Remediation Progress</span>
              <span className="remediation-percentage">{audit.remediationProgress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${audit.remediationProgress}%`,
                  background: audit.remediationProgress === 100 ? '#10b981' : '#f59e0b'
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="audit-footer">
          <div className="audit-tester">
            <span className="tester-label">Assessed by:</span>
            <span className="tester-name">{audit.tester}</span>
          </div>
          <div className="audit-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleViewDetails(audit)}
            >
              View Details
            </Button>
            {audit.reportAvailable && (
              <Button
                variant="primary"
                size="small"
                onClick={() => handleDownloadReport(audit.id)}
              >
                <FiDownload size={16} />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="audits-container">
          <div className="audits-wrapper">
            <div className="page-header">
              <Skeleton className="skeleton-line" style={{ width: '220px' }} />
              <Skeleton className="skeleton-line" style={{ width: '320px', marginTop: '0.75rem' }} />
            </div>

            <Card padding="medium" shadow="small">
              <div className="filters-section">
                <div className="search-box">
                  <Skeleton className="skeleton-rect" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
                </div>
                <div className="filter-group">
                  <Skeleton className="skeleton-line" style={{ width: '70px' }} />
                  <div className="filter-buttons" style={{ gap: '0.5rem' }}>
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="skeleton-rect" style={{ width: '90px', height: '36px', borderRadius: '8px' }} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="audits-grid">
              {[...Array(3)].map((_, index) => (
                <Card key={index} padding="large" shadow="medium">
                  <div className="audit-card">
                    <div className="audit-header">
                      <Skeleton className="skeleton-line" style={{ width: '200px' }} />
                      <Skeleton className="skeleton-line" style={{ width: '80px', height: '20px' }} />
                    </div>
                    <div className="audit-meta" style={{ marginTop: '1rem' }}>
                      <Skeleton className="skeleton-line" style={{ width: '160px' }} />
                      <Skeleton className="skeleton-line" style={{ width: '120px' }} />
                    </div>
                    <div className="audit-summary" style={{ marginTop: '1.5rem' }}>
                      <Skeleton className="skeleton-line" style={{ width: '100%' }} />
                      <Skeleton className="skeleton-line" style={{ width: '80%', marginTop: '0.5rem' }} />
                    </div>
                    <div className="audit-footer" style={{ marginTop: '1.5rem' }}>
                      <Skeleton className="skeleton-line" style={{ width: '140px' }} />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Skeleton className="skeleton-rect" style={{ width: '110px', height: '36px', borderRadius: '8px' }} />
                        <Skeleton className="skeleton-rect" style={{ width: '110px', height: '36px', borderRadius: '8px' }} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="audits-container">
        <div className="audits-wrapper">
          {/* Header */}
          <div className="page-header reveal-on-scroll">
            <div>
              <h1 className="page-title">Security Audits</h1>
              <p className="page-subtitle">
                View and manage security audit reports and vulnerability assessments
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <Card padding="medium" shadow="small" className="reveal-on-scroll">
            <div className="filters-section">
              {/* Search */}
              <div className="search-box">
                <span className="search-icon">
                  <FiSearch size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search audits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <label className="filter-label">Status:</label>
                <div className="filter-buttons">
                  <button
                    className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-button ${filterStatus === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`filter-button ${filterStatus === 'in-review' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('in-review')}
                  >
                    In Review
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Count */}
          <div className="results-info reveal-on-scroll">
            <p>
              Showing <strong>{filteredAudits.length}</strong> of <strong>{audits.length}</strong> audits
            </p>
          </div>

          {error && (
            <Card padding="medium" shadow="small" className="reveal-on-scroll">
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
            </Card>
          )}

          {/* Audits Grid */}
          {filteredAudits.length === 0 ? (
            <Card padding="large" className="reveal-on-scroll">
              <div className="empty-state">
                <span style={{ fontSize: '3rem', display: 'inline-flex' }}>
                  <FiFileText size={40} />
                </span>
                <h3>No audits found</h3>
                <p>
                  {searchQuery
                    ? 'Try adjusting your search query or filters.'
                    : 'No security audits available at the moment.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="audits-grid reveal-on-scroll">
              {filteredAudits.map(audit => renderAuditCard(audit))}
            </div>
          )}
        </div>
      </div>
  );
};

export default Audits;

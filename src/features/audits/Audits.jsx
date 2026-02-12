import React, { useState, useEffect } from 'react';
import { FiDownload, FiFileText, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../core/auth/AuthContext';
import Navbar from '../../shared/components/layout/Navbar';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import '../../styles/features/audits.css';

/**
 * Audits Component
 * Location: src/features/audits/Audits.jsx
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

  useEffect(() => {
    loadAudits();
  }, []);

  useEffect(() => {
    filterAudits();
  }, [audits, filterStatus, searchQuery]);

  const loadAudits = async () => {
    setLoading(true);

    try {
      // TODO: Backend integration
      // const response = await auditService.getAudits();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockAudits = [
        {
          id: '1',
          title: 'Q4 2024 Security Assessment',
          type: 'Web Application',
          date: Date.now() - (5 * 24 * 60 * 60 * 1000),
          status: 'completed',
          severity: {
            critical: 2,
            high: 5,
            medium: 12,
            low: 8,
            info: 15
          },
          remediationProgress: 65,
          tester: 'Security Team A',
          reportAvailable: true
        },
        {
          id: '2',
          title: 'Network Infrastructure Audit',
          type: 'Network',
          date: Date.now() - (15 * 24 * 60 * 60 * 1000),
          status: 'in-review',
          severity: {
            critical: 0,
            high: 3,
            medium: 7,
            low: 5,
            info: 10
          },
          remediationProgress: 40,
          tester: 'Security Team B',
          reportAvailable: false
        },
        {
          id: '3',
          title: 'Mobile App Security Scan',
          type: 'Mobile Application',
          date: Date.now() - (30 * 24 * 60 * 60 * 1000),
          status: 'completed',
          severity: {
            critical: 1,
            high: 4,
            medium: 9,
            low: 11,
            info: 20
          },
          remediationProgress: 100,
          tester: 'Security Team C',
          reportAvailable: true
        },
        {
          id: '4',
          title: 'API Security Assessment',
          type: 'API',
          date: Date.now() - (45 * 24 * 60 * 60 * 1000),
          status: 'completed',
          severity: {
            critical: 0,
            high: 2,
            medium: 6,
            low: 8,
            info: 12
          },
          remediationProgress: 85,
          tester: 'Security Team A',
          reportAvailable: true
        }
      ];

      setAudits(mockAudits);
    } catch (error) {
      console.error('Failed to load audits:', error);
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

  const handleDownloadReport = (auditId) => {
    // TODO: Backend integration - Download report
    console.log('Downloading report for audit:', auditId);
    alert('Download functionality will be implemented with backend integration');
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
      <>
        <Navbar />
        <div className="audits-container">
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading audits...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="audits-container">
        <div className="audits-wrapper">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Security Audits</h1>
              <p className="page-subtitle">
                View and manage security audit reports and vulnerability assessments
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <Card padding="medium" shadow="small">
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
          <div className="results-info">
            <p>
              Showing <strong>{filteredAudits.length}</strong> of <strong>{audits.length}</strong> audits
            </p>
          </div>

          {/* Audits Grid */}
          {filteredAudits.length === 0 ? (
            <Card padding="large">
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
            <div className="audits-grid">
              {filteredAudits.map(audit => renderAuditCard(audit))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Audits;

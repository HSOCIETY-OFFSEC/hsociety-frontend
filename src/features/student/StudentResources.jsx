import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiExternalLink, FiInfo, FiLayers, FiShield } from 'react-icons/fi';
import { getFreeResources } from './services/learn.service';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';
import '../../styles/student/pages/resources.css';

const StudentResources = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState('We do not have free resources yet.');

  useEffect(() => {
    let mounted = true;
    const loadResources = async () => {
      setLoading(true);
      const response = await getFreeResources();
      if (!mounted) return;
      if (!response.success) {
        setError(getPublicErrorMessage({ action: 'load', response }));
      } else {
        setResources(Array.isArray(response.data?.items) ? response.data.items : []);
        if (response.data?.message) {
          setMessage(response.data.message);
        }
      }
      setLoading(false);
    };

    loadResources();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="sr-page">
      <header className="sr-page-header">
        <div className="sr-page-header-inner">
          <div className="sr-header-left">
            <div className="sr-header-icon-wrap">
              <FiBookOpen size={20} className="sr-header-icon" />
            </div>
            <div>
              <div className="sr-header-breadcrumb">
                <span className="sr-breadcrumb-org">HSOCIETY</span>
                <span className="sr-breadcrumb-sep">/</span>
                <span className="sr-breadcrumb-page">student-resources</span>
                <span className="sr-header-visibility">Public</span>
              </div>
              <p className="sr-header-desc">
                Admin-managed public materials outside paid bootcamp access.
              </p>
            </div>
          </div>
        </div>
        <div className="sr-header-meta">
          <span className="sr-meta-pill">
            <FiLayers size={13} className="sr-meta-icon" />
            <span className="sr-meta-label">Resources</span>
            <strong className="sr-meta-value">{resources.length}</strong>
          </span>
          <span className="sr-meta-pill">
            <FiShield size={13} className="sr-meta-icon" />
            <span className="sr-meta-label">Status</span>
            <strong className="sr-meta-value">OPEN</strong>
          </span>
        </div>
      </header>

      <div className="sr-layout">
        <main className="sr-main">
          <section className="sr-section">
            <h2 className="sr-section-title">
              <FiBookOpen size={15} className="sr-section-icon" />
              Resource Library
            </h2>
            <p className="sr-section-desc">Browse curated, free materials approved by the HSOCIETY team.</p>

            {error && (
              <div className="sr-panel sr-alert">
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="sr-panel">
                <p>Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="sr-panel">
                <div className="sr-panel-header">
                  <FiInfo size={18} />
                  <h3>No free resources yet</h3>
                </div>
                <p>{message}</p>
              </div>
            ) : (
              <div className="sr-item-list">
                {resources.map((resource) => (
                  <article key={resource.id} className="sr-item-row">
                    <div className="sr-item-main">
                      <span className="sr-item-title">{resource.title}</span>
                      <span className="sr-item-subtitle">
                        {resource.description || 'Free learning resource'}
                      </span>
                    </div>
                    <div className="sr-item-meta">
                      <button
                        type="button"
                        className="sr-btn sr-btn-secondary"
                        onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                        disabled={!resource.url}
                      >
                        <FiExternalLink size={14} />
                        Open
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="sr-sidebar">
          <div className="sr-sidebar-box">
            <h3 className="sr-sidebar-heading">About</h3>
            <p className="sr-sidebar-about">
              Free resources are updated as new tools, guides, and checklists become available.
            </p>
            <div className="sr-sidebar-divider" />
            <ul className="sr-sidebar-list">
              <li>Curated playbooks</li>
              <li>Tooling references</li>
              <li>Quick-start guides</li>
            </ul>
          </div>

          <div className="sr-sidebar-box sr-status-box">
            <div className="sr-status-row">
              <span className="sr-status-dot" />
              <span className="sr-status-label">RESOURCE STATUS</span>
            </div>
            <strong className="sr-status-value">ACTIVE</strong>
            <div className="sr-status-track"><div className="sr-status-fill" /></div>
            <p className="sr-status-note">Updated weekly.</p>
          </div>

          <div className="sr-sidebar-box">
            <h3 className="sr-sidebar-heading">Topics</h3>
            <div className="sr-topics">
              <span className="sr-topic">resources</span>
              <span className="sr-topic">guides</span>
              <span className="sr-topic">playbooks</span>
              <span className="sr-topic">tools</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentResources;

import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiCheckCircle, FiLayers, FiTool, FiDownload, FiInfo } from 'react-icons/fi';
import BootcampAccessGate from '../../components/bootcamp/BootcampAccessGate';
import { getBootcampResources } from '../../services/learn.service';

const BootcampResources = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const response = await getBootcampResources();
      if (!mounted) return;
      if (response.success) {
        setItems(response.data?.items || []);
      } else {
        setError(response.error || 'Unable to load resources.');
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <BootcampAccessGate>
      <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiBookOpen size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">bootcamp-resources</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">Guides, tools, and playbooks supporting each room.</p>
              </div>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiLayers size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Libraries</span>
              <strong className="bc-meta-value">{items.length}</strong>
            </span>
            <span className="bc-meta-pill">
              <FiTool size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Tooling</span>
              <strong className="bc-meta-value">Curated</strong>
            </span>
          </div>
        </header>

        <div className="bc-layout">
          <main className="bc-main">
            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiBookOpen size={15} className="bc-section-icon" />
                Resource Library
              </h2>
              <p className="bc-section-desc">Downloadable guides and playbooks aligned to each phase.</p>
              {loading && (
                <div className="bc-panel">
                  <p>Loading bootcamp resources...</p>
                </div>
              )}
              {error && !loading && (
                <div className="bc-panel bc-alert">
                  <FiInfo size={16} />
                  <p>{error}</p>
                </div>
              )}
              {!loading && !error && items.length === 0 && (
                <div className="bc-panel">
                  <p>No bootcamp resources available yet.</p>
                </div>
              )}
              {!loading && !error && items.length > 0 && (
                <div className="bc-item-list">
                  {items.map((module) => (
                    <article key={module.id} className="bc-item-row">
                      <div className="bc-item-main">
                        <span className="bc-item-title">
                          Module {module.moduleId || '—'} {module.moduleTitle ? `· ${module.moduleTitle}` : ''}
                        </span>
                        <span className="bc-item-subtitle">
                          {(module.resources || []).length} downloadable resources
                        </span>
                      </div>
                      <div className="bc-item-meta">
                        {(module.resources || []).map((resource) => (
                          <button
                            key={resource.url || resource.title}
                            type="button"
                            className="bc-btn bc-btn-secondary"
                            onClick={() => resource.url && window.open(resource.url, '_blank', 'noopener,noreferrer')}
                            disabled={!resource.url}
                          >
                            <FiDownload size={14} />
                            {resource.title || 'Download'}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </BootcampAccessGate>
  );
};

export default BootcampResources;

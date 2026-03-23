import React, { useEffect, useMemo, useState } from 'react';
import { FiBookOpen, FiLayers, FiTool, FiDownload, FiInfo } from 'react-icons/fi';
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

  const grouped = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const moduleKey = Number(item.moduleId || 0);
      const existing = map.get(moduleKey) || {
        moduleId: moduleKey,
        moduleTitle: item.moduleTitle || '',
        moduleResources: [],
        rooms: [],
      };
      if (item.roomId) {
        existing.rooms.push({
          roomId: Number(item.roomId || 0),
          roomTitle: item.roomTitle || '',
          resources: item.resources || [],
        });
      } else {
        existing.moduleResources = item.resources || [];
      }
      map.set(moduleKey, existing);
    });
    return Array.from(map.values()).sort((a, b) => a.moduleId - b.moduleId);
  }, [items]);

  return (
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
                <div className="bc-card-grid">
                  {grouped.map((module) => (
                    <article key={`module-${module.moduleId}`} className="bc-card">
                      <div className="bc-card-header">
                        <div>
                          <p className="bc-card-kicker">Phase {module.moduleId || '—'}</p>
                          <h3 className="bc-card-title">
                            {module.moduleTitle || `Module ${module.moduleId || '—'}`}
                          </h3>
                          <p className="bc-card-subtitle">
                            {(module.moduleResources || []).length + (module.rooms || []).reduce((sum, room) => sum + (room.resources || []).length, 0)}
                            {' '}downloads
                          </p>
                        </div>
                        <FiDownload size={18} />
                      </div>

                      {(module.moduleResources || []).length > 0 && (
                        <div className="bc-card-actions">
                          {module.moduleResources.map((resource) => (
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
                      )}

                      {(module.rooms || []).length > 0 && (
                        <div className="bc-card-stack">
                          {(module.rooms || []).map((room) => (
                            <div key={`room-${module.moduleId}-${room.roomId}`} className="bc-subcard">
                              <div className="bc-subcard-header">
                                <div>
                                  <p className="bc-card-kicker">Room {room.roomId || '—'}</p>
                                  <h4 className="bc-subcard-title">{room.roomTitle || 'Room resources'}</h4>
                                </div>
                              </div>
                              <div className="bc-card-actions">
                                {(room.resources || []).map((resource) => (
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
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampResources;

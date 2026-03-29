import React, { useEffect, useMemo, useState } from 'react';
import { FiBookOpen, FiLayers, FiTool, FiDownload, FiInfo } from 'react-icons/fi';
import { getBootcampResources } from '../../services/learn.service';

const BootcampResources = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const headerClassName = 'mb-6 flex flex-col gap-4';
  const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
  const headerLeftClassName = 'flex items-center gap-4';
  const iconWrapClassName = 'flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-bg-secondary text-brand';
  const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
  const breadcrumbStrongClassName = 'font-semibold text-text-secondary';
  const visibilityClassName =
    'rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary';
  const headerDescClassName = 'mt-1 text-sm text-text-secondary';
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const sectionClassName = 'flex flex-col gap-4';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';
  const cardGridClassName = 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3';
  const cardClassName = 'flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm';
  const cardHeaderClassName = 'flex items-start justify-between gap-4';
  const cardKickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const cardTitleClassName = 'text-base font-semibold text-text-primary';
  const cardSubtitleClassName = 'text-sm text-text-secondary';
  const buttonSecondaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-bg-tertiary disabled:opacity-60';
  const subcardClassName = 'rounded-lg border border-dashed border-border bg-bg-tertiary p-4';

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
    <div className={pageClassName}>
        <header className={headerClassName}>
          <div className={headerInnerClassName}>
            <div className={headerLeftClassName}>
              <div className={iconWrapClassName}>
                <FiBookOpen size={20} />
              </div>
              <div>
                <div className={breadcrumbClassName}>
                  <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                  <span>/</span>
                  <span className={breadcrumbStrongClassName}>bootcamp-resources</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>Guides, tools, and playbooks supporting each room.</p>
              </div>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiLayers size={13} className="text-text-tertiary" />
              <span>Libraries</span>
              <strong className={metaValueClassName}>{items.length}</strong>
            </span>
            <span className={metaPillClassName}>
              <FiTool size={13} className="text-text-tertiary" />
              <span>Tooling</span>
              <strong className={metaValueClassName}>Curated</strong>
            </span>
          </div>
        </header>

        <div className="grid gap-6">
          <main>
            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiBookOpen size={15} className="mr-2 inline-block text-brand" />
                Resource Library
              </h2>
              <p className={sectionDescClassName}>Downloadable guides and playbooks aligned to each phase.</p>
              {loading && (
                <div className={panelClassName}>
                  <p>Loading bootcamp resources...</p>
                </div>
              )}
              {error && !loading && (
                <div className={panelClassName}>
                  <div className="flex items-start gap-2">
                    <FiInfo size={16} className="text-text-tertiary" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              {!loading && !error && items.length === 0 && (
                <div className={panelClassName}>
                  <p>No bootcamp resources available yet.</p>
                </div>
              )}
              {!loading && !error && items.length > 0 && (
                <div className={cardGridClassName}>
                  {grouped.map((module) => (
                    <article key={`module-${module.moduleId}`} className={cardClassName}>
                      <div className={cardHeaderClassName}>
                        <div>
                          <p className={cardKickerClassName}>Phase {module.moduleId || '—'}</p>
                          <h3 className={cardTitleClassName}>
                            {module.moduleTitle || `Module ${module.moduleId || '—'}`}
                          </h3>
                          <p className={cardSubtitleClassName}>
                            {(module.moduleResources || []).length + (module.rooms || []).reduce((sum, room) => sum + (room.resources || []).length, 0)}
                            {' '}downloads
                          </p>
                        </div>
                        <FiDownload size={18} />
                      </div>

                      {(module.moduleResources || []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {module.moduleResources.map((resource) => (
                            <button
                              key={resource.url || resource.title}
                              type="button"
                              className={buttonSecondaryClassName}
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
                        <div className="grid gap-3">
                          {(module.rooms || []).map((room) => (
                            <div key={`room-${module.moduleId}-${room.roomId}`} className={subcardClassName}>
                              <div>
                                <div>
                                  <p className={cardKickerClassName}>Room {room.roomId || '—'}</p>
                                  <h4 className="text-sm font-semibold text-text-primary">{room.roomTitle || 'Room resources'}</h4>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(room.resources || []).map((resource) => (
                                  <button
                                    key={resource.url || resource.title}
                                    type="button"
                                    className={buttonSecondaryClassName}
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

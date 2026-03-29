import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiExternalLink, FiInfo, FiLayers, FiShield } from 'react-icons/fi';
import { getFreeResources } from '../services/learn.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

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
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';
  const panelHeaderClassName = 'flex items-center gap-3 text-sm font-semibold text-text-primary';
  const listClassName = 'overflow-hidden rounded-sm border border-border';
  const rowClassName =
    'flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-3 text-sm transition hover:bg-bg-tertiary sm:flex-row sm:items-center sm:justify-between';
  const rowTitleClassName = 'text-sm font-semibold text-text-primary';
  const rowSubtitleClassName = 'text-sm text-text-secondary';
  const buttonClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-bg-tertiary disabled:opacity-60';

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
                <span className={breadcrumbStrongClassName}>student-resources</span>
                <span className={visibilityClassName}>Public</span>
              </div>
              <p className={headerDescClassName}>
                Admin-managed public materials outside paid bootcamp access.
              </p>
            </div>
          </div>
        </div>
        <div className={metaRowClassName}>
          <span className={metaPillClassName}>
            <FiLayers size={13} className="text-text-tertiary" />
            <span>Resources</span>
            <strong className={metaValueClassName}>{resources.length}</strong>
          </span>
          <span className={metaPillClassName}>
            <FiShield size={13} className="text-text-tertiary" />
            <span>Status</span>
            <strong className={metaValueClassName}>OPEN</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        <main>
          <section className="flex flex-col gap-4">
            <h2 className={sectionTitleClassName}>
              <FiBookOpen size={15} className="mr-2 inline-block text-brand" />
              Resource Library
            </h2>
            <p className={sectionDescClassName}>Browse curated, free materials approved by the HSOCIETY team.</p>

            {error && (
              <div className={panelClassName}>
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className={panelClassName}>
                <p>Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className={panelClassName}>
                <div className={panelHeaderClassName}>
                  <FiInfo size={18} className="text-text-tertiary" />
                  <h3>No free resources yet</h3>
                </div>
                <p>{message}</p>
              </div>
            ) : (
              <div className={listClassName}>
                {resources.map((resource) => (
                  <article key={resource.id} className={rowClassName}>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className={rowTitleClassName}>{resource.title}</span>
                      <span className={rowSubtitleClassName}>
                        {resource.description || 'Free learning resource'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={buttonClassName}
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
      </div>
    </div>
  );
};

export default StudentResources;

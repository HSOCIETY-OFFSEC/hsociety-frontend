import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiDownloadCloud } from 'react-icons/fi';
import { getPublicFreeResources, getPublicProducts } from '../services/marketplace.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';

const MarketplacePublic = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesMessage, setResourcesMessage] = useState('We do not have free resources yet.');
  const [error, setError] = useState('');
  const [resourcesError, setResourcesError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [productsRes, resourcesRes] = await Promise.all([
        getPublicProducts(),
        getPublicFreeResources(),
      ]);
      if (!mounted) return;
      if (!productsRes.success) {
        setError(getPublicErrorMessage({ action: 'load', response: productsRes }));
      } else {
        setProducts(Array.isArray(productsRes.data?.items) ? productsRes.data.items : []);
      }
      if (!resourcesRes.success) {
        setResourcesError(getPublicErrorMessage({ action: 'load', response: resourcesRes }));
      } else {
        setResources(Array.isArray(resourcesRes.data?.items) ? resourcesRes.data.items : []);
        setResourcesMessage(resourcesRes.data?.message || 'We do not have free resources yet.');
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.documentElement.classList.add('marketplace-public');
    return () => document.documentElement.classList.remove('marketplace-public');
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary px-6 pb-12 pt-10 [background-image:linear-gradient(180deg,color-mix(in_srgb,var(--bg-primary)_92%,transparent),var(--bg-primary)),var(--landing-brand-image)] bg-no-repeat [background-position:center_top,center_top] [background-size:cover,min(1100px,82vw)_auto]">
      <section className="reveal-on-scroll">
        <div className="section-container">
          <div className="rounded-[20px] border border-border bg-bg-secondary p-8 shadow-lg">
            <p className="mb-3 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-text-tertiary">
              <span className="eyebrow-dot" />
              ZeroDay Market
            </p>
            <h1 className="text-[clamp(2rem,4vw,2.6rem)] font-semibold tracking-[-0.03em] text-text-primary">
              Welcome to the ZeroDay Market.
            </h1>
            <p className="mt-4 max-w-[720px] text-[1.02rem] text-text-secondary">
              CP Points unlock exclusive books and playbooks. Earn CP inside HSOCIETY,
              then redeem in ZeroDay Market.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary" aria-label="CP Coins">
              <img src={cpIcon} alt="CP" className="h-4 w-4" />
              <span>CP Coins</span>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll py-[clamp(3rem,7vw,5.5rem)]">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Available Products
            </p>
            <h2 className="section-title">CP-priced books.</h2>
          </div>

          {error && <p className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--status-danger)_8%,transparent)] px-4 py-3 text-sm text-status-danger">{error}</p>}

          {loading ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-8 text-center text-text-secondary">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-8 text-center text-text-secondary">
              <FiBookOpen size={18} />
              <p>No CP products yet. New drops land soon.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {products.map((product) => (
                <article key={product._id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-md">
                  {product.coverUrl ? (
                    <img src={product.coverUrl} alt={product.title} className="h-[180px] w-full object-cover" />
                  ) : (
                    <div className="flex h-[180px] items-center justify-center bg-bg-tertiary text-sm font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                      CP
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-base font-semibold text-text-primary">{product.title}</h3>
                    <p className="text-sm text-text-secondary">{product.description || 'ZeroDay Market item'}</p>
                    <span className="mt-auto inline-flex items-center gap-2 font-semibold text-brand">
                      <img src={cpIcon} alt="CP" className="h-8 w-8 p-1" />
                      {product.cpPrice} CP
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="reveal-on-scroll py-[clamp(3rem,7vw,5.5rem)]">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Free Resources
            </p>
            <h2 className="section-title">Download at zero CP.</h2>
          </div>

          {resourcesError && <p className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--status-danger)_8%,transparent)] px-4 py-3 text-sm text-status-danger">{resourcesError}</p>}

          {loading ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-8 text-center text-text-secondary">
              Loading free resources...
            </div>
          ) : resources.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-8 text-center text-text-secondary">
              <FiDownloadCloud size={18} />
              <p>{resourcesMessage}</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {resources.map((resource) => (
                <article key={resource.id || resource.url} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-md">
                  <div className="flex h-[180px] items-center justify-center bg-bg-tertiary text-sm font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                    FREE
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-base font-semibold text-text-primary">{resource.title || 'Free resource'}</h3>
                    <p className="text-sm text-text-secondary">{resource.description || 'Downloadable resource.'}</p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 font-semibold text-brand">
                        <img src={cpIcon} alt="CP" className="h-8 w-8 p-1" />
                        0 CP
                      </span>
                      {resource.url ? (
                        <a
                          className="inline-flex items-center gap-2 rounded-md border border-[color-mix(in_srgb,var(--primary-color)_40%,var(--border-color))] bg-[color-mix(in_srgb,var(--primary-color)_12%,var(--bg-secondary))] px-3 py-2 text-sm text-brand"
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FiDownloadCloud size={14} />
                          Download
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-md border border-[color-mix(in_srgb,var(--primary-color)_40%,var(--border-color))] bg-[color-mix(in_srgb,var(--primary-color)_12%,var(--bg-secondary))] px-3 py-2 text-sm text-brand opacity-60">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MarketplacePublic;

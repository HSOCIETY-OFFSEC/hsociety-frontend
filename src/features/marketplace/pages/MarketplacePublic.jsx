import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiDownloadCloud } from 'react-icons/fi';
import { getPublicFreeResources, getPublicProducts } from '../services/marketplace.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import {
  publicCard,
  publicCardDesc,
  publicCardMeta,
  publicCardTitle,
  publicChip,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroKicker,
  publicHeroSection,
  publicHeroTitle,
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

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
    <div className={`${publicPage} text-text-primary`}>
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              ZeroDay Market
            </p>
            <h1 className={publicHeroTitle}>Welcome to the ZeroDay Market.</h1>
            <p className={publicHeroDesc}>
              CP Points unlock exclusive books and playbooks. Earn CP inside HSOCIETY, then redeem in ZeroDay Market.
            </p>
            <div className={publicCardMeta}>
              <span className={publicChip}>
                <img src={cpIcon} alt="CP" className="h-3.5 w-3.5" />
                CP Coins
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={`reveal-on-scroll ${publicSection}`}>
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
                <article
                  key={product._id}
                  className={publicCard}
                  style={{
                    '--card-media': product.coverUrl
                      ? `url(${product.coverUrl})`
                      : 'linear-gradient(120deg, rgba(31,191,143,0.22), rgba(0,0,0,0.6))',
                  }}
                >
                  <div className={publicCardMeta}>
                    <span className={publicChip}>CP drop</span>
                  </div>
                  <h3 className={publicCardTitle}>{product.title}</h3>
                  <p className={publicCardDesc}>{product.description || 'ZeroDay Market item'}</p>
                  <span className="mt-auto inline-flex items-center gap-2 font-semibold text-brand">
                    <img src={cpIcon} alt="CP" className="h-6 w-6 p-1" />
                    {product.cpPrice} CP
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={`reveal-on-scroll ${publicSection}`}>
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
                <article
                  key={resource.id || resource.url}
                  className={publicCard}
                  style={{
                    '--card-media': 'linear-gradient(120deg, rgba(31,191,143,0.2), rgba(0,0,0,0.7))',
                  }}
                >
                  <div className={publicCardMeta}>
                    <span className={publicChip}>Free drop</span>
                  </div>
                  <h3 className={publicCardTitle}>{resource.title || 'Free resource'}</h3>
                  <p className={publicCardDesc}>{resource.description || 'Downloadable resource.'}</p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 font-semibold text-brand">
                      <img src={cpIcon} alt="CP" className="h-6 w-6 p-1" />
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

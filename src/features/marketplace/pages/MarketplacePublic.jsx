import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiDownloadCloud } from 'react-icons/fi';
import { getPublicFreeResources, getPublicProducts } from '../services/marketplace.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import '../../public/styles/public-landing.css';
import '../styles/marketplace.css';

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
    <div className="public-page public-page-inner marketplace-page">
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              ZeroDay Market
            </p>
            <h1 className="public-hero-title">Welcome to the ZeroDay Market.</h1>
            <p className="public-hero-desc">
              CP Points unlock exclusive books and playbooks. Earn CP inside HSOCIETY,
              then redeem in ZeroDay Market.
            </p>
            <div className="marketplace-hero-chip" aria-label="CP Coins">
              <img src={cpIcon} alt="CP" />
              <span>CP Coins</span>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Available Products
            </p>
            <h2 className="section-title">CP-priced books.</h2>
          </div>

          {error && <p className="marketplace-error">{error}</p>}

          {loading ? (
            <div className="marketplace-empty">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="marketplace-empty">
              <FiBookOpen size={18} />
              <p>No CP products yet. New drops land soon.</p>
            </div>
          ) : (
            <div className="marketplace-grid">
              {products.map((product) => (
                <article key={product._id} className="marketplace-card">
                  {product.coverUrl ? (
                    <img src={product.coverUrl} alt={product.title} />
                  ) : (
                    <div className="marketplace-cover">CP</div>
                  )}
                  <div className="marketplace-card-body">
                    <h3>{product.title}</h3>
                    <p>{product.description || 'ZeroDay Market item'}</p>
                    <span className="marketplace-price">
                      <img src={cpIcon} alt="CP" className="marketplace-cp-icon" />
                      {product.cpPrice} CP
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Free Resources
            </p>
            <h2 className="section-title">Download at zero CP.</h2>
          </div>

          {resourcesError && <p className="marketplace-error">{resourcesError}</p>}

          {loading ? (
            <div className="marketplace-empty">Loading free resources...</div>
          ) : resources.length === 0 ? (
            <div className="marketplace-empty">
              <FiDownloadCloud size={18} />
              <p>{resourcesMessage}</p>
            </div>
          ) : (
            <div className="marketplace-grid">
              {resources.map((resource) => (
                <article key={resource.id || resource.url} className="marketplace-card">
                  <div className="marketplace-cover">FREE</div>
                  <div className="marketplace-card-body">
                    <h3>{resource.title || 'Free resource'}</h3>
                    <p>{resource.description || 'Downloadable resource.'}</p>
                    <div className="marketplace-card-footer">
                      <span className="marketplace-price">
                        <img src={cpIcon} alt="CP" className="marketplace-cp-icon" />
                        0 CP
                      </span>
                      {resource.url ? (
                        <a
                          className="marketplace-download"
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FiDownloadCloud size={14} />
                          Download
                        </a>
                      ) : (
                        <span className="marketplace-download is-disabled">Unavailable</span>
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

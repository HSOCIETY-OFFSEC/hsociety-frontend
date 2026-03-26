import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiDownloadCloud, FiShoppingBag } from 'react-icons/fi';
import { getPublicFreeResources, getPublicProducts, purchaseProduct } from '../services/marketplace.service';
import { getCpBalance } from '../../cp-wallet/services/cp.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PageLoader from '../../../shared/components/ui/PageLoader';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import '../styles/marketplace.css';

const Marketplace = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesMessage, setResourcesMessage] = useState('We do not have free resources yet.');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [resourcesError, setResourcesError] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    const [productsRes, balanceRes, resourcesRes] = await Promise.all([
      getPublicProducts(),
      getCpBalance(),
      getPublicFreeResources(),
    ]);

    if (!productsRes.success) {
      setError(getPublicErrorMessage({ action: 'load', response: productsRes }));
    } else {
      setProducts(Array.isArray(productsRes.data?.items) ? productsRes.data.items : []);
    }

    if (balanceRes.success) {
      setBalance(Number(balanceRes.data?.balance || 0));
    }

    if (!resourcesRes.success) {
      setResourcesError(getPublicErrorMessage({ action: 'load', response: resourcesRes }));
    } else {
      setResources(Array.isArray(resourcesRes.data?.items) ? resourcesRes.data.items : []);
      setResourcesMessage(resourcesRes.data?.message || 'We do not have free resources yet.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handlePurchase = async (productId) => {
    setStatus('');
    setError('');
    const response = await purchaseProduct(productId);
    if (!response.success) {
      setError(getPublicErrorMessage({ action: 'submit', response }));
      return;
    }
    setBalance(Number(response.data?.balance || 0));
    setStatus('Redeemed successfully.');
  };

  if (loading) return <PageLoader message="Loading marketplace..." durationMs={0} />;

  return (
    <div className="marketplace-page">
      <header className="marketplace-hero">
        <div>
          <p className="marketplace-kicker">ZeroDay Market</p>
          <h1>Welcome to the ZeroDay Market.</h1>
          <p>CP Points are your currency. Redeem them for books curated by HSOCIETY.</p>
        </div>
        <div className="marketplace-balance">
          <span>Your balance</span>
          <strong className="marketplace-balance-value">
            <img src={cpIcon} alt="CP" className="marketplace-cp-icon" />
            {balance.toLocaleString()} CP
          </strong>
        </div>
      </header>

      {status && <div className="marketplace-status">{status}</div>}
      {error && <div className="marketplace-error">{error}</div>}

      <section className="marketplace-section">
        <div className="marketplace-section-header">
          <p className="marketplace-section-kicker">CP Books</p>
          <h2>Redeem your CP for premium titles.</h2>
        </div>

        {products.length === 0 ? (
          <div className="marketplace-empty">
            <FiBookOpen size={18} />
            <p>No CP products yet. Check back soon for drops.</p>
          </div>
        ) : (
          <div className="marketplace-grid">
            {products.map((product) => {
              const price = Number(product.cpPrice || 0);
              const canBuy = balance >= price;
              return (
                <article key={product._id} className="marketplace-card">
                  {product.coverUrl ? (
                    <img src={product.coverUrl} alt={product.title} />
                  ) : (
                    <div className="marketplace-cover">CP</div>
                  )}
                  <div className="marketplace-card-body">
                    <h3>{product.title}</h3>
                  <p>{product.description || 'ZeroDay Market item'}</p>
                    <div className="marketplace-card-footer">
                    <span className="marketplace-price">
                      <img src={cpIcon} alt="CP" className="marketplace-cp-icon" />
                      {price} CP
                    </span>
                      <button
                        type="button"
                        className="marketplace-buy"
                        onClick={() => handlePurchase(product._id)}
                        disabled={!canBuy}
                      >
                        <FiShoppingBag size={14} />
                        {canBuy ? 'Redeem' : 'Insufficient CP'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="marketplace-section">
        <div className="marketplace-section-header">
          <p className="marketplace-section-kicker">Free Resources</p>
          <h2>Download instantly, zero CP.</h2>
        </div>

        {resourcesError && <div className="marketplace-error">{resourcesError}</div>}

        {resources.length === 0 ? (
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
      </section>
    </div>
  );
};

export default Marketplace;

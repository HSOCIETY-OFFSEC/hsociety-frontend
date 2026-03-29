import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiDownloadCloud, FiShoppingBag } from 'react-icons/fi';
import { getPublicFreeResources, getPublicProducts, purchaseProduct } from '../services/marketplace.service';
import { getCpBalance } from '../../cp-wallet/services/cp.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PageLoader from '../../../shared/components/ui/PageLoader';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-border bg-bg-secondary p-6 shadow-lg">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">ZeroDay Market</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Welcome to the ZeroDay Market.
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            CP Points are your currency. Redeem them for books curated by HSOCIETY.
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-bg-primary p-4">
          <span className="text-xs uppercase tracking-widest text-text-tertiary">Your balance</span>
          <strong className="inline-flex items-center gap-2 text-2xl font-semibold text-brand">
            <img src={cpIcon} alt="CP" className="h-6 w-6" />
            {balance.toLocaleString()} CP
          </strong>
        </div>
      </header>

      {status && (
        <div className="rounded-md border border-status-success/30 bg-status-success/10 px-4 py-3 text-sm text-status-success">
          {status}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-widest text-text-tertiary">CP Books</p>
          <h2 className="text-lg font-semibold text-text-primary">Redeem your CP for premium titles.</h2>
        </div>

        {products.length === 0 ? (
          <div className="flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
            <FiBookOpen size={18} />
            <p>No CP products yet. Check back soon for drops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const price = Number(product.cpPrice || 0);
              const canBuy = balance >= price;
              return (
                <article key={product._id} className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-secondary">
                  {product.coverUrl ? (
                    <img src={product.coverUrl} alt={product.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-bg-tertiary text-sm font-semibold text-text-tertiary">
                      CP
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold text-text-primary">{product.title}</h3>
                      <p className="text-sm text-text-secondary">{product.description || 'ZeroDay Market item'}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <img src={cpIcon} alt="CP" className="h-5 w-5" />
                        {price} CP
                      </span>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                          canBuy
                            ? 'border-brand bg-brand text-ink-onBrand hover:bg-brand-hover'
                            : 'cursor-not-allowed border-border bg-bg-tertiary text-text-tertiary'
                        }`}
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

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-widest text-text-tertiary">Free Resources</p>
          <h2 className="text-lg font-semibold text-text-primary">Download instantly, zero CP.</h2>
        </div>

        {resourcesError && (
          <div className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {resourcesError}
          </div>
        )}

        {resources.length === 0 ? (
          <div className="flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
            <FiDownloadCloud size={18} />
            <p>{resourcesMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <article key={resource.id || resource.url} className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-secondary">
                <div className="flex h-40 items-center justify-center bg-bg-tertiary text-sm font-semibold text-text-tertiary">
                  FREE
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-text-primary">{resource.title || 'Free resource'}</h3>
                    <p className="text-sm text-text-secondary">{resource.description || 'Downloadable resource.'}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <img src={cpIcon} alt="CP" className="h-5 w-5" />
                      0 CP
                    </span>
                    {resource.url ? (
                      <a
                        className="inline-flex items-center gap-2 rounded-md border border-brand bg-brand px-3 py-2 text-sm font-semibold text-ink-onBrand transition hover:bg-brand-hover"
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiDownloadCloud size={14} />
                        Download
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-tertiary px-3 py-2 text-sm font-semibold text-text-tertiary">
                        Unavailable
                      </span>
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

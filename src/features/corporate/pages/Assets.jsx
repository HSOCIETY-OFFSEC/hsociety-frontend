import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit3, FiPlus, FiTrash } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getAssets } from '../services/assets.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { logger } from '../../../core/logging/logger';

const assetTypes = ['Domain', 'IP Range', 'Application', 'Cloud Environment'];

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', type: 'Domain', name: '', details: '' });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await getAssets();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setAssets(response.data);
    } catch (err) {
      logger.error(err);
      setError('Unable to load assets.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ id: '', type: 'Domain', name: '', details: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.details) {
      setError('Name and details are required.');
      return;
    }
    setError('');

    if (form.id) {
      setAssets((prev) =>
        prev.map((asset) => (asset.id === form.id ? { ...asset, ...form } : asset))
      );
    } else {
      setAssets((prev) => [...prev, { ...form, id: `asset-${Date.now()}` }]);
    }

    resetForm();
  };

  const handleEdit = (asset) => {
    setForm(asset);
  };

  const handleDelete = (assetId) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
  };

  const groupedAssets = useMemo(() => {
    return assetTypes.map((type) => ({
      type,
      items: assets.filter((asset) => asset.type === type)
    }));
  }, [assets]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Assets</p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Registered Assets</h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            Domains, IP ranges, applications, and cloud environments are tracked in one spot.
          </p>
        </div>
      </header>

      <Card padding="large">
        <h2 className="text-base font-semibold text-text-primary">{form.id ? 'Edit Asset' : 'Add Asset'}</h2>
        <form className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Asset Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {assetTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Asset Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="asset.example.com"
              className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-text-secondary">Details</label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder="Notes, environment, ownership"
              rows={3}
              className="w-full min-h-[80px] rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          {error && <p className="text-sm text-status-danger sm:col-span-2">{error}</p>}
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit" variant="primary" size="medium">
              {form.id ? 'Save Changes' : 'Add Asset'}
            </Button>
            {form.id && (
              <Button type="button" variant="ghost" size="medium" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} padding="large" shadow="small">
              <Skeleton className="h-4 w-3/5 rounded-md" />
              <Skeleton className="h-4 w-2/5 rounded-md" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groupedAssets.map((group) => (
            <Card key={group.type} padding="large" shadow="medium">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-text-primary">{group.type}</h3>
                <span className="rounded-full border border-border bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-tertiary">
                  {group.items.length} tracked
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {group.items.length === 0 ? (
                  <p className="text-sm text-text-tertiary">No assets registered yet.</p>
                ) : (
                  group.items.map((asset) => (
                    <div key={asset.id} className="flex items-start justify-between gap-3 rounded-md border border-border bg-bg-secondary px-3 py-2">
                      <div>
                        <strong className="block text-sm font-semibold text-text-primary">{asset.name}</strong>
                        <p className="text-xs text-text-secondary">{asset.details}</p>
                      </div>
                      <div className="flex flex-shrink-0 gap-1.5">
                        <button type="button" className="text-text-tertiary transition hover:text-text-primary" onClick={() => handleEdit(asset)}>
                          <FiEdit3 />
                        </button>
                        <button type="button" className="text-text-tertiary transition hover:text-status-danger" onClick={() => handleDelete(asset.id)}>
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assets;

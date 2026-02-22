import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit3, FiPlus, FiTrash } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getAssets } from './assets.service';
import '../../../styles/features/assets.css';

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
        throw new Error(response.error || 'Failed to load assets');
      }
      setAssets(response.data);
    } catch (err) {
      console.error(err);
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
    <div className="assets-page">
      <header className="assets-header">
        <div>
          <p className="assets-kicker">Assets</p>
          <h1>Registered Assets</h1>
          <p>Domains, IP ranges, applications, and cloud environments are tracked in one spot.</p>
        </div>
      </header>

      <Card padding="large" className="assets-form-card">
        <h2>{form.id ? 'Edit Asset' : 'Add Asset'}</h2>
        <form className="assets-form" onSubmit={handleSubmit}>
          <label>
            Asset Type
            <select name="type" value={form.type} onChange={handleChange}>
              {assetTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Asset Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="asset.example.com" />
          </label>
          <label>
            Details
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder="Notes, environment, ownership"
            />
          </label>
          {error && <p className="assets-form-error">{error}</p>}
          <div className="assets-form-actions">
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
        <div className="assets-loading">
          {[...Array(3)].map((_, index) => (
            <Card key={index} padding="large" shadow="small">
              <Skeleton className="skeleton-line" style={{ width: '60%' }} />
              <Skeleton className="skeleton-line" style={{ width: '40%' }} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="assets-grid">
          {groupedAssets.map((group) => (
            <Card key={group.type} padding="large" shadow="medium" className="assets-group-card">
              <div className="assets-group-header">
                <h3>{group.type}</h3>
                <span>{group.items.length} tracked</span>
              </div>
              <div className="assets-list">
                {group.items.length === 0 ? (
                  <p className="assets-empty">No assets registered yet.</p>
                ) : (
                  group.items.map((asset) => (
                    <div key={asset.id} className="assets-item">
                      <div>
                        <strong>{asset.name}</strong>
                        <p>{asset.details}</p>
                      </div>
                      <div className="assets-actions">
                        <button type="button" onClick={() => handleEdit(asset)}>
                          <FiEdit3 />
                        </button>
                        <button type="button" onClick={() => handleDelete(asset.id)}>
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

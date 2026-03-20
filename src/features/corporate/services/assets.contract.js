/**
 * Assets contract
 * Location: src/features/corporate/assets/assets.contract.js
 */

export const normalizeAsset = (asset = {}) => ({
  id: String(asset.id || Date.now()),
  type: asset.type || 'Domain',
  name: asset.name || 'Unnamed asset',
  details: asset.details || ''
});

export const normalizeAssets = (assets = []) => assets.map(normalizeAsset);

export default {
  normalizeAsset,
  normalizeAssets
};

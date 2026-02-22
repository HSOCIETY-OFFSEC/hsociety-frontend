/**
 * Assets service
 * Location: src/features/corporate/assets/assets.service.js
 */

import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api.config';
import { normalizeAssets } from './assets.contract';

const mockAssets = [
  {
    id: 'asset-01',
    type: 'Domain',
    name: 'portal.corp.example.com',
    details: 'Primary customer portal domain'
  },
  {
    id: 'asset-02',
    type: 'IP Range',
    name: '192.168.0.0/24',
    details: 'Internal engineering network'
  },
  {
    id: 'asset-03',
    type: 'Application',
    name: 'Mobile Banking App',
    details: 'Android + iOS clients'
  },
  {
    id: 'asset-04',
    type: 'Cloud Environment',
    name: 'Azure Production',
    details: 'Managed Kubernetes clusters'
  }
];

export const getAssets = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ASSETS.LIST);
  if (response.success) {
    const payload = Array.isArray(response.data) ? response.data : response.data?.items || [];
    return {
      success: true,
      data: normalizeAssets(payload)
    };
  }

  if (import.meta.env.DEV) {
    return {
      success: true,
      data: normalizeAssets(mockAssets),
      isMock: true
    };
  }

  return { success: false, error: response.error || 'Failed to load assets' };
};

export default {
  getAssets
};

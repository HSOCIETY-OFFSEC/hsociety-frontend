const STORAGE_TOAST_KEY = 'hsociety.toast';

export const setPendingToast = (payload) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_TOAST_KEY, JSON.stringify(payload));
};

export const getPendingToast = () => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(STORAGE_TOAST_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (err) {
    return null;
  }
};

export const clearPendingToast = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_TOAST_KEY);
};

export default {
  setPendingToast,
  getPendingToast,
  clearPendingToast,
};

const BOOTCAMP_REDIRECT_KEY = 'hsociety.bootcamp.redirect';

export const setBootcampRedirect = (path) => {
  if (!path) return;
  try {
    localStorage.setItem(BOOTCAMP_REDIRECT_KEY, path);
  } catch (err) {
    // ignore storage errors
  }
};

export const getBootcampRedirect = () => {
  try {
    return localStorage.getItem(BOOTCAMP_REDIRECT_KEY);
  } catch (err) {
    return null;
  }
};

export const consumeBootcampRedirect = (fallback = '/student-bootcamps/overview') => {
  const path = getBootcampRedirect();
  try {
    localStorage.removeItem(BOOTCAMP_REDIRECT_KEY);
  } catch (err) {
    // ignore storage errors
  }
  return path || fallback;
};

export default consumeBootcampRedirect;

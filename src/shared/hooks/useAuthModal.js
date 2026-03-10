import { useLocation, useNavigate } from 'react-router-dom';
import { AUTH_QUERY_KEY } from '../utils/authModal';

const getSearchString = (params) => {
  const search = params.toString();
  return search ? `?${search}` : '';
};

const getAuthPayload = (state) => state?.authModal || null;

const useAuthModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const mode = params.get(AUTH_QUERY_KEY);
  const redirect = params.get('redirect');
  const reason = params.get('reason');
  const payload = getAuthPayload(location.state);

  const openAuthModal = (nextMode, options = {}) => {
    const nextParams = new URLSearchParams(location.search);
    if (nextMode) {
      nextParams.set(AUTH_QUERY_KEY, nextMode);
    } else {
      nextParams.delete(AUTH_QUERY_KEY);
    }

    if (options.redirect) {
      nextParams.set('redirect', options.redirect);
    } else {
      nextParams.delete('redirect');
    }

    if (options.reason) {
      nextParams.set('reason', options.reason);
    } else {
      nextParams.delete('reason');
    }

    const hasPayload = Object.prototype.hasOwnProperty.call(options, 'payload');
    const nextPayload = hasPayload
      ? options.payload
      : location.state?.authModal || null;
    const nextState = {
      ...location.state,
      authModal: nextPayload ? { ...nextPayload } : null,
    };

    navigate(
      {
        pathname: options.pathname || location.pathname,
        search: getSearchString(nextParams),
      },
      {
        replace: options.replace ?? false,
        state: nextState,
      }
    );
  };

  const closeAuthModal = (options = {}) => {
    openAuthModal(null, { replace: options.replace ?? true, payload: null });
  };

  return {
    mode,
    redirect,
    reason,
    payload,
    openAuthModal,
    closeAuthModal,
  };
};

export default useAuthModal;

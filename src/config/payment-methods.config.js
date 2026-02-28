/**
 * Bootcamp payment methods configuration.
 * Edit labels/descriptions here without changing component logic.
 */

const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return value;
};

export const PAYMENT_METHODS = deepFreeze([
  {
    id: 'momo',
    label: 'MOMO',
    description: 'Mobile Money',
    icon: 'smartphone',
  },
  {
    id: 'mtn',
    label: 'MTN MOMO',
    description: 'MTN Mobile Money wallet',
    icon: 'radio',
  },
  {
    id: 'telcel',
    label: 'Telcel Cash',
    description: 'Telcel mobile money',
    icon: 'sim',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    description: 'Direct bank payment',
    icon: 'bank',
  },
  {
    id: 'btc',
    label: 'Bitcoin',
    description: 'BTC transfer and proof',
    icon: 'btc',
  },
]);

export default PAYMENT_METHODS;

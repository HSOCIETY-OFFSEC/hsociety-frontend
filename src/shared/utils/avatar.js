const PALETTE = [
  ['#0f766e', '#22c55e'],
  ['#1d4ed8', '#38bdf8'],
  ['#b45309', '#f59e0b'],
  ['#7c2d12', '#f97316'],
  ['#4c1d95', '#a855f7'],
  ['#4338ca', '#22d3ee'],
  ['#0f172a', '#64748b']
];

const hashSeed = (value = '') => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getAvatarStyle = (seed = 'user') => {
  const hash = hashSeed(seed);
  const [primary, secondary] = PALETTE[hash % PALETTE.length];
  const angle = hash % 360;
  const spot = (hash % 70) + 10;

  return {
    backgroundImage: `radial-gradient(circle at ${spot}% 20%, rgba(255, 255, 255, 0.35), transparent 55%), linear-gradient(${angle}deg, ${primary}, ${secondary})`,
    color: '#f8fafc',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.18)'
  };
};

export default {
  getAvatarStyle
};

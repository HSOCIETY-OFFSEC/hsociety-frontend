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

const toDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const getGithubLikePalette = (hash) => {
  const hue = hash % 360;
  const base = `hsl(${hue} 70% 45%)`;
  const accent = `hsl(${(hue + 45) % 360} 78% 58%)`;
  const bg = `hsl(${(hue + 210) % 360} 24% 12%)`;
  return { base, accent, bg };
};

export const getGithubAvatarDataUri = (seed = 'user') => {
  const hash = hashSeed(seed);
  const { base, accent, bg } = getGithubLikePalette(hash);
  const cell = 14;
  const size = cell * 5;
  const gap = 2;
  const active = [];

  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const bit = ((hash >> ((row * 3 + col) % 24)) & 1) === 1;
      if (!bit) continue;
      active.push([row, col]);
      if (col !== 2) active.push([row, 4 - col]);
    }
  }

  const tiles = active
    .map(([row, col], i) => {
      const x = col * cell + gap;
      const y = row * cell + gap;
      const w = cell - gap * 2;
      const color = i % 3 === 0 ? accent : base;
      return `<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="3" fill="${color}" opacity="0.94" />`;
    })
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="#0b1220" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#avatar-bg)" rx="12" />
  <g>
    ${tiles}
    <animateTransform attributeName="transform" type="translate" dur="8s" repeatCount="indefinite" values="0 0; 0.8 -0.8; 0 0; -0.8 0.8; 0 0" />
  </g>
</svg>`;

  return toDataUri(svg.trim());
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
  getAvatarStyle,
  getGithubAvatarDataUri
};

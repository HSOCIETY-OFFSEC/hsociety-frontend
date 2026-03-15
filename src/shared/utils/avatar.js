const PALETTE = [
  ['#0f766e', '#22c55e'],
  ['#1d4ed8', '#38bdf8'],
  ['#b45309', '#f59e0b'],
  ['#7c2d12', '#f97316'],
  ['#4c1d95', '#a855f7'],
  ['#4338ca', '#22d3ee'],
  ['#0f172a', '#64748b']
];

const sha256Hex = (input = '') => {
  const msg = new TextEncoder().encode(String(input));
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const l = msg.length;
  const bitLen = l * 8;
  const withOne = l + 1;
  const padLen = (withOne % 64 <= 56) ? (56 - (withOne % 64)) : (120 - (withOne % 64));
  const totalLen = withOne + padLen + 8;
  const buf = new Uint8Array(totalLen);
  buf.set(msg, 0);
  buf[l] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 2 ** 32) >>> 0, false);

  const w = new Uint32Array(64);
  for (let i = 0; i < buf.length; i += 64) {
    for (let j = 0; j < 16; j += 1) {
      w[j] = view.getUint32(i + j * 4, false);
    }
    for (let j = 16; j < 64; j += 1) {
      const s0 = (w[j - 15] >>> 7 | w[j - 15] << 25) ^ (w[j - 15] >>> 18 | w[j - 15] << 14) ^ (w[j - 15] >>> 3);
      const s1 = (w[j - 2] >>> 17 | w[j - 2] << 15) ^ (w[j - 2] >>> 19 | w[j - 2] << 13) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let j = 0; j < 64; j += 1) {
      const S1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e;
      e = (d + temp1) >>> 0;
      d = c; c = b; b = a;
      a = (temp1 + temp2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return Array.from(H)
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('');
};

const hashSeed = (value = '') => {
  const hex = sha256Hex(value);
  return parseInt(hex.slice(0, 8), 16);
};

const hashBytes = (value = '') => {
  const hex = sha256Hex(value);
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
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
  const bytes = hashBytes(seed);
  const { base, accent, bg } = getGithubLikePalette(hash);
  const cell = 14;
  const size = cell * 5;
  const gap = 2;
  const active = [];

  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const idx = row * 3 + col;
      const bit = (bytes[idx % bytes.length] & 1) === 1;
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

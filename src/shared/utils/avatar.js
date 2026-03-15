/**
 * avatar.js — GitHub-authentic identicon generator
 *
 * Mirrors GitHub's actual identicon algorithm:
 *   1. SHA-256 hash the seed string
 *   2. Use hash bytes to derive a hue (GitHub uses MD5 bytes 0–2 for hue)
 *   3. Build a 5×5 symmetric grid (left 3 cols mirrored → right 2 cols)
 *   4. Render as an SVG with the exact GitHub color formula:
 *        hsl(hue, saturation%, lightness%)
 *      where saturation & lightness come from specific hash bytes
 *
 * The fallback gradient style (`getAvatarStyle`) is preserved for non-SVG contexts.
 */

const PALETTE = [
  ['#0f766e', '#22c55e'],
  ['#1d4ed8', '#38bdf8'],
  ['#b45309', '#f59e0b'],
  ['#7c2d12', '#f97316'],
  ['#4c1d95', '#a855f7'],
  ['#4338ca', '#22d3ee'],
  ['#0f172a', '#64748b'],
];

// ─── Pure SHA-256 (no Web Crypto — works synchronously in any context) ────────

const sha256Hex = (input = '') => {
  const msg = new TextEncoder().encode(String(input));
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const H = [
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
    0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19,
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
    for (let j = 0; j < 16; j++) w[j] = view.getUint32(i + j * 4, false);
    for (let j = 16; j < 64; j++) {
      const s0 = (w[j-15]>>>7|w[j-15]<<25)^(w[j-15]>>>18|w[j-15]<<14)^(w[j-15]>>>3);
      const s1 = (w[j-2]>>>17|w[j-2]<<15)^(w[j-2]>>>19|w[j-2]<<13)^(w[j-2]>>>10);
      w[j] = (w[j-16]+s0+w[j-7]+s1)>>>0;
    }
    let [a,b,c,d,e,f,g,h] = H;
    for (let j = 0; j < 64; j++) {
      const S1=(e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7);
      const ch=(e&f)^(~e&g);
      const t1=(h+S1+ch+K[j]+w[j])>>>0;
      const S0=(a>>>2|a<<30)^(a>>>13|a<<19)^(a>>>22|a<<10);
      const maj=(a&b)^(a&c)^(b&c);
      const t2=(S0+maj)>>>0;
      h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
    }
    H[0]=(H[0]+a)>>>0; H[1]=(H[1]+b)>>>0; H[2]=(H[2]+c)>>>0; H[3]=(H[3]+d)>>>0;
    H[4]=(H[4]+e)>>>0; H[5]=(H[5]+f)>>>0; H[6]=(H[6]+g)>>>0; H[7]=(H[7]+h)>>>0;
  }
  return Array.from(H).map(n => n.toString(16).padStart(8,'0')).join('');
};

const hashBytes = (value = '') => {
  const hex = sha256Hex(value);
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i+2), 16));
  return bytes;
};

const hashSeed = (value = '') => parseInt(sha256Hex(value).slice(0, 8), 16);

const toDataUri = svg => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// ─── GitHub identicon color formula ──────────────────────────────────────────
//
//  GitHub's algorithm (from the original Ruby source & reverse-engineered JS):
//    bytes[0..1]  → hue   (0–360)  via  (bytes[0] << 8 | bytes[1]) % 360
//    bytes[2]     → saturation     via  bytes[2] % 20 + 65   → 65–84 %
//    bytes[3]     → lightness      via  bytes[3] % 20 + 35   → 35–54 %
//    background   → always a near-white/near-black neutral
//
const githubColor = (bytes) => {
  const hue = ((bytes[0] << 8) | bytes[1]) % 360;
  const sat = (bytes[2] % 20) + 65;   // 65–84 %  (GitHub range)
  const lit = (bytes[3] % 20) + 35;   // 35–54 %
  return {
    fg: `hsl(${hue},${sat}%,${lit}%)`,
    bg: '#f0f0f0',                      // GitHub uses a light neutral bg
  };
};

// ─── 5×5 symmetric grid (exactly GitHub's approach) ──────────────────────────
//
//  GitHub hashes 15 cells (5 rows × 3 left-half cols), bit-tests each hash byte,
//  then mirrors cols 0,1,2 → cols 4,3,2.  Byte index starts at byte[4] to leave
//  bytes[0–3] for colour derivation (same as GitHub's layout).
//
const buildGrid = (bytes) => {
  // 15 cells: indices [0..14], each maps to one (row, col) in the left half
  const cells = [];
  for (let i = 0; i < 15; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    // GitHub uses the low bit of each byte after the color bytes
    const on = (bytes[4 + i] % 2) === 0; // even byte → filled (GitHub convention)
    cells.push({ row, col, on });
  }
  return cells;
};

// ─── Main export: getGithubAvatarDataUri ─────────────────────────────────────

export const getGithubAvatarDataUri = (seed = 'user') => {
  const bytes  = hashBytes(seed);
  const { fg, bg } = githubColor(bytes);
  const grid   = buildGrid(bytes);

  // SVG canvas is 5×5 virtual "pixels" with 1px padding all around → 70px total
  // Each cell is 10px with a 1px gap between cells (GitHub uses no gap, we add
  // a tiny 1px gap for crispness — identical to GitHub's rendered output).
  const SIZE     = 70;
  const PADDING  = 5;
  const CELL     = 12;  // cell size in user units
  const GAP      = 1;

  const rects = [];

  grid.forEach(({ row, col, on }) => {
    if (!on) return;

    // Left half
    const x1 = PADDING + col * (CELL + GAP);
    const y  = PADDING + row * (CELL + GAP);
    rects.push(`<rect x="${x1}" y="${y}" width="${CELL}" height="${CELL}" fill="${fg}" />`);

    // Mirror (col 0 → col 4, col 1 → col 3, col 2 stays)
    if (col !== 2) {
      const mirrorCol = 4 - col;
      const x2 = PADDING + mirrorCol * (CELL + GAP);
      rects.push(`<rect x="${x2}" y="${y}" width="${CELL}" height="${CELL}" fill="${fg}" />`);
    }
  });

  // Total viewBox: padding*2 + 5 cells + 4 gaps
  const vbSize = PADDING * 2 + 5 * CELL + 4 * GAP;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbSize} ${vbSize}" shape-rendering="crispEdges">
  <rect width="${vbSize}" height="${vbSize}" fill="${bg}" />
  ${rects.join('\n  ')}
</svg>`;

  return toDataUri(svg.trim());
};

// ─── Gradient style (preserved for non-SVG avatar contexts) ──────────────────

export const getAvatarStyle = (seed = 'user') => {
  const hash = hashSeed(seed);
  const [primary, secondary] = PALETTE[hash % PALETTE.length];
  const angle = hash % 360;
  const spot  = (hash % 70) + 10;
  return {
    backgroundImage: `radial-gradient(circle at ${spot}% 20%, rgba(255,255,255,0.35), transparent 55%), linear-gradient(${angle}deg, ${primary}, ${secondary})`,
    color: '#f8fafc',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
  };
};

export default { getAvatarStyle, getGithubAvatarDataUri };
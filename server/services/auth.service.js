/**
 * Auth Service
 * Register, login, token issuance. Uses User model and bcrypt/JWT.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '24h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
const JWT_2FA_EXPIRY = process.env.JWT_2FA_EXPIRY || '5m';

/**
 * Map frontend role to backend User.role
 * corporate -> analyst; student -> student
 */
function mapRole(frontendRole) {
  if (frontendRole === 'student') return 'student';
  if (frontendRole === 'corporate') return 'analyst';
  return 'student';
}

/**
 * Hash password for storage
 */
async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare plain password with stored hash
 */
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Issue access and refresh tokens for a user
 * @returns { accessToken, refreshToken, expiresIn } expiresIn in seconds
 */
export function issueTokens(userId, email, role) {
  const payload = { sub: userId, email, role };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY }
  );
  const decoded = jwt.decode(accessToken);
  const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 86400;
  return { accessToken, refreshToken, expiresIn };
}

/**
 * Issue short-lived 2FA token after primary login
 */
export function issueTwoFactorToken(userId, email, role) {
  const payload = { sub: userId, email, role, type: '2fa' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_2FA_EXPIRY });
}

/**
 * Build safe user object for response (no passwordHash)
 */
export function toUserResponse(doc) {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name || '',
    role: doc.role,
    twoFactorEnabled: !!doc.twoFactorEnabled,
  };
}

/**
 * Register: map frontend DTO to User, hash password, create user, return user + tokens.
 * Frontend sends: { role, profile: { fullName, organization }, credentials: { email, password }, consent, metadata }
 */
export async function register(payload) {
  const { role: frontendRole, profile, credentials } = payload || {};
  if (!credentials?.email || !credentials?.password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }
  const email = String(credentials.email).trim().toLowerCase();
  const password = String(credentials.password);
  if (password.length < 8) {
    const err = new Error('Password must be at least 8 characters');
    err.status = 400;
    throw err;
  }
  const name = profile?.fullName ? String(profile.fullName).trim() : '';
  const role = mapRole(frontendRole);

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email,
    passwordHash,
    name,
    role,
  });

  const { accessToken, refreshToken, expiresIn } = issueTokens(user._id, user.email, user.role);
  return {
    user: toUserResponse(user),
    token: accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Login: find user by email, compare password, update lastLoginAt, return user + tokens.
 * Body: { email, password }
 */
export async function login(email, password) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const match = await comparePassword(password, user.passwordHash);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  if (user.twoFactorEnabled) {
    const twoFactorToken = issueTwoFactorToken(user._id, user.email, user.role);
    return {
      twoFactorRequired: true,
      twoFactorToken,
      user: toUserResponse(user),
    };
  }

  const { accessToken, refreshToken, expiresIn } = issueTokens(user._id, user.email, user.role);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  return {
    user: toUserResponse(user),
    token: accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Refresh: verify refresh token and issue new access (and optionally refresh) token.
 * Body: { refreshToken }
 */
export async function refresh(refreshToken) {
  if (!refreshToken) {
    const err = new Error('Refresh token is required');
    err.status = 400;
    throw err;
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.status = 401;
    throw err;
  }
  if (decoded.type !== 'refresh') {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  const user = await User.findById(decoded.sub).lean();
  if (!user) {
    const err = new Error('User not found');
    err.status = 401;
    throw err;
  }
  const { accessToken, refreshToken: newRefreshToken, expiresIn } = issueTokens(
    user._id,
    user.email,
    user.role
  );
  return {
    user: toUserResponse(user),
    token: accessToken,
    refreshToken: newRefreshToken,
    expiresIn,
  };
}

export default {
  register,
  login,
  refresh,
  issueTokens,
  issueTwoFactorToken,
  toUserResponse,
};

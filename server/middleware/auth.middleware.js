/**
 * Auth Middleware
 * Verify JWT from Authorization: Bearer <token>, set req.user (safe user object).
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Require valid JWT. Sets req.user = { id, email, name, role }.
 * Returns 401 if missing or invalid token.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (decoded.type === '2fa') {
    return res.status(401).json({ error: 'Two-factor verification required' });
  }

  const userId = decoded.sub;
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    name: user.name || '',
    role: user.role,
  };
  next();
}

/**
 * Optional auth: set req.user if valid token present, otherwise leave req.user undefined.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type === '2fa') return next();
    const user = await User.findById(decoded.sub).lean();
    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name || '',
        role: user.role,
      };
    }
  } catch {
    // ignore invalid token
  }
  next();
}

export default { requireAuth, optionalAuth };

/**
 * Auth Routes
 * Matches frontend API_ENDPOINTS.AUTH
 */
import { Router } from 'express';

const router = Router();

// POST /auth/login - TODO: Implement with JWT
router.post('/login', (req, res) => {
  res.status(501).json({ error: 'Not implemented - connect auth service' });
});

// POST /auth/register - TODO: Implement
router.post('/register', (req, res) => {
  res.status(501).json({ error: 'Not implemented - connect auth service' });
});

// POST /auth/logout - TODO: Implement token invalidation
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

// POST /auth/refresh - TODO: Implement token refresh
router.post('/refresh', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /auth/verify - TODO: Implement token verification
router.get('/verify', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /auth/me - TODO: Implement with auth middleware
router.get('/me', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// OTP endpoints - TODO: Implement
router.post('/otp/request', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
router.post('/otp/verify', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;

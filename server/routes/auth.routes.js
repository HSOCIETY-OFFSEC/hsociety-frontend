/**
 * Auth Routes
 * Matches frontend API_ENDPOINTS.AUTH
 */
import { Router } from 'express';
import * as authService from '../services/auth.service.js';
import * as twoFAService from '../services/twofa.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/logout - client clears session; 200 OK
router.post('/logout', (_req, res) => {
  res.json({ success: true });
});

// POST /auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.body?.refreshToken || req.body?.refresh_token;
    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// GET /auth/verify - validate token, return user (Bearer required)
router.get('/verify', requireAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// GET /auth/me - current user (Bearer required)
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

// OTP endpoints - Phase 2
router.post('/otp/request', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
router.post('/otp/verify', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
router.post('/otp/resend', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// ============================================
// 2FA (TOTP) endpoints
// ============================================

// POST /auth/2fa/setup - begin setup, return QR + secret
router.post('/2fa/setup', requireAuth, async (req, res, next) => {
  try {
    const result = await twoFAService.setup2FA(req.user.id);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/2fa/enable - verify code and enable 2FA
router.post('/2fa/enable', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body || {};
    const result = await twoFAService.enable2FA(req.user.id, code);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/2fa/disable - disable 2FA with code
router.post('/2fa/disable', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body || {};
    const result = await twoFAService.disable2FA(req.user.id, code);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/2fa/verify - complete login with 2FA token
router.post('/2fa/verify', async (req, res, next) => {
  try {
    const { twoFactorToken, code } = req.body || {};
    const result = await twoFAService.verify2FA(twoFactorToken, code);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/2fa/verify-backup - complete login with backup code
router.post('/2fa/verify-backup', async (req, res, next) => {
  try {
    const { twoFactorToken, backupCode } = req.body || {};
    const result = await twoFAService.verifyBackupCode(twoFactorToken, backupCode);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// POST /auth/2fa/regenerate-backup - generate new backup codes
router.post('/2fa/regenerate-backup', requireAuth, async (req, res, next) => {
  try {
    const result = await twoFAService.regenerateBackupCodes(req.user.id);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

// GET /auth/2fa/status - check 2FA status
router.get('/2fa/status', requireAuth, async (req, res, next) => {
  try {
    const result = await twoFAService.get2FAStatus(req.user.id);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

export default router;

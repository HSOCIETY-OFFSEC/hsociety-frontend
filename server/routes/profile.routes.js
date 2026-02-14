/**
 * Profile Routes
 * Matches frontend API_ENDPOINTS.PROFILE
 */
import { Router } from 'express';

const router = Router();

// TODO: Add auth middleware

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.put('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;

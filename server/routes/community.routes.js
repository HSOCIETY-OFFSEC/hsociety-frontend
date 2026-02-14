/**
 * Community Routes
 * Matches frontend API_ENDPOINTS.COMMUNITY
 */
import { Router } from 'express';

const router = Router();

router.get('/overview', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/posts', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;

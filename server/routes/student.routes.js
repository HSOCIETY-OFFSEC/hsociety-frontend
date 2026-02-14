/**
 * Student Routes
 * Matches frontend API_ENDPOINTS.STUDENT
 */
import { Router } from 'express';

const router = Router();

router.get('/overview', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/learning-path', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/challenges', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;

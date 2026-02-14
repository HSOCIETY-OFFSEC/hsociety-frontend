/**
 * Feedback Routes
 * Matches frontend API_ENDPOINTS.FEEDBACK
 */
import { Router } from 'express';
import { Feedback } from '../models/index.js';

const router = Router();

// POST /feedback - Public endpoint (persisted to MongoDB)
router.post('/', async (req, res, next) => {
  try {
    const ticketNumber = 'FB-' + Date.now();
    const doc = await Feedback.create({
      ticketNumber,
      email: req.body?.email,
      subject: req.body?.subject ?? '',
      message: req.body?.message ?? req.body?.body ?? '',
      category: req.body?.category ?? 'general',
    });
    res.status(201).json({ success: true, ticketNumber: doc.ticketNumber });
  } catch (err) {
    next(err);
  }
});

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented - requires auth' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;

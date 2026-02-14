/**
 * Dashboard Routes
 * Matches frontend API_ENDPOINTS.DASHBOARD
 */
import { Router } from 'express';

const router = Router();

// GET /dashboard/stats - TODO: Add auth middleware, connect to data source
router.get('/stats', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /dashboard/activity - TODO: Implement
router.get('/activity', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /dashboard/overview - Returns mock data for frontend dev
router.get('/overview', (req, res) => {
  res.json({
    stats: {
      activePentests: 3,
      completedAudits: 12,
      pendingReports: 2,
      vulnerabilitiesFound: 47,
      remediationRate: 68
    },
    recentActivity: [
      { id: '1', type: 'pentest', title: 'Web Application Pentest', status: 'in-progress', date: Date.now() - 2 * 24 * 60 * 60 * 1000 },
      { id: '2', type: 'audit', title: 'Security Audit Report', status: 'completed', date: Date.now() - 5 * 24 * 60 * 60 * 1000 }
    ]
  });
});

export default router;

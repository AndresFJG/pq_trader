import { Router } from 'express';

const router = Router();

// Placeholder routes for Darwinex integration
router.get('/portfolios', (req, res) => {
  res.json({ success: true, message: 'Get Darwinex portfolios route' });
});

router.get('/performance/:darwinName', (req, res) => {
  res.json({ success: true, message: 'Get performance data route' });
});

router.get('/stats', (req, res) => {
  res.json({ success: true, message: 'Get stats route' });
});

export default router;

import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import {
  getMentorSchedules,
  upsertMentorSchedule,
  toggleMentorSchedule,
  addUnavailability,
  getUnavailability,
  removeUnavailability
} from '../controllers/mentorSchedule.controller';

const router = Router();

// All routes require authentication and mentor role
router.use(protect, authorize('mentor', 'admin'));

// Schedule management (cast to any to fix TypeScript strict checking)
router.get('/schedules', getMentorSchedules as any);
router.post('/schedules', upsertMentorSchedule as any);
router.patch('/schedules/toggle', toggleMentorSchedule as any);

// Unavailability management
router.get('/unavailability', getUnavailability as any);
router.post('/unavailability', addUnavailability as any);
router.delete('/unavailability/:unavailability_id', removeUnavailability as any);

export default router;

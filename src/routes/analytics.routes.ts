import { Router } from 'express';
import { getCreatorAnalytics, getEventAnalytics } from '../controllers/analytics.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Event and ticket statistics for creators
 */

/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Get all-time analytics for the logged-in creator
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       403:
 *         description: Unauthorized - Must be a creator
 */
router.get('/dashboard', protect, authorize('creator'), getCreatorAnalytics);

/**
 * @swagger
 * /api/v1/analytics/events/{eventId}:
 *   get:
 *     summary: Get analytics for a specific event
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to fetch analytics for
 *     responses:
 *       200:
 *         description: Event-specific analytics retrieved successfully
 *       403:
 *         description: Unauthorized - Must be a creator
 *       404:
 *         description: Event not found
 */
router.get('/events/:eventId', protect, authorize('creator'), getEventAnalytics);

export default router;
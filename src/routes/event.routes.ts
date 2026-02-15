import { Router } from 'express';
import { createEvent, getEvents, getEvent } from '../controllers/event.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management and retrieval
 */

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Retrieve all published events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *   post:
 *     summary: Create a new event (Creators only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - capacity
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tech Connect 2026
 *               description:
 *                 type: string
 *                 example: The biggest backend engineering meetup.
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T18:00:00Z
 *               location:
 *                 type: string
 *                 example: Lagos, Nigeria
 *               capacity:
 *                 type: number
 *                 example: 500
 *               price:
 *                 type: number
 *                 example: 5000
 *               reminderSet:
 *                 type: number
 *                 example: 24
 *     responses:
 *       201:
 *         description: Event created successfully
 *       403:
 *         description: Unauthorized - Must be a creator
 */
router.get('/', getEvents);
router.post('/', protect, authorize('creator'), createEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEvent);

export default router;
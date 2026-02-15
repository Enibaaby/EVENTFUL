import { Router } from 'express';
import { buyTicket, verifyTicketPayment, scanTicket, setCustomReminder } from '../controllers/ticket.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Tickets
 *     description: Ticket purchasing, verification, scanning, and reminders
 */

/**
 * @swagger
 * /api/v1/tickets/buy:
 *   post:
 *     summary: Initialize a ticket purchase (Eventees only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Payment initialized successfully. Proceed to authorization_url.
 *       403:
 *         description: Unauthorized - Must be an eventee
 */
router.post('/buy', protect, authorize('eventee'), buyTicket);

/**
 * @swagger
 * /api/v1/tickets/verify:
 *   get:
 *     summary: Verify Paystack payment and generate QR code ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Paystack transaction reference
 *     responses:
 *       201:
 *         description: Ticket generated successfully
 *       400:
 *         description: Invalid or failed transaction reference
 */
router.get('/verify', verifyTicketPayment);

/**
 * @swagger
 * /api/v1/tickets/scan:
 *   post:
 *     summary: Scan and validate an attendee's QR ticket (Creators only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - eventId
 *             properties:
 *               ticketId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               eventId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Ticket verified and admitted
 *       403:
 *         description: Unauthorized - Must be a creator
 */
router.post('/scan', protect, authorize('creator'), scanTicket);

/**
 * @swagger
 * /api/v1/tickets/reminder:
 *   patch:
 *     summary: Set a custom email reminder time for an event (Eventees only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - reminderHours
 *             properties:
 *               ticketId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               reminderHours:
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Reminder successfully set
 *       403:
 *         description: Unauthorized - Must be an eventee
 */
router.patch('/reminder', protect, authorize('eventee'), setCustomReminder);

export default router;
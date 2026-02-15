import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  attendee: mongoose.Types.ObjectId;
  paymentReference: string;
  qrCode: string;
  isScanned: boolean;
  userReminder?: number;
  reminderSent: boolean;
}

const ticketSchema = new Schema<ITicket>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    attendee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentReference: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    isScanned: { type: Boolean, default: false },
    userReminder: { type: Number },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ticketSchema.index({ event: 1, attendee: 1 }, { unique: true });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
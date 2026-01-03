import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  mentorshipId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  timeSlot: {
    startTime: Date;
    endTime: Date;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  meetingLink?: string;
  notes?: string;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    mentorshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Mentorship',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeSlot: {
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'canceled'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
    },
    notes: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);

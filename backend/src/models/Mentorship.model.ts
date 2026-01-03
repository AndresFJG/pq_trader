import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorship extends Document {
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  mentor: mongoose.Types.ObjectId;
  availableSlots: {
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const mentorshipSchema = new Schema<IMentorship>(
  {
    title: {
      type: String,
      required: [true, 'El título de la mentoría es requerido'],
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción de la mentoría es requerida'],
    },
    price: {
      type: Number,
      required: [true, 'El precio de la mentoría es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    duration: {
      type: Number,
      required: [true, 'La duración de la mentoría es requerida'],
      min: [15, 'La duración debe ser al menos 15 minutos'],
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availableSlots: [{
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMentorship>('Mentorship', mentorshipSchema);

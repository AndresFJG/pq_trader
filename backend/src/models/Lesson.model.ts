import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  duration: number; // in minutes
  order: number;
  courseId: mongoose.Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, 'El título de la lección es requerido'],
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción de la lección es requerida'],
    },
    videoUrl: {
      type: String,
    },
    content: {
      type: String,
      required: [true, 'El contenido de la lección es requerido'],
    },
    duration: {
      type: Number,
      required: [true, 'La duración de la lección es requerida'],
      min: [1, 'La duración debe ser al menos 1 minuto'],
    },
    order: {
      type: Number,
      required: [true, 'El orden de la lección es requerido'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);

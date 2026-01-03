import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  duration: number; // in hours
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  instructor: mongoose.Types.ObjectId;
  enrolled: number;
  rating: number;
  topics: string[];
  lessons: mongoose.Types.ObjectId[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'El título del curso es requerido'],
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción del curso es requerida'],
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    },
    price: {
      type: Number,
      required: [true, 'El precio del curso es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    duration: {
      type: Number,
      required: [true, 'La duración del curso es requerida'],
      min: [1, 'La duración debe ser al menos 1 hora'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: [true, 'El nivel del curso es requerido'],
    },
    thumbnail: {
      type: String,
      default: '/default-course.jpg',
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolled: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'La calificación mínima es 0'],
      max: [5, 'La calificación máxima es 5'],
    },
    topics: [{
      type: String,
      trim: true,
    }],
    lessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    }],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICourse>('Course', courseSchema);

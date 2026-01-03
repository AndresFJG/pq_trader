export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'mentor';
  avatar?: string;
  subscription?: Subscription;
  createdAt: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: 'monthly' | 'annual';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // en horas
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  instructor: User;
  enrolled: number;
  rating: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  duration: number; // en minutos
  order: number;
  courseId: string;
}

export interface Mentorship {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // en minutos
  mentor: User;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  mentorship: Mentorship;
  timeSlot: TimeSlot;
  user: User;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  meetingLink?: string;
  createdAt: string;
}

export interface DarwinexPortfolio {
  id: string;
  name: string;
  description: string;
  return: number;
  drawdown: number;
  sharpeRatio: number;
  trades: number;
  winRate: number;
  lastUpdate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

import api from '@/lib/api';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  price: number;
  duration_hours: number;
  thumbnail: string;
  is_published: boolean;
  enrollment_count: number;
  rating: number;
  category: string;
}

export interface CourseStats {
  activeCourses: number;
  totalStudents: number;
  totalHours: number;
}

export const courseService = {
  async getFeaturedCourses(): Promise<Course[]> {
    try {
      const { data } = await api.get('/courses/featured');
      return data.data || [];
    } catch (error: any) {
      return [];
    }
  },

  async getAllCourses(): Promise<Course[]> {
    try {
      const { data } = await api.get('/courses');
      return data.data || [];
    } catch (error: any) {
      return [];
    }
  },

  async getCourseById(id: string): Promise<Course | null> {
    try {
      const { data } = await api.get(`/courses/${id}`);
      return data.data || null;
    } catch (error: any) {
      return null;
    }
  },

  async getCourseStats(): Promise<CourseStats> {
    try {
      const { data } = await api.get('/courses/stats');
      return data.data || { activeCourses: 0, totalStudents: 0, totalHours: 0 };
    } catch (error: any) {
      console.error('Error fetching course stats:', error);
      return { activeCourses: 0, totalStudents: 0, totalHours: 0 };
    }
  },
};

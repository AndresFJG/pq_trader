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

export const courseService = {
  async getFeaturedCourses(): Promise<Course[]> {
    try {
      console.log('🎯 Fetching featured courses from:', '/courses/featured');
      const { data } = await api.get('/courses/featured');
      console.log('✅ Featured courses response:', data);
      return data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching featured courses:', error);
      console.error('Error details:', error.response?.data || error.message);
      return [];
    }
  },

  async getAllCourses(): Promise<Course[]> {
    try {
      console.log('🎯 Fetching all courses from:', '/courses');
      const { data } = await api.get('/courses');
      console.log('✅ All courses response:', data);
      return data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching courses:', error);
      console.error('Error details:', error.response?.data || error.message);
      return [];
    }
  },

  async getCourseById(id: string): Promise<Course | null> {
    try {
      console.log('🎯 Fetching course by ID:', id);
      const { data } = await api.get(`/courses/${id}`);
      console.log('✅ Course response:', data);
      return data.data || null;
    } catch (error: any) {
      console.error('❌ Error fetching course:', error);
      console.error('Error details:', error.response?.data || error.message);
      return null;
    }
  },
};

import api from '@/lib/api';

export interface Mentorship {
  id: string;
  title: string;
  description: string;
  mentor_name: string;
  price: number;
  duration?: number;
  duration_minutes?: number;
  duration_weeks?: number;
  spots_available?: number;
  thumbnail?: string;
  is_active?: boolean;
  rating?: number;
  enrolled_count?: number;
  created_at: string;
  updated_at: string;
}

export const mentorshipService = {
  async getFeaturedMentorships(): Promise<Mentorship[]> {
    try {
      const { data } = await api.get('/mentorships/featured');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching featured mentorships:', error);
      return [];
    }
  },

  async getAllMentorships(): Promise<Mentorship[]> {
    try {
      const { data } = await api.get('/mentorships');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching mentorships:', error);
      return [];
    }
  },

  async getMentorshipById(id: string): Promise<Mentorship | null> {
    try {
      const { data } = await api.get(`/mentorships/${id}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching mentorship:', error);
      return null;
    }
  },
};

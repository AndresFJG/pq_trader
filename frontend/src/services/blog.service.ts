import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api';

export interface BlogPost {
  id: number;
  slug: string;
  title_es: string;
  excerpt_es: string;
  content_es: string;
  title_en: string;
  excerpt_en: string;
  content_en: string;
  author: string;
  category: string;
  read_time: string;
  cover_image?: string;
  meta_description_es?: string;
  meta_description_en?: string;
  meta_keywords?: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBlogPostDto {
  slug: string;
  title_es: string;
  excerpt_es: string;
  content_es: string;
  title_en: string;
  excerpt_en: string;
  content_en: string;
  author: string;
  category: string;
  read_time: string;
  cover_image?: string;
  meta_description_es?: string;
  meta_description_en?: string;
  meta_keywords?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
}

class BlogService {
  private axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  // Public methods
  async getPublishedPosts(params?: { category?: string; featured?: boolean }) {
    const response = await this.axiosInstance.get('/blog', { params });
    return response.data;
  }

  async getPostBySlug(slug: string) {
    const response = await this.axiosInstance.get(`/blog/slug/${slug}`);
    return response.data;
  }

  // Admin methods
  async getAllPosts(token: string, params?: { status?: string; category?: string }) {
    const response = await this.axiosInstance.get('/blog', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async getPostById(id: number, token: string) {
    const response = await this.axiosInstance.get(`/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async createPost(data: CreateBlogPostDto, token: string) {
    const response = await this.axiosInstance.post('/blog', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async updatePost(id: number, data: Partial<BlogPost>, token: string) {
    const response = await this.axiosInstance.put(`/blog/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async deletePost(id: number, token: string) {
    const response = await this.axiosInstance.delete(`/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}

export default new BlogService();

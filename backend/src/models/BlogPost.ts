import { supabase } from '../config/supabase';

export interface BlogPost {
  id?: number;
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

class BlogPostModel {
  private tableName = 'blog_posts';

  async findAll(filters?: { status?: string; category?: string; featured?: boolean }) {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .order('published_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as BlogPost[];
  }

  async findBySlug(slug: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as BlogPost;
  }

  async findById(id: number) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as BlogPost;
  }

  async create(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([blogPost])
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  }

  async update(id: number, updates: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  }

  async delete(id: number) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async incrementViews(id: number) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('views')
      .eq('id', id)
      .single();

    if (error) throw error;

    const currentViews = data?.views || 0;

    await supabase
      .from(this.tableName)
      .update({ views: currentViews + 1 })
      .eq('id', id);
  }
}

export default new BlogPostModel();

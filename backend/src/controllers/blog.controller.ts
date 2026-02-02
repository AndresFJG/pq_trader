import { Response } from 'express';
import { AuthRequest } from '../types';
import BlogPostModel, { BlogPost } from '../models/BlogPost';

// Get all blog posts (public and admin)
export const getBlogPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, category, featured } = req.query;
    
    const filters: any = {};
    
    // Public users only see published posts
    if (!req.user || req.user.role !== 'admin') {
      filters.status = 'published';
    } else if (status) {
      filters.status = status as string;
    }
    
    if (category) {
      filters.category = category as string;
    }
    
    if (featured !== undefined) {
      filters.featured = featured === 'true';
    }

    const posts = await BlogPostModel.findAll(filters);
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener los artículos del blog'
    });
  }
};

// Get single blog post by slug
export const getBlogPostBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const post = await BlogPostModel.findBySlug(slug);
    
    if (!post) {
      res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
      return;
    }

    // Check if user can view this post
    if (post.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      res.status(403).json({
        success: false,
        error: 'No tienes permiso para ver este artículo'
      });
      return;
    }

    // Increment views
    if (post.status === 'published') {
      await BlogPostModel.incrementViews(post.id!);
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener el artículo'
    });
  }
};

// Create blog post (admin only)
export const createBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogPostData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
      slug: req.body.slug,
      title_es: req.body.title_es,
      excerpt_es: req.body.excerpt_es,
      content_es: req.body.content_es,
      title_en: req.body.title_en,
      excerpt_en: req.body.excerpt_en,
      content_en: req.body.content_en,
      author: req.body.author,
      category: req.body.category,
      read_time: req.body.read_time,
      cover_image: req.body.cover_image,
      meta_description_es: req.body.meta_description_es,
      meta_description_en: req.body.meta_description_en,
      meta_keywords: req.body.meta_keywords,
      status: req.body.status || 'draft',
      featured: req.body.featured || false,
      views: 0,
      published_at: req.body.status === 'published' ? new Date().toISOString() : undefined
    };

    const newPost = await BlogPostModel.create(blogPostData);
    
    res.status(201).json({
      success: true,
      data: newPost,
      message: 'Artículo creado exitosamente'
    });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear el artículo'
    });
  }
};

// Update blog post (admin only)
export const updateBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<BlogPost> = req.body;

    // If publishing for the first time, set published_at
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const updatedPost = await BlogPostModel.update(parseInt(id), updates);
    
    res.json({
      success: true,
      data: updatedPost,
      message: 'Artículo actualizado exitosamente'
    });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar el artículo'
    });
  }
};

// Delete blog post (admin only)
export const deleteBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await BlogPostModel.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Artículo eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar el artículo'
    });
  }
};

// Get blog post by ID (admin only)
export const getBlogPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const post = await BlogPostModel.findById(parseInt(id));
    
    if (!post) {
      res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
      return;
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener el artículo'
    });
  }
};

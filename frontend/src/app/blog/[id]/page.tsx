'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { Calendar, Clock, User, ArrowLeft, Share2, BookmarkPlus, BookOpen, TrendingUp, BarChart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import blogService, { BlogPost } from '@/services/blog.service';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.id as string;
  const { language } = useLanguage();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await blogService.getPostBySlug(slug);
        
        if (response.success) {
          setPost(response.data);
          
          // Fetch related posts (same category, different post)
          const relatedResponse = await blogService.getPublishedPosts({ 
            category: response.data.category 
          });
          
          if (relatedResponse.success) {
            const filtered = relatedResponse.data
              .filter((p: BlogPost) => p.id !== response.data.id)
              .slice(0, 2);
            setRelatedPosts(filtered);
          }
        } else {
          setError(response.error);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el artículo');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);
  
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="animate-pulse">
              <div className="h-8 bg-border/40 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-border/40 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-border/40 rounded mb-8"></div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'es' ? 'Artículo no encontrado' : 'Article not found'}
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/blog">
              <Button>{language === 'es' ? 'Volver al Blog' : 'Back to Blog'}</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const title = language === 'es' ? post.title_es : post.title_en;
  const excerpt = language === 'es' ? post.excerpt_es : post.excerpt_en;
  const content = language === 'es' ? post.content_es : post.content_en;
  
  // Format date
  const formattedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Article Header */}
      <article className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-profit transition-colors">
              {language === 'es' ? 'Inicio' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-profit transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground">{language === 'es' ? 'Artículo' : 'Article'}</span>
          </nav>

          {/* Post Meta */}
          <div className="mb-8">
            <Badge className="mb-4 bg-profit/10 text-profit border-profit/20">
              {post.category}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{excerpt}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.read_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
              <Image
                src={post.cover_image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="border-border/40">
                <CardContent className="p-8 lg:p-12">
                  <div 
                    className="prose prose-invert prose-lg max-w-none
                      prose-headings:text-foreground prose-headings:font-bold
                      prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                      prose-strong:text-profit prose-strong:font-semibold
                      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                      prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                      prose-li:text-muted-foreground prose-li:my-2"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Article Info */}
                <Card className="border-profit/20 bg-profit/5">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-profit" />
                      <CardTitle className="text-lg">
                        {language === 'es' ? 'Información' : 'Information'}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-profit flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {post.views} {language === 'es' ? 'vistas' : 'views'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-profit flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {language === 'es' ? 'Categoría' : 'Category'}: {post.category}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Share Actions */}
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'es' ? 'Compartir' : 'Share'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="h-4 w-4" />
                      {language === 'es' ? 'Compartir artículo' : 'Share article'}
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <BookmarkPlus className="h-4 w-4" />
                      {language === 'es' ? 'Guardar para después' : 'Save for later'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-12">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === 'es' ? 'Volver al Blog' : 'Back to Blog'}
              </Button>
            </Link>
          </div>

          {/* Related Posts */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'es' ? 'Artículos Relacionados' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedTitle = language === 'es' ? relatedPost.title_es : relatedPost.title_en;
                const relatedExcerpt = language === 'es' ? relatedPost.excerpt_es : relatedPost.excerpt_en;
                
                return (
                  <Card key={relatedPost.id} className="border-border/40 hover:border-profit/40 transition-all group">
                    <CardHeader>
                      {relatedPost.cover_image && (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={relatedPost.cover_image}
                            alt={relatedTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <Badge className="mb-2 w-fit bg-profit/10 text-profit border-profit/20">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-xl group-hover:text-profit transition-colors">
                        {relatedTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{relatedExcerpt}</p>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button variant="outline" className="w-full">
                          {language === 'es' ? 'Leer más' : 'Read more'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </article>
      
      <Footer />
    </main>
  );
}

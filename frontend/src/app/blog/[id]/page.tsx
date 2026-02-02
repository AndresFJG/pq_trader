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

interface BlogPost {
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  coverImage?: string;
  learningPoints?: { es: string[]; en: string[] };
  tableOfContents?: { es: string[]; en: string[] };
  content: { es: string; en: string };
}

const blogPosts: Record<string, BlogPost> = {
  '1': {
    title: {
      es: 'Cómo Empezar con Trading Algorítmico en 2025',
      en: 'How to Start with Algorithmic Trading in 2025'
    },
    excerpt: {
      es: 'Guía completa para principiantes que quieren adentrarse en el mundo del trading algorítmico.',
      en: 'Complete guide for beginners who want to dive into the world of algorithmic trading.'
    },
    author: 'Carlos Martínez',
    date: '2025-12-10',
    category: 'Principiantes',
    readTime: '8 min',
    image: '📚',
    coverImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=600&fit=crop',
    learningPoints: {
      es: [
        'Fundamentos del trading algorítmico y sus ventajas competitivas',
        'Herramientas esenciales: Python, MetaTrader y plataformas de backtesting',
        'Cómo diseñar tu primera estrategia de trading automatizado',
        'Mejores prácticas de backtesting y validación de estrategias',
        'Gestión de riesgo aplicada al trading algorítmico'
      ],
      en: [
        'Fundamentals of algorithmic trading and its competitive advantages',
        'Essential tools: Python, MetaTrader and backtesting platforms',
        'How to design your first automated trading strategy',
        'Best practices for backtesting and strategy validation',
        'Risk management applied to algorithmic trading'
      ]
    },
    tableOfContents: {
      es: [
        '¿Qué es el Trading Algorítmico?',
        'Ventajas del Trading Algorítmico',
        'Primeros Pasos',
        'Herramientas Esenciales',
        'Tu Primera Estrategia',
        'Conclusión'
      ],
      en: [
        'What is Algorithmic Trading?',
        'Advantages of Algorithmic Trading',
        'Getting Started',
        'Essential Tools',
        'Your First Strategy',
        'Conclusion'
      ]
    },
    content: {
      es: `
        <h2>Introducción al Trading Algorítmico</h2>
        <p>El trading algorítmico ha revolucionado la forma en que operamos en los mercados financieros. En esta guía completa, aprenderás los fundamentos esenciales para comenzar tu camino en el trading automatizado.</p>
        
        <h3>¿Qué es el Trading Algorítmico?</h3>
        <p>El trading algorítmico es la ejecución automática de operaciones en los mercados financieros mediante programas informáticos que siguen un conjunto predefinido de instrucciones (algoritmo). Estos algoritmos pueden analizar datos del mercado, identificar oportunidades de trading y ejecutar operaciones sin intervención humana.</p>
        
        <h3>Ventajas del Trading Algorítmico</h3>
        <ul>
          <li><strong>Velocidad:</strong> Los algoritmos pueden analizar datos y ejecutar operaciones en milisegundos</li>
          <li><strong>Precisión:</strong> Elimina errores humanos en la ejecución de órdenes</li>
          <li><strong>Disciplina:</strong> Sigue el plan de trading sin emociones</li>
          <li><strong>Backtesting:</strong> Prueba estrategias con datos históricos antes de arriesgar capital real</li>
          <li><strong>Diversificación:</strong> Opera múltiples estrategias y mercados simultáneamente</li>
        </ul>
        
        <h3>Primeros Pasos</h3>
        <p>Para comenzar en el trading algorítmico necesitas:</p>
        <ol>
          <li>Conocimientos básicos de trading y mercados financieros</li>
          <li>Fundamentos de programación (Python es el lenguaje más popular)</li>
          <li>Una plataforma de backtesting (MetaTrader, QuantConnect, Backtrader)</li>
          <li>Comprensión de análisis técnico y gestión de riesgo</li>
        </ol>
        
        <h3>Herramientas Esenciales</h3>
        <p><strong>Python:</strong> El lenguaje más utilizado por su simplicidad y potentes librerías como Pandas, NumPy y TA-Lib.</p>
        <p><strong>MetaTrader 4/5:</strong> Plataformas populares con soporte para automatización mediante MQL.</p>
        <p><strong>Jupyter Notebooks:</strong> Ideales para desarrollo, análisis y documentación de estrategias.</p>
        
        <h3>Tu Primera Estrategia</h3>
        <p>Comienza con estrategias simples basadas en indicadores técnicos conocidos. Una estrategia de cruce de medias móviles es un excelente punto de partida. Aprende a codificarla, backtestearla y optimizarla antes de pasar a estrategias más complejas.</p>
        
        <h3>Conclusión</h3>
        <p>El trading algorítmico ofrece oportunidades increíbles, pero requiere dedicación para aprender. Comienza con lo básico, practica con datos históricos y nunca arriesgues capital real hasta que tu estrategia haya demostrado ser consistente en backtesting.</p>
      `,
      en: `
        <h2>Introduction to Algorithmic Trading</h2>
        <p>Algorithmic trading has revolutionized how we operate in financial markets. In this comprehensive guide, you'll learn the essential fundamentals to start your journey in automated trading.</p>
        
        <h3>What is Algorithmic Trading?</h3>
        <p>Algorithmic trading is the automatic execution of operations in financial markets through computer programs that follow a predefined set of instructions (algorithm). These algorithms can analyze market data, identify trading opportunities, and execute operations without human intervention.</p>
        
        <h3>Advantages of Algorithmic Trading</h3>
        <ul>
          <li><strong>Speed:</strong> Algorithms can analyze data and execute trades in milliseconds</li>
          <li><strong>Precision:</strong> Eliminates human errors in order execution</li>
          <li><strong>Discipline:</strong> Follows the trading plan without emotions</li>
          <li><strong>Backtesting:</strong> Test strategies with historical data before risking real capital</li>
          <li><strong>Diversification:</strong> Operate multiple strategies and markets simultaneously</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>To begin in algorithmic trading you need:</p>
        <ol>
          <li>Basic knowledge of trading and financial markets</li>
          <li>Programming fundamentals (Python is the most popular language)</li>
          <li>A backtesting platform (MetaTrader, QuantConnect, Backtrader)</li>
          <li>Understanding of technical analysis and risk management</li>
        </ol>
        
        <h3>Essential Tools</h3>
        <p><strong>Python:</strong> The most used language for its simplicity and powerful libraries like Pandas, NumPy, and TA-Lib.</p>
        <p><strong>MetaTrader 4/5:</strong> Popular platforms with automation support through MQL.</p>
        <p><strong>Jupyter Notebooks:</strong> Ideal for development, analysis, and strategy documentation.</p>
        
        <h3>Your First Strategy</h3>
        <p>Start with simple strategies based on known technical indicators. A moving average crossover strategy is an excellent starting point. Learn to code it, backtest it, and optimize it before moving to more complex strategies.</p>
        
        <h3>Conclusion</h3>
        <p>Algorithmic trading offers incredible opportunities but requires dedication to learn. Start with the basics, practice with historical data, and never risk real capital until your strategy has proven consistent in backtesting.</p>
      `
    }
  },
  '2': {
    title: {
      es: 'Python vs R: ¿Cuál es Mejor para Trading?',
      en: 'Python vs R: Which is Better for Trading?'
    },
    excerpt: {
      es: 'Comparativa detallada entre Python y R para análisis cuantitativo y desarrollo de estrategias.',
      en: 'Detailed comparison between Python and R for quantitative analysis and strategy development.'
    },
    author: 'Ana García',
    date: '2025-12-08',
    category: 'Herramientas',
    readTime: '6 min',
    image: '🐍',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop',
    learningPoints: {
      es: [
        'Comparación exhaustiva entre Python y R',
        'Librerías esenciales para trading cuantitativo',
        'Casos de uso específicos para cada lenguaje',
        'Rendimiento y ecosistema de herramientas'
      ],
      en: [
        'Comprehensive comparison between Python and R',
        'Essential libraries for quantitative trading',
        'Specific use cases for each language',
        'Performance and tool ecosystem'
      ]
    },
    content: {
      es: `<h2>Python para Trading: Librerías Esenciales</h2>
        <p>Python se ha convertido en el lenguaje de programación preferido para trading algorítmico. Descubre las librerías más importantes que todo trader cuantitativo debe conocer.</p>`,
      en: `<h2>Python for Trading: Essential Libraries</h2>
        <p>Python has become the preferred programming language for algorithmic trading. Discover the most important libraries every quantitative trader should know.</p>`
    }
  },
  '3': {
    title: {
      es: 'Machine Learning en Trading: Casos Reales',
      en: 'Machine Learning in Trading: Real Cases'
    },
    excerpt: {
      es: 'Exploramos 5 casos de uso reales de ML en trading algorítmico con ejemplos de código.',
      en: 'We explore 5 real use cases of ML in algorithmic trading with code examples.'
    },
    author: 'Roberto Silva',
    date: '2025-12-05',
    category: 'Machine Learning',
    readTime: '12 min',
    image: '🤖',
    coverImage: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=600&fit=crop',
    learningPoints: {
      es: [
        'Aplicaciones prácticas de Machine Learning en trading',
        'Modelos de predicción de precios y clasificación',
        'Gestión de features y overfitting',
        'Estrategias basadas en redes neuronales'
      ],
      en: [
        'Practical applications of Machine Learning in trading',
        'Price prediction and classification models',
        'Feature management and overfitting',
        'Neural network-based strategies'
      ]
    },
    content: {
      es: `<h2>Machine Learning aplicado al Trading</h2>
        <p>El aprendizaje automático está transformando el trading cuantitativo. Aprende cómo aplicar técnicas de ML para mejorar tus estrategias de trading.</p>`,
      en: `<h2>Machine Learning Applied to Trading</h2>
        <p>Machine learning is transforming quantitative trading. Learn how to apply ML techniques to improve your trading strategies.</p>`
    }
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { language } = useLanguage();
  
  const post = blogPosts[postId as keyof typeof blogPosts];
  
  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'es' ? 'Artículo no encontrado' : 'Article not found'}
            </h1>
            <Link href="/blog">
              <Button>{language === 'es' ? 'Volver al Blog' : 'Back to Blog'}</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const title = post.title[language as keyof typeof post.title] || post.title.es;
  const excerpt = post.excerpt[language as keyof typeof post.excerpt] || post.excerpt.es;
  const content = post.content[language as keyof typeof post.content] || post.content.es;
  const learningPoints = post.learningPoints?.[language as keyof typeof post.learningPoints] || post.learningPoints?.es || [];
  const tableOfContents = post.tableOfContents?.[language as keyof typeof post.tableOfContents] || post.tableOfContents?.es || [];

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
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
              <Image
                src={post.coverImage}
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
                {/* Learning Points */}
                {learningPoints.length > 0 && (
                  <Card className="border-profit/20 bg-profit/5">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-profit" />
                        <CardTitle className="text-lg">
                          {language === 'es' ? '¿Qué aprenderás?' : 'What will you learn?'}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {learningPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <Card className="border-border/40">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="h-5 w-5 text-profit" />
                        <CardTitle className="text-lg">
                          {language === 'es' ? 'Contenido' : 'Contents'}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tableOfContents.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground hover:text-profit transition-colors cursor-pointer">
                            {index + 1}. {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

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
              {Object.entries(blogPosts)
                .filter(([id]) => id !== postId)
                .slice(0, 2)
                .map(([id, relatedPost]) => {
                  const relatedTitle = relatedPost.title[language as keyof typeof relatedPost.title] || relatedPost.title.es;
                  const relatedExcerpt = relatedPost.excerpt[language as keyof typeof relatedPost.excerpt] || relatedPost.excerpt.es;
                  
                  return (
                    <Card key={id} className="border-border/40 hover:border-profit/40 transition-all group">
                      <CardHeader>
                        <div className="text-4xl mb-4">{relatedPost.image}</div>
                        <Badge className="mb-2 w-fit bg-profit/10 text-profit border-profit/20">
                          {relatedPost.category}
                        </Badge>
                        <CardTitle className="text-xl group-hover:text-profit transition-colors">
                          {relatedTitle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{relatedExcerpt}</p>
                        <Link href={`/blog/${id}`}>
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

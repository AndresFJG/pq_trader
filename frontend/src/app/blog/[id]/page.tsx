'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { Calendar, Clock, User, ArrowLeft, Share2, BookmarkPlus, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const blogPosts = {
  '1': {
    titleKey: 'blogPage.posts.post1.title',
    excerptKey: 'blogPage.posts.post1.excerpt',
    authorKey: 'blogPage.posts.post1.author',
    date: '2025-12-10',
    category: 'Principiantes',
    readTime: '8 min',
    image: '📚',
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
    titleKey: 'blogPage.posts.post2.title',
    excerptKey: 'blogPage.posts.post2.excerpt',
    authorKey: 'blogPage.posts.post2.author',
    date: '2025-12-08',
    category: 'Herramientas',
    readTime: '6 min',
    image: '🐍',
    content: {
      es: `<h2>Python para Trading: Librerías Esenciales</h2>
        <p>Python se ha convertido en el lenguaje de programación preferido para trading algorítmico. Descubre las librerías más importantes que todo trader cuantitativo debe conocer.</p>`,
      en: `<h2>Python for Trading: Essential Libraries</h2>
        <p>Python has become the preferred programming language for algorithmic trading. Discover the most important libraries every quantitative trader should know.</p>`
    }
  },
  '3': {
    titleKey: 'blogPage.posts.post3.title',
    excerptKey: 'blogPage.posts.post3.excerpt',
    authorKey: 'blogPage.posts.post3.author',
    date: '2025-12-05',
    category: 'Machine Learning',
    readTime: '12 min',
    image: '🤖',
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
            <h1 className="text-4xl font-bold mb-4">Artículo no encontrado</h1>
            <Link href="/blog">
              <Button>Volver al Blog</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const content = post.content[language as keyof typeof post.content] || post.content.es;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Article Header */}
      <article className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
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
            <span className="text-foreground">Artículo</span>
          </nav>

          {/* Post Meta */}
          <div className="mb-8">
            <Badge className="mb-4 bg-profit/10 text-profit border-profit/20">
              {post.category}
            </Badge>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
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
                <span>PQ Trader Team</span>
              </div>
            </div>
          </div>

          {/* Content */}
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

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === 'es' ? 'Volver al Blog' : 'Back to Blog'}
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'es' ? 'Artículos Relacionados' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(blogPosts).slice(0, 2).map(([id, relatedPost]) => (
                id !== postId && (
                  <Card key={id} className="border-border/40 hover:border-profit/40 transition-all">
                    <CardHeader>
                      <div className="text-4xl mb-4">{relatedPost.image}</div>
                      <Badge className="mb-2 w-fit bg-profit/10 text-profit border-profit/20">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-xl">{relatedPost.titleKey}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/blog/${id}`}>
                        <Button variant="outline" className="w-full">
                          {language === 'es' ? 'Leer más' : 'Read more'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </section>
        </div>
      </article>
      
      <Footer />
    </main>
  );
}

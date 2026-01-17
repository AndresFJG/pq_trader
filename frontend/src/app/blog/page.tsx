'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { Calendar, Clock, User, ArrowRight, Users, Trophy, BookOpen, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const { t, language, translations } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showSkoolModal, setShowSkoolModal] = useState(false);
  
  const posts = [
    {
      id: '1',
      titleKey: 'blogPage.posts.post1.title',
      excerptKey: 'blogPage.posts.post1.excerpt',
      authorKey: 'blogPage.posts.post1.author',
      date: '2025-12-10',
      category: 'Principiantes',
      readTime: '8 min',
      image: '📚',
    },
    {
      id: '2',
      titleKey: 'blogPage.posts.post2.title',
      excerptKey: 'blogPage.posts.post2.excerpt',
      authorKey: 'blogPage.posts.post2.author',
      date: '2025-12-08',
      category: 'Herramientas',
      readTime: '6 min',
      image: '🐍',
    },
    {
      id: '3',
      titleKey: 'blogPage.posts.post3.title',
      excerptKey: 'blogPage.posts.post3.excerpt',
      authorKey: 'blogPage.posts.post3.author',
      date: '2025-12-05',
      category: 'Machine Learning',
      readTime: '12 min',
      image: '🤖',
    },
    {
      id: '4',
      titleKey: 'blogPage.posts.post4.title',
      excerptKey: 'blogPage.posts.post4.excerpt',
      authorKey: 'blogPage.posts.post4.author',
      date: '2025-12-03',
      category: 'Risk Management',
      readTime: '10 min',
      image: '🛡️',
    },
    {
      id: '5',
      titleKey: 'blogPage.posts.post5.title',
      excerptKey: 'blogPage.posts.post5.excerpt',
      authorKey: 'blogPage.posts.post5.author',
      date: '2025-12-01',
      category: 'Backtesting',
      readTime: '9 min',
      image: '📊',
    },
    {
      id: '6',
      titleKey: 'blogPage.posts.post6.title',
      excerptKey: 'blogPage.posts.post6.excerpt',
      authorKey: 'blogPage.posts.post6.author',
      date: '2025-11-28',
      category: 'APIs',
      readTime: '15 min',
      image: '🔌',
    },
  ];
  
  const categories = [
    t('blogPage.categories.all'),
    t('blogPage.categories.beginners'),
    t('blogPage.categories.ml'),
    t('blogPage.categories.risk'),
    t('blogPage.categories.tools'),
    t('blogPage.categories.apis')
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <Badge className="mb-6 bg-profit/10 text-profit border-profit/20">
            {t('blogPage.hero.badge')}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('blogPage.hero.title')} <span className="text-profit">{t('blogPage.hero.titleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('blogPage.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-profit text-background'
                    : 'bg-surface/50 text-muted-foreground hover:text-profit hover:bg-profit/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Skool Community Highlight */}
      <section className="py-16 px-4 bg-gradient-to-br from-profit/5 via-background to-background">
        <div className="container mx-auto max-w-7xl">
          <Card className="border-2 border-profit/40 bg-gradient-to-br from-background/80 to-background shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-profit/10 text-profit px-4 py-2 rounded-full w-fit mb-6">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-bold">{t('blogPage.skool.title')}</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {t('blogPage.posts.skoolPost.title')}
                </h2>

                <p className="text-lg text-muted-foreground mb-6">
                  {t('blogPage.posts.skoolPost.excerpt')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setShowSkoolModal(true)}
                    className="bg-gradient-to-r from-profit to-profit/90 hover:from-profit/90 hover:to-profit group"
                  >
                    {t('blogPage.skool.cta.learnMore')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-profit/40 hover:bg-profit/10"
                    asChild
                  >
                    <a href="https://skool.com" target="_blank" rel="noopener noreferrer">
                      {t('blogPage.skool.cta.join')}
                    </a>
                  </Button>
                </div>
              </div>

              {/* Right Side - Features Grid */}
              <div className="bg-gradient-to-br from-profit/10 to-background/50 p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-background/80 rounded-xl border border-profit/20">
                    <BookOpen className="h-8 w-8 text-profit mx-auto mb-2" />
                    <p className="text-sm font-bold text-foreground mb-1">
                      {language === 'es' ? '4 Cursos' : '4 Courses'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Completos' : 'Complete'}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-background/80 rounded-xl border border-profit/20">
                    <Users className="h-8 w-8 text-profit mx-auto mb-2" />
                    <p className="text-sm font-bold text-foreground mb-1">
                      {language === 'es' ? 'Comunidad' : 'Community'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Activa 24/7' : 'Active 24/7'}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-background/80 rounded-xl border border-profit/20">
                    <Trophy className="h-8 w-8 text-profit mx-auto mb-2" />
                    <p className="text-sm font-bold text-foreground mb-1">
                      {language === 'es' ? 'Torneos' : 'Tournaments'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Mensuales' : 'Monthly'}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-background/80 rounded-xl border border-profit/20">
                    <Zap className="h-8 w-8 text-profit mx-auto mb-2" />
                    <p className="text-sm font-bold text-foreground mb-1">
                      {language === 'es' ? 'Mentorías' : 'Mentorships'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? '1 a 1' : '1-on-1'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Skool Details Modal */}
      {showSkoolModal && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-profit/40">
            <CardHeader className="border-b border-border/40 sticky top-0 bg-background z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{t('blogPage.skool.title')}</CardTitle>
                <button
                  onClick={() => setShowSkoolModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-loss/10 flex items-center justify-center transition-colors"
                >
                  <span className="text-2xl text-muted-foreground hover:text-loss">×</span>
                </button>
              </div>
              <p className="text-muted-foreground text-sm">{t('blogPage.skool.subtitle')}</p>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Pillars */}
              <div className="space-y-6">
                {['academic', 'resources', 'interaction', 'gamification', 'premium'].map((pillar) => (
                  <div key={pillar} className="border border-border/40 rounded-xl p-6 bg-surface/30">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(`blogPage.skool.pillars.${pillar}.title`)}
                    </h3>
                    <p className="text-sm text-profit mb-4">
                      {t(`blogPage.skool.pillars.${pillar}.subtitle`)}
                    </p>
                    <ul className="space-y-2">
                      {translations.blogPage.skool.pillars[pillar as keyof typeof translations.blogPage.skool.pillars].items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-profit mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Membership Levels */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">{t('blogPage.skool.levels.title')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {['free', 'premium', 'vip'].map((level) => {
                    const levelData = translations.blogPage.skool.levels[level as 'free' | 'premium' | 'vip'];
                    return (
                      <Card key={level} className={`${level === 'premium' ? 'border-2 border-profit' : ''}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-lg">{levelData.title}</CardTitle>
                            <Badge className={level === 'vip' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : level === 'premium' ? 'bg-profit' : 'bg-muted'}>
                              {level === 'vip' && <Crown className="h-3 w-3 mr-1" />}
                              {levelData.badge}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {levelData.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="text-profit mt-0.5">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4 justify-center pt-6 border-t border-border/40">
                <Button
                  className="bg-gradient-to-r from-profit to-profit/90"
                  asChild
                >
                  <a href="https://skool.com" target="_blank" rel="noopener noreferrer">
                    {t('blogPage.skool.cta.join')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Post */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('blogPage.featured.title')}</h2>
            <p className="text-muted-foreground">{t('blogPage.featured.subtitle')}</p>
          </div>

          <Card className="group hover:border-profit/40 transition-all overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-profit/20 to-background flex items-center justify-center p-12">
                <span className="text-9xl">{posts[0].image}</span>
              </div>
              
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-profit/10 text-profit text-xs font-bold px-3 py-1 rounded-full">
                    {posts[0].category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(posts[0].date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{posts[0].readTime}</span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-profit transition-colors">
                  {t(posts[0].titleKey)}
                </h3>

                <p className="text-muted-foreground mb-6 text-lg">
                  {t(posts[0].excerptKey)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t(posts[0].authorKey)}</span>
                  </div>

                  <Link 
                    href={`/blog/${posts[0].id}`}
                    className="flex items-center gap-2 text-profit font-semibold hover:gap-3 transition-all"
                  >
                    {t('blogPage.post.readMore')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('blogPage.latest.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <Card key={post.id} className="group hover:border-profit/40 transition-all">
                <div className="bg-gradient-to-br from-profit/10 to-background flex items-center justify-center p-12 rounded-t-lg">
                  <span className="text-6xl">{post.image}</span>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-profit/10 text-profit text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <CardTitle className="group-hover:text-profit transition-colors line-clamp-2">
                    {t(post.titleKey)}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {t(post.excerptKey)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{t(post.authorKey)}</span>
                    </div>

                    <Link 
                      href={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-xs text-profit font-semibold hover:gap-2 transition-all"
                    >
                      {t('blogPage.post.readMore')}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

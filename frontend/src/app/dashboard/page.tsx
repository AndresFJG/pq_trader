'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  BarChart3,
  Target,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-profit" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              ¡Hola, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Continúa tu camino hacia el éxito en trading algorítmico
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border/40 hover:border-profit/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cursos Activos
                </CardTitle>
                <BookOpen className="h-4 w-4 text-profit" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ningún curso en progreso
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:border-profit/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Próxima Mentoría
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sin mentorías programadas
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:border-profit/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Progreso Total
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Comienza tu primer curso
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:border-profit/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Certificados
                </CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Completa cursos para obtenerlos
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-profit" />
                    Continuar Aprendiendo
                  </CardTitle>
                  <CardDescription>
                    Retoma donde lo dejaste
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tienes cursos activos</h3>
                    <p className="text-muted-foreground mb-4">
                      Explora nuestro catálogo y comienza tu viaje de aprendizaje
                    </p>
                    <Link href="/cursos">
                      <Button variant="profit">
                        Explorar Cursos
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Cursos Recomendados
                  </CardTitle>
                  <CardDescription>
                    Basado en tus intereses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Course Item */}
                    <Link href="/cursos">
                      <div className="flex gap-4 p-4 rounded-lg border border-border/40 hover:border-profit/50 transition-colors cursor-pointer group">
                        <div className="w-20 h-20 bg-gradient-to-br from-profit/20 to-profit/5 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-8 w-8 text-profit" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold group-hover:text-profit transition-colors mb-1">
                            Trading para Principiantes
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Aprende los fundamentos del trading desde cero
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            8 semanas
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">Principiante</Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-profit transition-colors" />
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Subscription Card */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">Mi Suscripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Plan Actual</span>
                        <Badge variant="secondary" className="text-xs">
                          {user.subscriptionTier || 'Free'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mejora tu plan para acceder a contenido exclusivo
                      </p>
                    </div>
                    <Link href="/pricing">
                      <Button className="w-full" variant="outline">
                        Ver Planes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Goals */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-profit" />
                    Metas de Aprendizaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Horas esta semana</span>
                        <span className="text-sm text-muted-foreground">0 / 5h</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Lecciones completadas</span>
                        <span className="text-sm text-muted-foreground">0 / 10</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Establece metas semanales para mantener tu progreso constante
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/mentorias">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Reservar Mentoría
                    </Button>
                  </Link>
                  <Link href="/portafolios">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Ver Portafolios
                    </Button>
                  </Link>
                  <Link href="/cursos">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Explorar Cursos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

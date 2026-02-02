'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Session {
  id: number;
  title: string;
  description: string;
  session_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_participants: number;
  current_participants: number;
  status: string;
}

interface Mentorship {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
}

export default function MentorshipBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const mentorshipId = params.id as string;

  const [mentorship, setMentorship] = useState<Mentorship | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [mentorshipRes, sessionsRes] = await Promise.all([
        api.get(`/mentorships/${mentorshipId}`),
        api.get(`/mentorships/${mentorshipId}/sessions?status=available`),
      ]);

      if (mentorshipRes.data.success) {
        setMentorship(mentorshipRes.data.data);
      }

      if (sessionsRes.data.success) {
        // Filtrar solo sesiones futuras
        const futureSessions = sessionsRes.data.data.filter((s: Session) => {
          const sessionDate = new Date(`${s.session_date}T${s.start_time}`);
          return sessionDate > new Date();
        });
        setSessions(futureSessions);
      }
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [mentorshipId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      router.push('/login');
      return;
    }

    if (!selectedSession) return;

    setIsBooking(true);
    try {
      await api.post(`/mentorships/sessions/${selectedSession.id}/book`, {
        notes: bookingNotes,
      });

      toast.success('¡Reserva confirmada!');
      setSelectedSession(null);
      setBookingNotes('');
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al reservar';
      toast.error(message);
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit"></div>
        </div>
      </div>
    );
  }

  if (!mentorship) {
    return (
      <div>
        <Navbar />
        <div className="text-center py-12">
          <p>Mentoría no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {/* Mentorship Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  {mentorship.title}
                </CardTitle>
                <Badge>{mentorship.category}</Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-profit">
                  ${mentorship.price}
                </div>
                <div className="text-sm text-muted-foreground">por sesión</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{mentorship.description}</p>
          </CardContent>
        </Card>

        {/* Available Sessions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Horarios Disponibles</h2>

          {sessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay sesiones disponibles
                </h3>
                <p className="text-muted-foreground">
                  Vuelve pronto para ver nuevos horarios
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => {
                const availableSpots =
                  session.max_participants - session.current_participants;

                return (
                  <Card
                    key={session.id}
                    className="hover:border-profit/50 transition"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {session.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(session.session_date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {session.start_time} - {session.end_time}
                          </span>
                          <span className="text-muted-foreground">
                            ({session.duration_minutes} min)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {availableSpots}{' '}
                            {availableSpots === 1 ? 'espacio' : 'espacios'}{' '}
                            disponible{availableSpots !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-profit hover:bg-profit/90"
                        onClick={() => setSelectedSession(session)}
                      >
                        Reservar Sesión
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <div className="space-y-3 mt-4">
                  <div>
                    <strong>{selectedSession.title}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedSession.session_date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {selectedSession.start_time} - {selectedSession.end_time}
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium">
                      Notas opcionales
                    </label>
                    <Textarea
                      placeholder="¿Algo específico que quieras tratar?"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isBooking}
              onClick={() => setSelectedSession(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBooking}
              disabled={isBooking}
              className="bg-profit hover:bg-profit/90"
            >
              {isBooking ? 'Reservando...' : 'Confirmar Reserva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

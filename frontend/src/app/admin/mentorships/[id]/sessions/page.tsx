'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  Users,
  Video
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { SessionFormDialog } from '@/components/admin/mentorships/SessionFormDialog';

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
  meeting_link?: string;
  status: string;
}

export default function MentorshipSessionsPage() {
  const params = useParams();
  const mentorshipId = params.id as string;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | undefined>();

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/mentorships/${mentorshipId}/sessions`);
      if (res.data.success) {
        setSessions(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Error al cargar sesiones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [mentorshipId]);

  const handleCreate = () => {
    setEditingSession(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  const handleDelete = async (sessionId: number) => {
    if (!confirm('¿Eliminar esta sesión?')) return;

    try {
      await api.delete(`/mentorships/${mentorshipId}/sessions/${sessionId}`);
      toast.success('Sesión eliminada');
      fetchSessions();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-500',
      booked: 'bg-blue-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/mentorships">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mentorías
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sesiones de Mentoría</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona los horarios disponibles
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-profit hover:bg-profit/90">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sesión
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sesiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'available').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reservadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => s.status === 'booked').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Sesiones</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay sesiones</h3>
              <p className="text-muted-foreground mb-4">
                Crea espacios en el calendario para que los usuarios reserven
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Sesión
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:border-profit/50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{session.title}</h4>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {session.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(session.session_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.start_time} - {session.end_time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.current_participants}/{session.max_participants}
                      </div>
                      {session.meeting_link && (
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Link configurado
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SessionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mentorshipId={mentorshipId}
        session={editingSession}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchSessions();
        }}
      />
    </div>
  );
}

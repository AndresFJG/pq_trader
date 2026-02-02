'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import axios from 'axios';

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function MentorDashboard() {
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [unavailability, setUnavailability] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showUnavailabilityDialog, setShowUnavailabilityDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    start_time: '09:00',
    end_time: '17:00',
    break_start: '12:00',
    break_end: '13:00',
    session_duration_minutes: 60,
    max_sessions_per_day: 5
  });
  const [unavailabilityData, setUnavailabilityData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [bookingsRes, schedulesRes, unavailabilityRes] = await Promise.all([
        axios.get('/api/mentorship-bookings/my-bookings', { headers }),
        axios.get('/api/mentor-schedules/schedules', { headers }),
        axios.get('/api/mentor-schedules/unavailability', { headers })
      ]);

      setBookings(bookingsRes.data.data);
      setSchedules(schedulesRes.data.data);
      setUnavailability(unavailabilityRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveSchedule = async () => {
    if (selectedDay === null) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('/api/mentor-schedules/schedules', {
        day_of_week: selectedDay,
        ...formData
      }, { headers });

      fetchData();
      setShowScheduleDialog(false);
      setSelectedDay(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleAddUnavailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('/api/mentor-schedules/unavailability', 
        unavailabilityData, 
        { headers }
      );

      fetchData();
      setShowUnavailabilityDialog(false);
      setUnavailabilityData({ start_date: '', end_date: '', reason: '' });
    } catch (error) {
      console.error('Error adding unavailability:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`/api/mentorship-bookings/${bookingId}`, { headers });
      fetchData();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-profit/20 text-profit';
      case 'canceled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {language === 'es' ? 'Panel de Mentor' : 'Mentor Dashboard'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'es' 
                ? 'Gestiona tus reservas, horarios y disponibilidad'
                : 'Manage your bookings, schedules and availability'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'bookings'
                  ? 'text-profit border-b-2 border-profit'
                  : 'text-muted-foreground'
              }`}
            >
              {language === 'es' ? 'Reservas' : 'Bookings'}
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'schedule'
                  ? 'text-profit border-b-2 border-profit'
                  : 'text-muted-foreground'
              }`}
            >
              {language === 'es' ? 'Horarios' : 'Schedule'}
            </button>
            <button
              onClick={() => setActiveTab('unavailability')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'unavailability'
                  ? 'text-profit border-b-2 border-profit'
                  : 'text-muted-foreground'
              }`}
            >
              {language === 'es' ? 'No disponible' : 'Unavailable'}
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <Card className="border-border/40">
                    <CardContent className="pt-12 pb-12 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        {language === 'es' 
                          ? 'No hay reservas programadas'
                          : 'No bookings scheduled'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  bookings.map((booking: Record<string, unknown>) => (
                    <Card key={booking.id as string} className="border-border/40 hover:border-profit/40 transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {booking.title as string}
                              </h3>
                              <Badge className={getStatusColor(booking.status as string)}>
                                {booking.status as string}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{booking.description as string}</p>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-profit" />
                                <span className="text-sm">
                                  {new Date(booking.scheduled_at as string).toLocaleDateString(
                                    language === 'es' ? 'es-ES' : 'en-US'
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-profit" />
                                <span className="text-sm">{booking.time_slot_start as string}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-profit" />
                                <span className="text-sm">{(booking.student as Record<string, unknown>)?.name as string || 'Student'}</span>
                              </div>
                            </div>
                          </div>
                          {booking.status === 'scheduled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id as string)}
                              className="text-red-400 hover:text-red-300"
                            >
                              {/* Removed XCircle icon since not imported */}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    setSelectedDay(null);
                    setShowScheduleDialog(true);
                  }}
                  className="bg-profit hover:bg-profit/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'es' ? 'Agregar Horario' : 'Add Schedule'}
                </Button>

                <div className="grid gap-4">
                  {DAYS_OF_WEEK.map((day, index) => {
                    const daySchedule = schedules.find((s: Record<string, unknown>) => (s.day_of_week as number) === index);
                    return (
                      <Card 
                        key={index} 
                        className={`border-border/40 ${!daySchedule?.is_active ? 'opacity-50' : ''}`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                {language === 'es' 
                                  ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][index]
                                  : day}
                              </h3>
                              {daySchedule ? (
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>{daySchedule.start_time as string} - {daySchedule.end_time as string}</p>
                                  {daySchedule.break_start && (
                                    <p>{language === 'es' ? 'Descanso: ' : 'Break: '}{daySchedule.break_start as string} - {daySchedule.break_end as string}</p>
                                  )}
                                  <p>{daySchedule.session_duration_minutes as number} {language === 'es' ? 'min por sesión' : 'min per session'}</p>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  {language === 'es' ? 'No configurado' : 'Not configured'}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDay(index);
                                if (daySchedule) {
                                  setFormData({
                                    start_time: daySchedule.start_time as string,
                                    end_time: daySchedule.end_time as string,
                                    break_start: (daySchedule.break_start as string) || '12:00',
                                    break_end: (daySchedule.break_end as string) || '13:00',
                                    session_duration_minutes: daySchedule.session_duration_minutes as number,
                                    max_sessions_per_day: daySchedule.max_sessions_per_day as number
                                  });
                                }
                                setShowScheduleDialog(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unavailability Tab */}
            {activeTab === 'unavailability' && (
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowUnavailabilityDialog(true)}
                  className="bg-profit hover:bg-profit/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'es' ? 'Agregar No Disponible' : 'Add Unavailable'}
                </Button>

                {unavailability.length === 0 ? (
                  <Card className="border-border/40">
                    <CardContent className="pt-12 pb-12 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        {language === 'es' 
                          ? 'No hay períodos no disponibles'
                          : 'No unavailable periods'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {unavailability.map((period: Record<string, unknown>) => (
                      <Card key={period.id as string} className="border-border/40">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground mb-1">
                                {new Date(period.start_date as string).toLocaleDateString(
                                  language === 'es' ? 'es-ES' : 'en-US'
                                )} - {new Date(period.end_date as string).toLocaleDateString(
                                  language === 'es' ? 'es-ES' : 'en-US'
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">{period.reason as string}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('token');
                                  await axios.delete(
                                    `/api/mentor-schedules/unavailability/${period.id}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  fetchData();
                                } catch (error) {
                                  console.error('Error removing unavailability:', error);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'es' ? 'Configurar Horario' : 'Configure Schedule'}
            </DialogTitle>
            <DialogDescription>
              {selectedDay !== null && (
                `${language === 'es' 
                  ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][selectedDay]
                  : DAYS_OF_WEEK[selectedDay]}`
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {language === 'es' ? 'Hora Inicio' : 'Start Time'}
                </label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {language === 'es' ? 'Hora Fin' : 'End Time'}
                </label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {language === 'es' ? 'Descanso Inicio' : 'Break Start'}
                </label>
                <input
                  type="time"
                  value={formData.break_start}
                  onChange={(e) => setFormData({ ...formData, break_start: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">
                  {language === 'es' ? 'Descanso Fin' : 'Break End'}
                </label>
                <input
                  type="time"
                  value={formData.break_end}
                  onChange={(e) => setFormData({ ...formData, break_end: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">
                {language === 'es' ? 'Duración Sesión (min)' : 'Session Duration (min)'}
              </label>
              <input
                type="number"
                value={formData.session_duration_minutes}
                onChange={(e) => setFormData({ ...formData, session_duration_minutes: parseInt(e.target.value) })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowScheduleDialog(false)}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                className="flex-1 bg-profit hover:bg-profit/90"
                onClick={handleSaveSchedule}
              >
                {language === 'es' ? 'Guardar' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unavailability Dialog */}
      <Dialog open={showUnavailabilityDialog} onOpenChange={setShowUnavailabilityDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'es' ? 'Agregar No Disponible' : 'Add Unavailable Period'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">
                {language === 'es' ? 'Fecha Inicio' : 'Start Date'}
              </label>
              <input
                type="date"
                value={unavailabilityData.start_date}
                onChange={(e) => setUnavailabilityData({ ...unavailabilityData, start_date: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">
                {language === 'es' ? 'Fecha Fin' : 'End Date'}
              </label>
              <input
                type="date"
                value={unavailabilityData.end_date}
                onChange={(e) => setUnavailabilityData({ ...unavailabilityData, end_date: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">
                {language === 'es' ? 'Motivo' : 'Reason'}
              </label>
              <input
                type="text"
                placeholder={language === 'es' ? 'Ej: Vacaciones' : 'E.g: Vacation'}
                value={unavailabilityData.reason}
                onChange={(e) => setUnavailabilityData({ ...unavailabilityData, reason: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border/40 rounded-lg text-foreground"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowUnavailabilityDialog(false)}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                className="flex-1 bg-profit hover:bg-profit/90"
                onClick={handleAddUnavailability}
              >
                {language === 'es' ? 'Agregar' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Loader2, Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MentorshipFormDialog } from './MentorshipFormDialog';
import { MentorshipViewDialog } from './MentorshipViewDialog';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Mentorship {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  mentor_id: string;
  status: string;
  created_at: string;
}

const fetcher = (url: string) => api.get(url).then((res: any) => res.data.data);

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  full: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

interface MentorshipsTableProps {
  searchQuery: string;
}

export function MentorshipsTable({ searchQuery }: MentorshipsTableProps) {
  const [editingMentorship, setEditingMentorship] = useState<Mentorship | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingMentorship, setViewingMentorship] = useState<Mentorship | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: mentorships, error, isLoading, mutate } = useSWR<Mentorship[]>('/mentorships', fetcher);

  const filteredMentorships = mentorships?.filter((mentorship) =>
    mentorship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentorship.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleEdit = (mentorship: Mentorship) => {
    setEditingMentorship(mentorship);
    setIsEditDialogOpen(true);
  };

  const handleView = (mentorship: Mentorship) => {
    setViewingMentorship(mentorship);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (mentorshipId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta mentoría?')) return;
    
    try {
      await api.delete(`/mentorships/${mentorshipId}`);
      mutate(); // Refresh data
    } catch (error) {
      console.error('Error deleting mentorship:', error);
      alert('Error al eliminar la mentoría');
    }
  };

  const handleSaveSuccess = () => {
    mutate(); // Refresh data after edit
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-profit" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12 text-red-500">
          Error al cargar las mentorías
        </div>
      </Card>
    );
  }

  return (
    <>
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMentorships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron mentorías
                </TableCell>
              </TableRow>
            ) : (
              filteredMentorships.map((mentorship) => (
                <TableRow key={mentorship.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {mentorship.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {mentorship.duration} min
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${mentorship.price}
                  </TableCell>
                  <TableCell>
                    <Badge className={(statusColors as any)[mentorship.status] || statusColors.active}>
                      {mentorship.status?.toUpperCase() || 'ACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(mentorship.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleView(mentorship)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(mentorship)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <Link href={`/admin/mentorships/${mentorship.id}/sessions`}>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Gestionar Sesiones
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(mentorship.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>

    {/* Edit Dialog */}
    <MentorshipFormDialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      mentorship={editingMentorship || undefined}
      onSuccess={handleSaveSuccess}
    />

    {/* View Dialog */}
    <MentorshipViewDialog
      open={isViewDialogOpen}
      onOpenChange={setIsViewDialogOpen}
      mentorship={viewingMentorship}
    />
    </>
  );
}

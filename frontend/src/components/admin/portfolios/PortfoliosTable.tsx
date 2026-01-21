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
import { MoreHorizontal, Edit, Trash2, Eye, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PortfolioFormDialog } from './PortfolioFormDialog';
import { PortfolioViewDialog } from './PortfolioViewDialog';
import { api } from '@/lib/api';

interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string;
  strategy: string;
  performance: number;
  status: string;
  created_at: string;
}

const fetcher = (url: string) => api.get(url).then((res: any) => res.data.data);

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  archived: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

interface PortfoliosTableProps {
  searchQuery: string;
}

export function PortfoliosTable({ searchQuery }: PortfoliosTableProps) {
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingPortfolio, setViewingPortfolio] = useState<Portfolio | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: portfolios, error, isLoading, mutate } = useSWR<Portfolio[]>('/portfolios', fetcher);

  const filteredPortfolios = portfolios?.filter((portfolio) =>
    portfolio.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    portfolio.strategy?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setIsEditDialogOpen(true);
  };

  const handleView = (portfolio: Portfolio) => {
    setViewingPortfolio(portfolio);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (portfolioId: string) => {
    if (!confirm('¿Estás seguro de eliminar este portafolio?')) return;
    
    try {
      await api.delete(`/portfolios/${portfolioId}`);
      mutate(); // Refresh data
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Error al eliminar el portafolio');
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
          Error al cargar los portafolios
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
              <TableHead>Estrategia</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPortfolios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron portafolios
                </TableCell>
              </TableRow>
            ) : (
              filteredPortfolios.map((portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {portfolio.title}
                  </TableCell>
                  <TableCell>{portfolio.strategy || 'N/A'}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${portfolio.performance >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {portfolio.performance >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {portfolio.performance >= 0 ? '+' : ''}{portfolio.performance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={(statusColors as any)[portfolio.status] || statusColors.active}>
                      {portfolio.status?.toUpperCase() || 'ACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(portfolio.created_at).toLocaleDateString('es-ES', {
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
                        <DropdownMenuItem onClick={() => handleView(portfolio)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(portfolio)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(portfolio.id)}
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
    <PortfolioFormDialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      portfolio={editingPortfolio || undefined}
      onSuccess={handleSaveSuccess}
    />

    {/* View Dialog */}
    <PortfolioViewDialog
      open={isViewDialogOpen}
      onOpenChange={setIsViewDialogOpen}
      portfolio={viewingPortfolio}
    />
    </>
  );
}

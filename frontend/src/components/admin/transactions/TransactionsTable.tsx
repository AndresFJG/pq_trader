'use client';

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
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  stripe_payment_id: string;
  metadata: any;
  created_at: string;
}

const fetcher = (url: string) => api.get(url).then((res: any) => res.data.data);

const statusColors = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

interface TransactionsTableProps {
  searchQuery: string;
}

export function TransactionsTable({ searchQuery }: TransactionsTableProps) {
  const { data: transactions, error, isLoading } = useSWR<Transaction[]>('/transactions', fetcher);

  const filteredTransactions = transactions?.filter((transaction) =>
    transaction.stripe_payment_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.metadata?.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
          Error al cargar las transacciones
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID de Pago</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No se encontraron transacciones
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.stripe_payment_id?.substring(0, 20)}...
                  </TableCell>
                  <TableCell>
                    {transaction.metadata?.product_name || 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={(statusColors as any)[transaction.status] || statusColors.pending}>
                      {transaction.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

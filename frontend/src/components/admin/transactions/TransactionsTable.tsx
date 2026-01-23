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
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  type: string;
  status: string;
  payment_intent_id?: string;
  paypal_order_id?: string;
  paypal_capture_id?: string;
  product_id?: number;
  product_name?: string;
  product_type?: string;
  metadata: any;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: number;
    name: string;
    email: string;
  };
}

const fetcher = (url: string) => api.get(url).then((res: any) => res.data.data);

const statusColors = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
};

interface TransactionsTableProps {
  searchQuery: string;
}

export function TransactionsTable({ searchQuery }: TransactionsTableProps) {
  const { data: transactions, error, isLoading } = useSWR<Transaction[]>(
    '/transactions', 
    fetcher,
    {
      refreshInterval: 5000, // Revalidar cada 5 segundos
      revalidateOnFocus: true,
    }
  );

  const filteredTransactions = transactions?.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    const paymentId = transaction.payment_intent_id || transaction.paypal_order_id || '';
    const productName = transaction.product_name || transaction.metadata?.productName || '';
    const userName = transaction.users?.name || '';
    const userEmail = transaction.users?.email || '';
    
    return paymentId.toLowerCase().includes(searchLower) ||
           productName.toLowerCase().includes(searchLower) ||
           userName.toLowerCase().includes(searchLower) ||
           userEmail.toLowerCase().includes(searchLower) ||
           transaction.type.toLowerCase().includes(searchLower);
  }) || [];

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
              <TableHead>Tipo</TableHead>
              <TableHead>ID de Pago</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron transacciones
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => {
                const paymentId = transaction.payment_intent_id || transaction.paypal_order_id || 'N/A';
                const productName = transaction.product_name || transaction.metadata?.productName || 'Sin información';
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-[200px] truncate">
                      {paymentId.length > 20 ? `${paymentId.substring(0, 20)}...` : paymentId}
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <div className="truncate">{productName}</div>
                      {transaction.product_type && (
                        <div className="text-xs text-muted-foreground">
                          {transaction.product_type === 'course' ? 'Curso' : 
                           transaction.product_type === 'mentorship' ? 'Mentoría' : 
                           transaction.product_type}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.users ? (
                        <div>
                          <div className="font-medium">{transaction.users.name}</div>
                          <div className="text-xs text-muted-foreground">{transaction.users.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">ID: {transaction.user_id}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${transaction.amount.toFixed(2)} {transaction.currency}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

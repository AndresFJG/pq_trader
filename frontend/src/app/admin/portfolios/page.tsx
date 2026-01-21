'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search } from 'lucide-react';
import { PortfoliosTable } from '@/components/admin/portfolios/PortfoliosTable';

export default function PortfoliosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portafolios de Trading
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los portafolios y resultados de trading
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4 mr-2" />
          Subir Portafolio
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar portafolios..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Portfolios Table */}
      <PortfoliosTable searchQuery={searchQuery} />
    </div>
  );
}

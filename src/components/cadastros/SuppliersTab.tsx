import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { SupplierFrontend } from '@/types';

interface SuppliersTabProps {
  onEdit: (supplier: SupplierFrontend) => void;
}

export function SuppliersTab({ onEdit }: SuppliersTabProps) {
  const { suppliers, deleteSupplier, suppliersLoading, refreshSuppliers } =
    useData();
  const [search, setSearch] = useState('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.document.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o fornecedor ${name}?`)) {
      try {
        await deleteSupplier(id);
        toast.success('Fornecedor excluído com sucesso');
      } catch (error) {
        // Error handling is already done in the DataContext
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshSuppliers();
      toast.success('Lista de fornecedores atualizada');
    } catch (error) {
      // Error handling is already done in the DataContext
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      catador: 'bg-success/20 text-success',
      agenciador: 'bg-info/20 text-info',
      empresa: 'bg-warning/20 text-warning',
    };
    return colors[type as keyof typeof colors] || 'bg-muted';
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar fornecedores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={suppliersLoading}
        >
          {suppliersLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {suppliersLoading && filteredSuppliers.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Carregando fornecedores...
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {supplier.name}
                  </h3>
                  <Badge className={getTypeColor(supplier.type)}>
                    {supplier.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {supplier.document}
                </p>
                <p className="text-sm text-muted-foreground">
                  {supplier.email} • {supplier.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {supplier.address}
                </p>
                <p className="mt-1 text-sm font-medium text-accent">
                  Material: {supplier.materialType}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(supplier)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(supplier.id, supplier.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {filteredSuppliers.length === 0 && !suppliersLoading && (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum fornecedor encontrado
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

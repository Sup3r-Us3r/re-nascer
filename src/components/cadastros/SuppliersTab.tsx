import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Supplier } from '@/types';

interface SuppliersTabProps {
  onEdit: (supplier: Supplier) => void;
}

export function SuppliersTab({ onEdit }: SuppliersTabProps) {
  const { suppliers, deleteSupplier } = useData();
  const [search, setSearch] = useState('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.document.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o fornecedor ${name}?`)) {
      deleteSupplier(id);
      toast.success('Fornecedor excluído com sucesso');
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
      </div>

      <div className="space-y-4">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                <Badge className={getTypeColor(supplier.type)}>{supplier.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{supplier.document}</p>
              <p className="text-sm text-muted-foreground">{supplier.email} • {supplier.phone}</p>
              <p className="text-sm text-muted-foreground">{supplier.address}</p>
              <p className="mt-1 text-sm font-medium text-accent">Material: {supplier.materialType}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(supplier)}>
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
        {filteredSuppliers.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">Nenhum fornecedor encontrado</p>
        )}
      </div>
    </Card>
  );
}

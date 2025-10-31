import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { CollectionPoint } from '@/types';

interface CollectionPointsTabProps {
  onEdit: (point: CollectionPoint) => void;
}

export function CollectionPointsTab({ onEdit }: CollectionPointsTabProps) {
  const { collectionPoints, collectionPointsLoading, deleteCollectionPoint } =
    useData();
  const [search, setSearch] = useState('');

  const filteredPoints = collectionPoints.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o ponto de coleta ${name}?`)) {
      try {
        await deleteCollectionPoint(id);
        toast.success('Ponto de coleta excluído com sucesso');
      } catch (error) {
        // Error is already handled by the context
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pontos de coleta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {collectionPointsLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando pontos de coleta...
          </div>
        ) : filteredPoints.length > 0 ? (
          filteredPoints.map((point) => (
            <div
              key={point.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{point.name}</h3>
                <p className="text-sm text-muted-foreground">{point.address}</p>
                <p className="text-sm text-muted-foreground">
                  {point.email} • {point.phone}
                </p>
                <p className="mt-1 text-sm font-medium text-accent">
                  Responsável: {point.responsible}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(point)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(point.id, point.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Nenhum ponto de coleta encontrado
          </p>
        )}
      </div>
    </Card>
  );
}

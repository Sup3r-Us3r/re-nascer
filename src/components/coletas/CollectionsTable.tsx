import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function CollectionsTable() {
  const {
    collections,
    deleteCollection,
    updateCollectionStatus,
    collectionsLoading,
  } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCollections = collections.filter((c) => {
    const matchesSearch =
      c.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta coleta?')) {
      try {
        await deleteCollection(id);
        toast.success('Coleta excluída com sucesso');
      } catch (error) {
        // Error handling is done in the DataContext
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCollectionStatus(
        id,
        status as 'agendado' | 'confirmado' | 'coletado'
      );
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      // Error handling is done in the DataContext
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      agendado: 'bg-warning/20 text-warning',
      confirmado: 'bg-info/20 text-info',
      coletado: 'bg-success/20 text-success',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar coletas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="coletado">Coletado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {collectionsLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Carregando coletas...</p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Nenhuma coleta encontrada
          </p>
        ) : (
          filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {collection.supplierName}
                    </h3>
                    <Badge className={getStatusColor(collection.status)}>
                      {collection.status.charAt(0).toUpperCase() +
                        collection.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{collection.supplierType}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    📅 {new Date(collection.date).toLocaleDateString('pt-BR')}{' '}
                    às {collection.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📍 {collection.location}
                  </p>
                  {collection.productName && (
                    <p className="text-sm text-muted-foreground">
                      🏷️ {collection.productName}
                    </p>
                  )}
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="font-medium text-foreground">
                      ⚖️ {collection.weight} kg
                    </span>
                    <span className="font-medium text-foreground">
                      💰 R$ {collection.value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={collection.status}
                    onValueChange={(value) =>
                      handleStatusChange(collection.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="coletado">Coletado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(collection.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Client } from '@/types';

interface ClientsTabProps {
  onEdit: (client: Client) => void;
}

export function ClientsTab({ onEdit }: ClientsTabProps) {
  const { clients, deleteClient } = useData();
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.document.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o cliente ${name}?`)) {
      deleteClient(id);
      toast.success('Cliente excluído com sucesso');
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.document}</p>
              <p className="text-sm text-muted-foreground">{client.email} • {client.phone}</p>
              <p className="text-sm text-muted-foreground">{client.address}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(client)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDelete(client.id, client.name)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">Nenhum cliente encontrado</p>
        )}
      </div>
    </Card>
  );
}

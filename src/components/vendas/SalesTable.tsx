import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function SalesTable() {
  const { sales, deleteSale } = useData();
  const [search, setSearch] = useState('');

  const filteredSales = sales.filter(
    (s) =>
      s.clientName.toLowerCase().includes(search.toLowerCase()) ||
      s.productType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta venda?')) {
      deleteSale(id);
      toast.success('Venda excluída com sucesso');
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar vendas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredSales.map((sale) => (
          <div
            key={sale.id}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {sale.clientName}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Produto: {sale.productType}
              </p>
              <p className="text-sm text-muted-foreground">
                Data: {new Date(sale.date).toLocaleDateString('pt-BR')}
              </p>
              <div className="mt-2 flex gap-4">
                <span className="text-sm font-medium text-foreground">
                  ⚖️ {sale.weight} kg
                </span>
                <span className="text-sm font-medium text-accent">
                  💰 R$ {sale.value.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(sale.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {filteredSales.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            Nenhuma venda encontrada
          </p>
        )}
      </div>
    </Card>
  );
}

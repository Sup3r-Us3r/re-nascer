import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SalesTable } from '@/components/vendas/SalesTable';
import { SaleDialog } from '@/components/vendas/SaleDialog';
import { Card } from '@/components/ui/card';
import { useData } from '@/hooks/useData';

export default function Vendas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { sales } = useData();

  const totalValue = sales.reduce((sum, sale) => sum + sale.value, 0);
  const totalWeight = sales.reduce((sum, sale) => sum + sale.weight, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Registro de Vendas
        </h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total de Vendas
          </p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">
            {sales.length}
          </h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Peso Total Vendido
          </p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">
            {totalWeight.toFixed(0)} kg
          </h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Valor Total
          </p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">
            R$ {totalValue.toLocaleString('pt-BR')}
          </h3>
        </Card>
      </div>

      <SalesTable />

      <SaleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

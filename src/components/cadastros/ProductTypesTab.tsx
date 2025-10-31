import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { ProductType } from '@/types';

interface ProductTypesTabProps {
  onEdit: (product: ProductType) => void;
}

export function ProductTypesTab({ onEdit }: ProductTypesTabProps) {
  const { productTypes, deleteProductType, productTypesLoading } = useData();
  const [search, setSearch] = useState('');

  const filteredProducts = productTypes.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o tipo de produto ${name}?`)) {
      try {
        await deleteProductType(id);
        toast.success('Tipo de produto excluído com sucesso');
      } catch (error) {
        // Error handling is done in the DataContext
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tipos de produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {productTypesLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Carregando tipos de produto...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Nenhum tipo de produto encontrado
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                <p className="mt-1 text-sm font-medium text-accent">
                  Unidade: {product.unit}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

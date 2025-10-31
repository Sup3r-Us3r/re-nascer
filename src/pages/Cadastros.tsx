import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SuppliersTab } from '@/components/cadastros/SuppliersTab';
import { ClientsTab } from '@/components/cadastros/ClientsTab';
import { CollectionPointsTab } from '@/components/cadastros/CollectionPointsTab';
import { ProductTypesTab } from '@/components/cadastros/ProductTypesTab';
import { SupplierDialog } from '@/components/cadastros/SupplierDialog';
import { ClientDialog } from '@/components/cadastros/ClientDialog';
import { CollectionPointDialog } from '@/components/cadastros/CollectionPointDialog';
import { ProductTypeDialog } from '@/components/cadastros/ProductTypeDialog';
import {
  SupplierFrontend,
  Client,
  CollectionPoint,
  ProductType,
} from '@/types';

export default function Cadastros() {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [pointDialogOpen, setPointDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<
    SupplierFrontend | undefined
  >();
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingPoint, setEditingPoint] = useState<
    CollectionPoint | undefined
  >();
  const [editingProduct, setEditingProduct] = useState<
    ProductType | undefined
  >();

  const handleAddNew = () => {
    switch (activeTab) {
      case 'suppliers':
        setEditingSupplier(undefined);
        setSupplierDialogOpen(true);
        break;
      case 'clients':
        setEditingClient(undefined);
        setClientDialogOpen(true);
        break;
      case 'points':
        setEditingPoint(undefined);
        setPointDialogOpen(true);
        break;
      case 'products':
        setEditingProduct(undefined);
        setProductDialogOpen(true);
        break;
    }
  };

  const handleEditSupplier = (supplier: SupplierFrontend) => {
    setEditingSupplier(supplier);
    setSupplierDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientDialogOpen(true);
  };

  const handleEditPoint = (point: CollectionPoint) => {
    setEditingPoint(point);
    setPointDialogOpen(true);
  };

  const handleEditProduct = (product: ProductType) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Gestão de Cadastros
        </h2>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cadastro
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="points">Pontos de Coleta</TabsTrigger>
          <TabsTrigger value="products">Tipos de Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <SuppliersTab onEdit={handleEditSupplier} />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsTab onEdit={handleEditClient} />
        </TabsContent>

        <TabsContent value="points">
          <CollectionPointsTab onEdit={handleEditPoint} />
        </TabsContent>

        <TabsContent value="products">
          <ProductTypesTab onEdit={handleEditProduct} />
        </TabsContent>
      </Tabs>

      <SupplierDialog
        open={supplierDialogOpen}
        onOpenChange={setSupplierDialogOpen}
        supplier={editingSupplier}
      />
      <ClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        client={editingClient}
      />
      <CollectionPointDialog
        open={pointDialogOpen}
        onOpenChange={setPointDialogOpen}
        point={editingPoint}
      />
      <ProductTypeDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={editingProduct}
      />
    </div>
  );
}

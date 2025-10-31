import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Client,
  CollectionPoint,
  ProductType,
  Collection,
  Sale,
  SupplierFrontend,
} from '@/types';
import { supplierService } from '@/services/suppliers';
import { clientService } from '@/services/clients';
import { ApiError } from '@/services/api';
import { toast } from 'sonner';
import { collectionPointService } from '@/services/collection-points';
import { productTypeService } from '@/services/product-types';
import { collectionService } from '@/services/collections';
import { saleService } from '@/services/sales';

interface DataContextType {
  suppliers: SupplierFrontend[];
  clients: Client[];
  collectionPoints: CollectionPoint[];
  productTypes: ProductType[];
  collections: Collection[];
  sales: Sale[];
  salesMetadata: {
    totalSales: number;
    totalWeight: number;
    totalValue: number;
  };
  suppliersLoading: boolean;
  clientsLoading: boolean;
  collectionPointsLoading: boolean;
  productTypesLoading: boolean;
  collectionsLoading: boolean;
  salesLoading: boolean;
  addSupplier: (
    supplier: Omit<SupplierFrontend, 'id' | 'createdAt'>
  ) => Promise<void>;
  updateSupplier: (
    id: string,
    supplier: Partial<SupplierFrontend>
  ) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  refreshSuppliers: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  refreshClients: () => Promise<void>;
  addCollectionPoint: (
    point: Omit<CollectionPoint, 'id' | 'createdAt'>
  ) => Promise<void>;
  updateCollectionPoint: (
    id: string,
    point: Partial<CollectionPoint>
  ) => Promise<void>;
  deleteCollectionPoint: (id: string) => Promise<void>;
  refreshCollectionPoints: () => Promise<void>;
  addProductType: (
    product: Omit<ProductType, 'id' | 'createdAt'>
  ) => Promise<void>;
  updateProductType: (
    id: string,
    product: Partial<ProductType>
  ) => Promise<void>;
  deleteProductType: (id: string) => Promise<void>;
  refreshProductTypes: () => Promise<void>;
  addCollection: (
    collection: Omit<
      Collection,
      'id' | 'createdAt' | 'supplierName' | 'productName'
    >
  ) => Promise<void>;
  updateCollection: (
    id: string,
    collection: Partial<Collection>
  ) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  refreshCollections: () => Promise<void>;
  updateCollectionStatus: (
    id: string,
    status: 'agendado' | 'confirmado' | 'coletado'
  ) => Promise<void>;
  addSale: (
    sale: Omit<Sale, 'id' | 'createdAt' | 'clientName' | 'productType'>
  ) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  refreshSales: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export { DataContext };

// Mock initial data (keeping for other entities that don't use API yet)
const initialSales: Sale[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<SupplierFrontend[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>(
    []
  );
  const [collectionPointsLoading, setCollectionPointsLoading] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [productTypesLoading, setProductTypesLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesMetadata, setSalesMetadata] = useState({
    totalSales: 0,
    totalWeight: 0,
    totalValue: 0,
  });

  const generateId = () => Date.now().toString();

  // Load suppliers, clients, collection points, product types, collections and sales from API on component mount
  useEffect(() => {
    refreshSuppliers();
    refreshClients();
    refreshCollectionPoints();
    refreshProductTypes();
    refreshCollections();
    refreshSales();
  }, []);

  const refreshSuppliers = async () => {
    setSuppliersLoading(true);
    try {
      const apiSuppliers = await supplierService.getAll();
      setSuppliers(apiSuppliers);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao carregar fornecedores: ${error.message}`);
      } else {
        toast.error('Erro ao carregar fornecedores');
      }
    } finally {
      setSuppliersLoading(false);
    }
  };

  const refreshClients = async () => {
    setClientsLoading(true);
    try {
      const apiClients = await clientService.getAll();
      setClients(apiClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao carregar clientes: ${error.message}`);
      } else {
        toast.error('Erro ao carregar clientes');
      }
    } finally {
      setClientsLoading(false);
    }
  };

  const refreshCollectionPoints = async () => {
    setCollectionPointsLoading(true);
    try {
      const apiCollectionPoints = await collectionPointService.getAll();
      setCollectionPoints(apiCollectionPoints);
    } catch (error) {
      console.error('Error loading collection points:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao carregar pontos de coleta: ${error.message}`);
      } else {
        toast.error('Erro ao carregar pontos de coleta');
      }
    } finally {
      setCollectionPointsLoading(false);
    }
  };

  const refreshProductTypes = async () => {
    setProductTypesLoading(true);
    try {
      const apiProductTypes = await productTypeService.getAll();
      setProductTypes(apiProductTypes);
    } catch (error) {
      console.error('Error loading product types:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao carregar tipos de produto: ${error.message}`);
      } else {
        toast.error('Erro ao carregar tipos de produto');
      }
    } finally {
      setProductTypesLoading(false);
    }
  };

  const refreshCollections = async () => {
    setCollectionsLoading(true);
    try {
      const apiCollections = await collectionService.getAll();
      setCollections(apiCollections);
    } catch (error) {
      console.error('Error loading collections:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao carregar coletas: ${error.message}`);
      } else {
        toast.error('Erro ao carregar coletas');
      }
    } finally {
      setCollectionsLoading(false);
    }
  };

  const refreshSales = async () => {
    setSalesLoading(true);
    try {
      const { sales: apiSales, metadata } = await saleService.getAll();
      setSales(apiSales);
      setSalesMetadata(metadata);
    } catch (error) {
      console.error('Error loading sales:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao carregar vendas: ${error.message}`);
      } else {
        toast.error('Erro ao carregar vendas');
      }
    } finally {
      setSalesLoading(false);
    }
  };

  const addSupplier = async (
    supplier: Omit<SupplierFrontend, 'id' | 'createdAt'>
  ) => {
    try {
      const newSupplier = await supplierService.create(supplier);
      setSuppliers((prev) => [newSupplier, ...prev]);
    } catch (error) {
      console.error('Error creating supplier:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao criar fornecedor: ${error.message}`);
      } else {
        toast.error('Erro ao criar fornecedor');
      }
      throw error;
    }
  };

  const updateSupplier = async (
    id: string,
    updatedSupplier: Partial<SupplierFrontend>
  ) => {
    try {
      const numericId = parseInt(id);
      const updated = await supplierService.update(numericId, updatedSupplier);
      setSuppliers((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (error) {
      console.error('Error updating supplier:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar fornecedor: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar fornecedor');
      }
      throw error;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const numericId = parseInt(id);
      await supplierService.delete(numericId);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao excluir fornecedor: ${error.message}`);
      } else {
        toast.error('Erro ao excluir fornecedor');
      }
      throw error;
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const newClient = await clientService.create(client);
      setClients((prev) => [newClient, ...prev]);
    } catch (error) {
      console.error('Error creating client:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao criar cliente: ${error.message}`);
      } else {
        toast.error('Erro ao criar cliente');
      }
      throw error;
    }
  };

  const updateClient = async (id: string, updatedClient: Partial<Client>) => {
    try {
      const numericId = parseInt(id);
      const updated = await clientService.update(numericId, updatedClient);
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (error) {
      console.error('Error updating client:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar cliente: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar cliente');
      }
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const numericId = parseInt(id);
      await clientService.delete(numericId);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao excluir cliente: ${error.message}`);
      } else {
        toast.error('Erro ao excluir cliente');
      }
      throw error;
    }
  };

  const addCollectionPoint = async (
    point: Omit<CollectionPoint, 'id' | 'createdAt'>
  ) => {
    try {
      const newCollectionPoint = await collectionPointService.create(point);
      setCollectionPoints((prev) => [newCollectionPoint, ...prev]);
    } catch (error) {
      console.error('Error creating collection point:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao criar ponto de coleta: ${error.message}`);
      } else {
        toast.error('Erro ao criar ponto de coleta');
      }
      throw error;
    }
  };

  const updateCollectionPoint = async (
    id: string,
    updatedPoint: Partial<CollectionPoint>
  ) => {
    try {
      const numericId = parseInt(id);
      const updated = await collectionPointService.update(
        numericId,
        updatedPoint
      );
      setCollectionPoints((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } catch (error) {
      console.error('Error updating collection point:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar ponto de coleta: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar ponto de coleta');
      }
      throw error;
    }
  };

  const deleteCollectionPoint = async (id: string) => {
    try {
      const numericId = parseInt(id);
      await collectionPointService.delete(numericId);
      setCollectionPoints((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting collection point:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao excluir ponto de coleta: ${error.message}`);
      } else {
        toast.error('Erro ao excluir ponto de coleta');
      }
      throw error;
    }
  };

  const addProductType = async (
    product: Omit<ProductType, 'id' | 'createdAt'>
  ) => {
    try {
      const newProductType = await productTypeService.create(product);
      setProductTypes((prev) => [newProductType, ...prev]);
    } catch (error) {
      console.error('Error creating product type:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao criar tipo de produto: ${error.message}`);
      } else {
        toast.error('Erro ao criar tipo de produto');
      }
      throw error;
    }
  };

  const updateProductType = async (
    id: string,
    product: Partial<ProductType>
  ) => {
    try {
      const updatedProductType = await productTypeService.update(
        parseInt(id),
        product
      );
      setProductTypes((prev) =>
        prev.map((p) => (p.id === id ? updatedProductType : p))
      );
    } catch (error) {
      console.error('Error updating product type:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar tipo de produto: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar tipo de produto');
      }
      throw error;
    }
  };

  const deleteProductType = async (id: string) => {
    try {
      await productTypeService.delete(parseInt(id));
      setProductTypes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product type:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao excluir tipo de produto: ${error.message}`);
      } else {
        toast.error('Erro ao excluir tipo de produto');
      }
      throw error;
    }
  };

  const addCollection = async (
    collection: Omit<
      Collection,
      'id' | 'createdAt' | 'supplierName' | 'productName'
    >
  ) => {
    try {
      const newCollection = await collectionService.create(collection);
      setCollections((prev) => [newCollection, ...prev]);
    } catch (error) {
      console.error('Error creating collection:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao criar coleta: ${error.message}`);
      } else {
        toast.error('Erro ao criar coleta');
      }
      throw error;
    }
  };

  const updateCollection = async (
    id: string,
    collection: Partial<Collection>
  ) => {
    try {
      const updatedCollection = await collectionService.update(
        parseInt(id),
        collection
      );
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? updatedCollection : c))
      );
    } catch (error) {
      console.error('Error updating collection:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar coleta: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar coleta');
      }
      throw error;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await collectionService.delete(parseInt(id));
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao excluir coleta: ${error.message}`);
      } else {
        toast.error('Erro ao excluir coleta');
      }
      throw error;
    }
  };

  const updateCollectionStatus = async (
    id: string,
    status: 'agendado' | 'confirmado' | 'coletado'
  ) => {
    try {
      const updatedCollection = await collectionService.updateStatus(
        parseInt(id),
        status
      );
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? updatedCollection : c))
      );
    } catch (error) {
      console.error('Error updating collection status:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar status da coleta: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar status da coleta');
      }
      throw error;
    }
  };

  const addSale = async (
    sale: Omit<Sale, 'id' | 'createdAt' | 'productType' | 'clientName'>
  ) => {
    try {
      const newSale = await saleService.create(sale);
      setSales((prev) => [...prev, newSale]);
      toast.success('Venda adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding sale:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao adicionar venda: ${error.message}`);
      } else {
        toast.error('Erro ao adicionar venda');
      }
    }
  };

  const updateSale = async (id: string, sale: Partial<Sale>) => {
    try {
      const updatedSale = await saleService.update(parseInt(id), sale);
      setSales((prev) => prev.map((s) => (s.id === id ? updatedSale : s)));
      toast.success('Venda atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating sale:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao atualizar venda: ${error.message}`);
      } else {
        toast.error('Erro ao atualizar venda');
      }
    }
  };

  const deleteSale = async (id: string) => {
    try {
      await saleService.delete(parseInt(id));
      setSales((prev) => prev.filter((sale) => sale.id !== id));
      toast.success('Venda excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting sale:', error);
      if (error instanceof ApiError) {
        toast.error(`Erro ao excluir venda: ${error.message}`);
      } else {
        toast.error('Erro ao excluir venda');
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        suppliers,
        suppliersLoading,
        clients,
        clientsLoading,
        collectionPoints,
        collectionPointsLoading,
        productTypes,
        productTypesLoading,
        collections,
        collectionsLoading,
        sales,
        salesLoading,
        salesMetadata,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        refreshSuppliers,
        addClient,
        updateClient,
        deleteClient,
        refreshClients,
        addCollectionPoint,
        updateCollectionPoint,
        deleteCollectionPoint,
        refreshCollectionPoints,
        addProductType,
        updateProductType,
        deleteProductType,
        refreshProductTypes,
        addCollection,
        updateCollection,
        deleteCollection,
        refreshCollections,
        updateCollectionStatus,
        addSale,
        updateSale,
        deleteSale,
        refreshSales,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Supplier, Client, CollectionPoint, ProductType, Collection, Sale } from '@/types';

interface DataContextType {
  suppliers: Supplier[];
  clients: Client[];
  collectionPoints: CollectionPoint[];
  productTypes: ProductType[];
  collections: Collection[];
  sales: Sale[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addCollectionPoint: (point: Omit<CollectionPoint, 'id' | 'createdAt'>) => void;
  updateCollectionPoint: (id: string, point: Partial<CollectionPoint>) => void;
  deleteCollectionPoint: (id: string) => void;
  addProductType: (product: Omit<ProductType, 'id' | 'createdAt'>) => void;
  updateProductType: (id: string, product: Partial<ProductType>) => void;
  deleteProductType: (id: string) => void;
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt'>) => void;
  updateCollection: (id: string, collection: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'João Silva',
    document: '123.456.789-00',
    phone: '(11) 98765-4321',
    email: 'joao@email.com',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    type: 'catador',
    materialType: 'PP Moído',
    createdAt: new Date().toISOString(),
  },
];

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Indústria ABC Ltda',
    document: '12.345.678/0001-00',
    phone: '(11) 3456-7890',
    email: 'contato@abc.com.br',
    address: 'Av. Industrial, 456 - São Paulo, SP',
    createdAt: new Date().toISOString(),
  },
];

const initialCollectionPoints: CollectionPoint[] = [
  {
    id: '1',
    name: 'Ponto Central',
    address: 'Rua Central, 789 - São Paulo, SP',
    phone: '(11) 3333-4444',
    email: 'central@renascer.com.br',
    responsible: 'Maria Santos',
    createdAt: new Date().toISOString(),
  },
];

const initialProductTypes: ProductType[] = [
  {
    id: '1',
    name: 'PP Moído',
    description: 'Polipropileno moído',
    unit: 'kg',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'PET Triturado',
    description: 'PET pós-consumo triturado',
    unit: 'kg',
    createdAt: new Date().toISOString(),
  },
];

const initialCollections: Collection[] = [
  {
    id: '1',
    supplierId: '1',
    supplierName: 'João Silva',
    supplierType: 'catador',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    location: 'Rua das Flores, 123',
    weight: 150,
    value: 450,
    status: 'agendado',
    createdAt: new Date().toISOString(),
  },
];

const initialSales: Sale[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Indústria ABC Ltda',
    productType: 'PP Moído',
    weight: 500,
    value: 2000,
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>(initialCollectionPoints);
  const [productTypes, setProductTypes] = useState<ProductType[]>(initialProductTypes);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const generateId = () => Date.now().toString();

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    setSuppliers([...suppliers, { ...supplier, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const updateSupplier = (id: string, updatedSupplier: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    setClients([...clients, { ...client, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const updateClient = (id: string, updatedClient: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updatedClient } : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const addCollectionPoint = (point: Omit<CollectionPoint, 'id' | 'createdAt'>) => {
    setCollectionPoints([...collectionPoints, { ...point, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const updateCollectionPoint = (id: string, updatedPoint: Partial<CollectionPoint>) => {
    setCollectionPoints(collectionPoints.map(p => p.id === id ? { ...p, ...updatedPoint } : p));
  };

  const deleteCollectionPoint = (id: string) => {
    setCollectionPoints(collectionPoints.filter(p => p.id !== id));
  };

  const addProductType = (product: Omit<ProductType, 'id' | 'createdAt'>) => {
    setProductTypes([...productTypes, { ...product, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const updateProductType = (id: string, updatedProduct: Partial<ProductType>) => {
    setProductTypes(productTypes.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProductType = (id: string) => {
    setProductTypes(productTypes.filter(p => p.id !== id));
  };

  const addCollection = (collection: Omit<Collection, 'id' | 'createdAt'>) => {
    setCollections([...collections, { ...collection, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const updateCollection = (id: string, updatedCollection: Partial<Collection>) => {
    setCollections(collections.map(c => c.id === id ? { ...c, ...updatedCollection } : c));
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    setSales([...sales, { ...sale, id: generateId(), createdAt: new Date().toISOString() }]);
  };

  const updateSale = (id: string, updatedSale: Partial<Sale>) => {
    setSales(sales.map(s => s.id === id ? { ...s, ...updatedSale } : s));
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        suppliers,
        clients,
        collectionPoints,
        productTypes,
        collections,
        sales,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addClient,
        updateClient,
        deleteClient,
        addCollectionPoint,
        updateCollectionPoint,
        deleteCollectionPoint,
        addProductType,
        updateProductType,
        deleteProductType,
        addCollection,
        updateCollection,
        deleteCollection,
        addSale,
        updateSale,
        deleteSale,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

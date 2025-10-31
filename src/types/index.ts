export interface Supplier {
  id: number;
  name: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
  supplierType: 'Collector' | 'Agent' | 'Company';
  materialType: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend types for compatibility with existing components
export interface SupplierFrontend {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  type: 'catador' | 'agenciador' | 'empresa';
  materialType: string;
  createdAt: string;
}

// API request types
export interface CreateSupplierRequest {
  name: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
  supplierType: 'Collector' | 'Agent' | 'Company';
  materialType: string;
}

export type UpdateSupplierRequest = Partial<CreateSupplierRequest>;

// Client types
export interface ClientAPI {
  id: number;
  name: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend types for compatibility with existing components
export interface Client {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

// API request types for clients
export interface CreateClientRequest {
  name: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
}

export type UpdateClientRequest = Partial<CreateClientRequest>;

// Collection Point types from API
export interface CollectionPointAPI {
  id: number;
  name: string;
  responsible: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend types for compatibility with existing components
export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  responsible: string;
  createdAt: string;
}

// API request types for collection points
export interface CreateCollectionPointRequest {
  name: string;
  responsible: string;
  address: string;
  phone: string;
  email: string;
}

export type UpdateCollectionPointRequest =
  Partial<CreateCollectionPointRequest>;

// Product Type types from API
export interface ProductTypeAPI {
  id: number;
  name: string;
  description: string;
  unit: 'g' | 'kg';
  createdAt: string;
  updatedAt: string;
}

// Frontend types for compatibility with existing components
export interface ProductType {
  id: string;
  name: string;
  description: string;
  unit: string;
  createdAt: string;
}

// API request types for product types
export interface CreateProductTypeRequest {
  name: string;
  description: string;
  unit: 'g' | 'kg';
}

export type UpdateProductTypeRequest = Partial<CreateProductTypeRequest>;

// Collection types from API
export interface CollectionAPI {
  id: number;
  supplierId: number;
  status: 'Scheduled' | 'Confirmed' | 'Collected';
  dateTime: string;
  location: string;
  productId: number;
  weight: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  supplier: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    unit: string;
  };
}

// Frontend types for compatibility with existing components
export interface Collection {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierType: 'catador' | 'agenciador' | 'empresa';
  date: string;
  time: string;
  location: string;
  productId: string;
  productName: string;
  weight: number;
  value: number;
  status: 'agendado' | 'confirmado' | 'coletado';
  createdAt: string;
}

// API request types for collections
export interface CreateCollectionRequest {
  supplierId: number;
  status?: 'Scheduled' | 'Confirmed' | 'Collected';
  dateTime: string;
  location: string;
  productId: number;
  weight: number;
  value: number;
}

export type UpdateCollectionRequest = Partial<CreateCollectionRequest>;

export interface UpdateCollectionStatusRequest {
  status: 'Scheduled' | 'Confirmed' | 'Collected';
}

// Sale types from API
export interface SaleAPI {
  id: number;
  clientId: number;
  productId: number;
  dateTime: string;
  weight: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    unit: string;
  };
}

// Frontend types for compatibility with existing components
export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  productId: string;
  productType: string;
  weight: number;
  value: number;
  date: string;
  createdAt: string;
}

// API request types for sales
export interface CreateSaleRequest {
  clientId: number;
  productId: number;
  dateTime: string;
  weight: number;
  value: number;
}

export type UpdateSaleRequest = Partial<CreateSaleRequest>;

// Sales metadata from API
export interface SalesMetadata {
  totalSales: number;
  totalWeight: number;
  totalValue: number;
}

export interface SalesWithMetadata {
  sales: SaleAPI[];
  metadata: SalesMetadata;
}

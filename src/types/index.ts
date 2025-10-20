export interface Supplier {
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

export interface Client {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  responsible: string;
  createdAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  unit: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierType: 'catador' | 'agenciador' | 'empresa';
  date: string;
  time: string;
  location: string;
  weight: number;
  value: number;
  status: 'agendado' | 'confirmado' | 'coletado';
  createdAt: string;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  productType: string;
  weight: number;
  value: number;
  date: string;
  createdAt: string;
}

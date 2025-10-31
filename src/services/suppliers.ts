import { api } from './api';
import {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SupplierFrontend,
} from '@/types';

// Helper functions to convert between API and frontend formats
export function convertToFrontendSupplier(
  apiSupplier: Supplier
): SupplierFrontend {
  const typeMap: Record<Supplier['supplierType'], SupplierFrontend['type']> = {
    Collector: 'catador',
    Agent: 'agenciador',
    Company: 'empresa',
  };

  return {
    id: apiSupplier.id.toString(),
    name: apiSupplier.name,
    document: apiSupplier.taxId,
    phone: apiSupplier.phone,
    email: apiSupplier.email,
    address: apiSupplier.address,
    type: typeMap[apiSupplier.supplierType],
    materialType: apiSupplier.materialType,
    createdAt: apiSupplier.createdAt,
  };
}

export function convertToApiSupplier(
  frontendSupplier: Omit<SupplierFrontend, 'id' | 'createdAt'>
): CreateSupplierRequest {
  const typeMap: Record<SupplierFrontend['type'], Supplier['supplierType']> = {
    catador: 'Collector',
    agenciador: 'Agent',
    empresa: 'Company',
  };

  return {
    name: frontendSupplier.name,
    taxId: frontendSupplier.document,
    phone: frontendSupplier.phone,
    email: frontendSupplier.email,
    address: frontendSupplier.address,
    supplierType: typeMap[frontendSupplier.type],
    materialType: frontendSupplier.materialType,
  };
}

export const supplierService = {
  // Get all suppliers
  async getAll(): Promise<SupplierFrontend[]> {
    const suppliers = await api.get<Supplier[]>('/suppliers');
    return suppliers.map(convertToFrontendSupplier);
  },

  // Get supplier by ID
  async getById(id: number): Promise<SupplierFrontend> {
    const supplier = await api.get<Supplier>(`/suppliers/${id}`);
    return convertToFrontendSupplier(supplier);
  },

  // Create new supplier
  async create(
    supplierData: Omit<SupplierFrontend, 'id' | 'createdAt'>
  ): Promise<SupplierFrontend> {
    const apiSupplierData = convertToApiSupplier(supplierData);
    const createdSupplier = await api.post<Supplier>(
      '/suppliers',
      apiSupplierData
    );
    return convertToFrontendSupplier(createdSupplier);
  },

  // Update supplier
  async update(
    id: number,
    supplierData: Partial<Omit<SupplierFrontend, 'id' | 'createdAt'>>
  ): Promise<SupplierFrontend> {
    const updateData: UpdateSupplierRequest = {};

    if (supplierData.name) updateData.name = supplierData.name;
    if (supplierData.document) updateData.taxId = supplierData.document;
    if (supplierData.phone) updateData.phone = supplierData.phone;
    if (supplierData.email) updateData.email = supplierData.email;
    if (supplierData.address) updateData.address = supplierData.address;
    if (supplierData.materialType)
      updateData.materialType = supplierData.materialType;
    if (supplierData.type) {
      const typeMap: Record<
        SupplierFrontend['type'],
        Supplier['supplierType']
      > = {
        catador: 'Collector',
        agenciador: 'Agent',
        empresa: 'Company',
      };
      updateData.supplierType = typeMap[supplierData.type];
    }

    const updatedSupplier = await api.put<Supplier>(
      `/suppliers/${id}`,
      updateData
    );
    return convertToFrontendSupplier(updatedSupplier);
  },

  // Delete supplier
  async delete(id: number): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  },
};

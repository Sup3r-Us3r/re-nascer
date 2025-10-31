import { api, ApiError } from './api';
import type {
  Sale,
  SaleAPI,
  CreateSaleRequest,
  UpdateSaleRequest,
  SalesWithMetadata,
  SalesMetadata,
} from '@/types';

// Function to convert API sale to frontend format
function convertToFrontendSale(apiSale: SaleAPI): Sale {
  const dateTime = new Date(apiSale.dateTime);
  const date = dateTime.toISOString().split('T')[0];

  return {
    id: apiSale.id.toString(),
    clientId: apiSale.clientId.toString(),
    clientName: apiSale.client.name,
    productId: apiSale.productId.toString(),
    productType: apiSale.product.name,
    weight: apiSale.weight,
    value: apiSale.value,
    date,
    createdAt: apiSale.createdAt,
  };
}

// Function to convert frontend sale to API format
function convertToApiSale(
  frontendSale: Omit<Sale, 'id' | 'createdAt' | 'clientName' | 'productType'>
): CreateSaleRequest {
  // Combine date and time to create ISO datetime string
  const dateTime = new Date(`${frontendSale.date}T12:00:00.000Z`).toISOString();

  return {
    clientId: parseInt(frontendSale.clientId),
    productId: parseInt(frontendSale.productId),
    dateTime,
    weight: frontendSale.weight,
    value: frontendSale.value,
  };
}

// Function to convert partial frontend sale to API format for updates
function convertToApiUpdateSale(
  frontendSale: Partial<Sale>
): UpdateSaleRequest {
  const updateData: UpdateSaleRequest = {};

  if (frontendSale.clientId !== undefined) {
    updateData.clientId = parseInt(frontendSale.clientId);
  }
  if (frontendSale.productId !== undefined) {
    updateData.productId = parseInt(frontendSale.productId);
  }
  if (frontendSale.date !== undefined) {
    updateData.dateTime = new Date(
      `${frontendSale.date}T12:00:00.000Z`
    ).toISOString();
  }
  if (frontendSale.weight !== undefined) {
    updateData.weight = frontendSale.weight;
  }
  if (frontendSale.value !== undefined) {
    updateData.value = frontendSale.value;
  }

  return updateData;
}

export const saleService = {
  async getAll(): Promise<{ sales: Sale[]; metadata: SalesMetadata }> {
    try {
      const response = await api.get<SalesWithMetadata>('/sales');
      const sales = response.sales.map(convertToFrontendSale);
      return {
        sales,
        metadata: response.metadata,
      };
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Sale> {
    try {
      const apiSale = await api.get<SaleAPI>(`/sales/${id}`);
      return convertToFrontendSale(apiSale);
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  },

  async create(
    saleData: Omit<Sale, 'id' | 'createdAt' | 'clientName' | 'productType'>
  ): Promise<Sale> {
    try {
      const apiData = convertToApiSale(saleData);
      const createdSale = await api.post<SaleAPI>('/sales', apiData);
      return convertToFrontendSale(createdSale);
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  async update(id: number, saleData: Partial<Sale>): Promise<Sale> {
    try {
      const apiData = convertToApiUpdateSale(saleData);
      const updatedSale = await api.put<SaleAPI>(`/sales/${id}`, apiData);
      return convertToFrontendSale(updatedSale);
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/sales/${id}`);
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  },
};

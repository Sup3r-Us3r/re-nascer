import { api, ApiError } from './api';
import type {
  ProductType,
  ProductTypeAPI,
  CreateProductTypeRequest,
  UpdateProductTypeRequest,
} from '@/types';

// Function to convert API product type to frontend format
function convertToFrontendProductType(
  apiProductType: ProductTypeAPI
): ProductType {
  return {
    id: apiProductType.id.toString(),
    name: apiProductType.name,
    description: apiProductType.description,
    unit: apiProductType.unit,
    createdAt: apiProductType.createdAt,
  };
}

// Function to convert frontend product type to API format
function convertToApiProductType(
  frontendProductType: Omit<ProductType, 'id' | 'createdAt'>
): CreateProductTypeRequest {
  return {
    name: frontendProductType.name,
    description: frontendProductType.description,
    unit: frontendProductType.unit as 'g' | 'kg',
  };
}

// Function to convert partial frontend product type to API format for updates
function convertToApiUpdateProductType(
  frontendProductType: Partial<ProductType>
): UpdateProductTypeRequest {
  const updateData: UpdateProductTypeRequest = {};

  if (frontendProductType.name !== undefined) {
    updateData.name = frontendProductType.name;
  }
  if (frontendProductType.description !== undefined) {
    updateData.description = frontendProductType.description;
  }
  if (frontendProductType.unit !== undefined) {
    updateData.unit = frontendProductType.unit as 'g' | 'kg';
  }

  return updateData;
}

export const productTypeService = {
  async getAll(): Promise<ProductType[]> {
    try {
      const apiProductTypes = await api.get<ProductTypeAPI[]>('/product-types');
      return apiProductTypes.map(convertToFrontendProductType);
    } catch (error) {
      console.error('Error fetching product types:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<ProductType> {
    try {
      const apiProductType = await api.get<ProductTypeAPI>(
        `/product-types/${id}`
      );
      return convertToFrontendProductType(apiProductType);
    } catch (error) {
      console.error('Error fetching product type:', error);
      throw error;
    }
  },

  async create(
    productTypeData: Omit<ProductType, 'id' | 'createdAt'>
  ): Promise<ProductType> {
    try {
      const apiData = convertToApiProductType(productTypeData);
      const createdProductType = await api.post<ProductTypeAPI>(
        '/product-types',
        apiData
      );
      return convertToFrontendProductType(createdProductType);
    } catch (error) {
      console.error('Error creating product type:', error);
      throw error;
    }
  },

  async update(
    id: number,
    productTypeData: Partial<ProductType>
  ): Promise<ProductType> {
    try {
      const apiData = convertToApiUpdateProductType(productTypeData);
      const updatedProductType = await api.put<ProductTypeAPI>(
        `/product-types/${id}`,
        apiData
      );
      return convertToFrontendProductType(updatedProductType);
    } catch (error) {
      console.error('Error updating product type:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/product-types/${id}`);
    } catch (error) {
      console.error('Error deleting product type:', error);
      throw error;
    }
  },
};

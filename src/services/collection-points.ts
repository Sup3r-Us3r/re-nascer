import { api, ApiError } from './api';
import type {
  CollectionPoint,
  CollectionPointAPI,
  CreateCollectionPointRequest,
  UpdateCollectionPointRequest,
} from '@/types';

// Function to convert API collection point to frontend format
function convertToFrontendCollectionPoint(
  apiCollectionPoint: CollectionPointAPI
): CollectionPoint {
  return {
    id: apiCollectionPoint.id.toString(),
    name: apiCollectionPoint.name,
    address: apiCollectionPoint.address,
    phone: apiCollectionPoint.phone,
    email: apiCollectionPoint.email,
    responsible: apiCollectionPoint.responsible,
    createdAt: apiCollectionPoint.createdAt,
  };
}

// Function to convert frontend collection point to API format
function convertToApiCollectionPoint(
  frontendCollectionPoint: Omit<CollectionPoint, 'id' | 'createdAt'>
): CreateCollectionPointRequest {
  return {
    name: frontendCollectionPoint.name,
    responsible: frontendCollectionPoint.responsible,
    address: frontendCollectionPoint.address,
    phone: frontendCollectionPoint.phone,
    email: frontendCollectionPoint.email,
  };
}

// Function to convert partial frontend collection point to API format for updates
function convertToApiUpdateCollectionPoint(
  frontendCollectionPoint: Partial<CollectionPoint>
): UpdateCollectionPointRequest {
  const updateData: UpdateCollectionPointRequest = {};

  if (frontendCollectionPoint.name !== undefined) {
    updateData.name = frontendCollectionPoint.name;
  }
  if (frontendCollectionPoint.responsible !== undefined) {
    updateData.responsible = frontendCollectionPoint.responsible;
  }
  if (frontendCollectionPoint.address !== undefined) {
    updateData.address = frontendCollectionPoint.address;
  }
  if (frontendCollectionPoint.phone !== undefined) {
    updateData.phone = frontendCollectionPoint.phone;
  }
  if (frontendCollectionPoint.email !== undefined) {
    updateData.email = frontendCollectionPoint.email;
  }

  return updateData;
}

export const collectionPointService = {
  async getAll(): Promise<CollectionPoint[]> {
    try {
      const apiCollectionPoints = await api.get<CollectionPointAPI[]>(
        '/collection-points'
      );
      return apiCollectionPoints.map(convertToFrontendCollectionPoint);
    } catch (error) {
      console.error('Error fetching collection points:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<CollectionPoint> {
    try {
      const apiCollectionPoint = await api.get<CollectionPointAPI>(
        `/collection-points/${id}`
      );
      return convertToFrontendCollectionPoint(apiCollectionPoint);
    } catch (error) {
      console.error('Error fetching collection point:', error);
      throw error;
    }
  },

  async create(
    collectionPointData: Omit<CollectionPoint, 'id' | 'createdAt'>
  ): Promise<CollectionPoint> {
    try {
      const apiData = convertToApiCollectionPoint(collectionPointData);
      const createdCollectionPoint = await api.post<CollectionPointAPI>(
        '/collection-points',
        apiData
      );
      return convertToFrontendCollectionPoint(createdCollectionPoint);
    } catch (error) {
      console.error('Error creating collection point:', error);
      throw error;
    }
  },

  async update(
    id: number,
    collectionPointData: Partial<CollectionPoint>
  ): Promise<CollectionPoint> {
    try {
      const apiData = convertToApiUpdateCollectionPoint(collectionPointData);
      const updatedCollectionPoint = await api.put<CollectionPointAPI>(
        `/collection-points/${id}`,
        apiData
      );
      return convertToFrontendCollectionPoint(updatedCollectionPoint);
    } catch (error) {
      console.error('Error updating collection point:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/collection-points/${id}`);
    } catch (error) {
      console.error('Error deleting collection point:', error);
      throw error;
    }
  },
};

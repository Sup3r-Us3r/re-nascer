import { api, ApiError } from './api';
import type {
  Collection,
  CollectionAPI,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  UpdateCollectionStatusRequest,
} from '@/types';

// Function to convert API collection to frontend format
function convertToFrontendCollection(apiCollection: CollectionAPI): Collection {
  const dateTime = new Date(apiCollection.dateTime);
  const date = dateTime.toISOString().split('T')[0];
  const time = dateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Map supplier type from API to frontend format
  const getSupplierTypeFrontend = (
    apiType: string
  ): 'catador' | 'agenciador' | 'empresa' => {
    // Since the API doesn't return supplier type in collection, we'll default to 'catador'
    // This should be improved by including supplier type in the API response
    return 'catador';
  };

  // Map status from API to frontend format
  const getStatusFrontend = (
    apiStatus: string
  ): 'agendado' | 'confirmado' | 'coletado' => {
    const statusMap = {
      Scheduled: 'agendado',
      Confirmed: 'confirmado',
      Collected: 'coletado',
    } as const;
    return statusMap[apiStatus as keyof typeof statusMap] || 'agendado';
  };

  return {
    id: apiCollection.id.toString(),
    supplierId: apiCollection.supplierId.toString(),
    supplierName: apiCollection.supplier.name,
    supplierType: getSupplierTypeFrontend(''), // Will need to be improved
    date,
    time,
    location: apiCollection.location,
    productId: apiCollection.productId.toString(),
    productName: apiCollection.product.name,
    weight: apiCollection.weight,
    value: apiCollection.value,
    status: getStatusFrontend(apiCollection.status),
    createdAt: apiCollection.createdAt,
  };
}

// Function to convert frontend collection to API format
function convertToApiCollection(
  frontendCollection: Omit<
    Collection,
    'id' | 'createdAt' | 'supplierName' | 'supplierType' | 'productName'
  >
): CreateCollectionRequest {
  // Combine date and time to create ISO datetime string
  const dateTime = new Date(
    `${frontendCollection.date}T${frontendCollection.time}:00.000Z`
  ).toISOString();

  // Map status from frontend to API format
  const getStatusAPI = (
    frontendStatus: string
  ): 'Scheduled' | 'Confirmed' | 'Collected' => {
    const statusMap = {
      agendado: 'Scheduled',
      confirmado: 'Confirmed',
      coletado: 'Collected',
    } as const;
    return statusMap[frontendStatus as keyof typeof statusMap] || 'Scheduled';
  };

  return {
    supplierId: parseInt(frontendCollection.supplierId),
    status: getStatusAPI(frontendCollection.status),
    dateTime,
    location: frontendCollection.location,
    productId: parseInt(frontendCollection.productId),
    weight: frontendCollection.weight,
    value: frontendCollection.value,
  };
}

// Function to convert partial frontend collection to API format for updates
function convertToApiUpdateCollection(
  frontendCollection: Partial<Collection>
): UpdateCollectionRequest {
  const updateData: UpdateCollectionRequest = {};

  if (frontendCollection.supplierId !== undefined) {
    updateData.supplierId = parseInt(frontendCollection.supplierId);
  }
  if (frontendCollection.status !== undefined) {
    const statusMap = {
      agendado: 'Scheduled',
      confirmado: 'Confirmed',
      coletado: 'Collected',
    } as const;
    updateData.status =
      statusMap[frontendCollection.status as keyof typeof statusMap];
  }
  if (
    frontendCollection.date !== undefined &&
    frontendCollection.time !== undefined
  ) {
    updateData.dateTime = new Date(
      `${frontendCollection.date}T${frontendCollection.time}:00.000Z`
    ).toISOString();
  }
  if (frontendCollection.location !== undefined) {
    updateData.location = frontendCollection.location;
  }
  if (frontendCollection.productId !== undefined) {
    updateData.productId = parseInt(frontendCollection.productId);
  }
  if (frontendCollection.weight !== undefined) {
    updateData.weight = frontendCollection.weight;
  }
  if (frontendCollection.value !== undefined) {
    updateData.value = frontendCollection.value;
  }

  return updateData;
}

export const collectionService = {
  async getAll(): Promise<Collection[]> {
    try {
      const apiCollections = await api.get<CollectionAPI[]>('/collections');
      return apiCollections.map(convertToFrontendCollection);
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Collection> {
    try {
      const apiCollection = await api.get<CollectionAPI>(`/collections/${id}`);
      return convertToFrontendCollection(apiCollection);
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  },

  async getByDate(date: string): Promise<{
    date: string;
    collections: Collection[];
    summary: {
      totalCollections: number;
      totalWeight: number;
      totalValue: number;
      byStatus: {
        Scheduled: number;
        Confirmed: number;
        Collected: number;
      };
    };
  }> {
    try {
      const response = await api.get<{
        date: string;
        collections: CollectionAPI[];
        summary: {
          totalCollections: number;
          totalWeight: number;
          totalValue: number;
          byStatus: {
            Scheduled: number;
            Confirmed: number;
            Collected: number;
          };
        };
      }>(`/collections/by-date/${date}`);

      return {
        ...response,
        collections: response.collections.map(convertToFrontendCollection),
      };
    } catch (error) {
      console.error('Error fetching collections by date:', error);
      throw error;
    }
  },

  async create(
    collectionData: Omit<
      Collection,
      'id' | 'createdAt' | 'supplierName' | 'supplierType' | 'productName'
    >
  ): Promise<Collection> {
    try {
      const apiData = convertToApiCollection(collectionData);
      const createdCollection = await api.post<CollectionAPI>(
        '/collections',
        apiData
      );
      return convertToFrontendCollection(createdCollection);
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  async update(
    id: number,
    collectionData: Partial<Collection>
  ): Promise<Collection> {
    try {
      const apiData = convertToApiUpdateCollection(collectionData);
      const updatedCollection = await api.put<CollectionAPI>(
        `/collections/${id}`,
        apiData
      );
      return convertToFrontendCollection(updatedCollection);
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  async updateStatus(
    id: number,
    status: 'agendado' | 'confirmado' | 'coletado'
  ): Promise<Collection> {
    try {
      const statusMap = {
        agendado: 'Scheduled',
        confirmado: 'Confirmed',
        coletado: 'Collected',
      } as const;

      const apiData: UpdateCollectionStatusRequest = {
        status: statusMap[status],
      };

      const updatedCollection = await api.patch<CollectionAPI>(
        `/collections/${id}/status`,
        apiData
      );
      return convertToFrontendCollection(updatedCollection);
    } catch (error) {
      console.error('Error updating collection status:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/collections/${id}`);
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },
};

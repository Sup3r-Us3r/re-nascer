import { api } from './api';
import {
  ClientAPI,
  CreateClientRequest,
  UpdateClientRequest,
  Client,
} from '@/types';

// Helper functions to convert between API and frontend formats
export function convertToFrontendClient(apiClient: ClientAPI): Client {
  return {
    id: apiClient.id.toString(),
    name: apiClient.name,
    document: apiClient.taxId,
    phone: apiClient.phone,
    email: apiClient.email,
    address: apiClient.address,
    createdAt: apiClient.createdAt,
  };
}

export function convertToApiClient(
  frontendClient: Omit<Client, 'id' | 'createdAt'>
): CreateClientRequest {
  return {
    name: frontendClient.name,
    taxId: frontendClient.document,
    phone: frontendClient.phone,
    email: frontendClient.email,
    address: frontendClient.address,
  };
}

export const clientService = {
  // Get all clients
  async getAll(): Promise<Client[]> {
    const clients = await api.get<ClientAPI[]>('/clients');
    return clients.map(convertToFrontendClient);
  },

  // Get client by ID
  async getById(id: number): Promise<Client> {
    const client = await api.get<ClientAPI>(`/clients/${id}`);
    return convertToFrontendClient(client);
  },

  // Create new client
  async create(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const apiClientData = convertToApiClient(clientData);
    const createdClient = await api.post<ClientAPI>('/clients', apiClientData);
    return convertToFrontendClient(createdClient);
  },

  // Update client
  async update(
    id: number,
    clientData: Partial<Omit<Client, 'id' | 'createdAt'>>
  ): Promise<Client> {
    const updateData: UpdateClientRequest = {};

    if (clientData.name) updateData.name = clientData.name;
    if (clientData.document) updateData.taxId = clientData.document;
    if (clientData.phone) updateData.phone = clientData.phone;
    if (clientData.email) updateData.email = clientData.email;
    if (clientData.address) updateData.address = clientData.address;

    const updatedClient = await api.put<ClientAPI>(
      `/clients/${id}`,
      updateData
    );
    return convertToFrontendClient(updatedClient);
  },

  // Delete client
  async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};

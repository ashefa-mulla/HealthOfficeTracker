import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { ClientListItem } from '@/types/client/client.types';
import { LookupItem } from '@/types/employee/employee.types';

const BASE_CLIENT = '/api/TrackerProject';

class ClientService {
  /**
   * GET /api/TrackerProject/GetAllTrackerProject
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getClientList(): Promise<ClientListItem[]> {
    try {
      const response = await axiosInstance.get<ClientListItem[]>(
        `${BASE_CLIENT}/GetAllTrackerProject`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/TrackerProject/GetTrackerProject/{id}
   */
  async getClient(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_CLIENT}/GetTrackerProject/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/TrackerProject/addeditTrackerProject
   */
  async addEditClient(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_CLIENT}/addeditTrackerProject`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/TrackerProject/deleteTrackerProject/{id}
   */
  async deleteClient(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_CLIENT}/deleteTrackerProject/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/TrackerProject/GetCompanies (returns { id, name }) */
  async getCompanies(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_CLIENT}/GetCompanies`);
      return (response.data || [])
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: r.name ?? r.Name ?? '',
        }))
        .filter((r) => r.id > 0);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const clientService = new ClientService();
export default clientService;

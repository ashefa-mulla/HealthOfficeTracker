import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  VendorAccountListItem,
  VendorAccountNumberItem,
} from '@/types/vendorAccount/vendorAccount.types';

const BASE_VENDOR = '/api/VendorAccount';

class VendorAccountService {
  /**
   * GET /api/VendorAccount/GetAllVendorAccount
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getVendorAccountList(): Promise<VendorAccountListItem[]> {
    try {
      const response = await axiosInstance.get<VendorAccountListItem[]>(
        `${BASE_VENDOR}/GetAllVendorAccount`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/VendorAccount/GetVendorAccounts/{id}
   */
  async getVendorAccount(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_VENDOR}/GetVendorAccounts/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/VendorAccount/GetVendorAccountNumberByVendorID/{id}
   */
  async getVendorAccountNumbers(id: number): Promise<VendorAccountNumberItem[]> {
    try {
      const response = await axiosInstance.get<VendorAccountNumberItem[]>(
        `${BASE_VENDOR}/GetVendorAccountNumberByVendorID/${id}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/VendorAccount/addeditvendoraccount
   */
  async addEditVendorAccount(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_VENDOR}/addeditvendoraccount`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/VendorAccount/deletevendoraccount/{id}
   * (the API deactivates the vendor rather than removing the row)
   */
  async deleteVendorAccount(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(`${BASE_VENDOR}/deletevendoraccount/${id}`);
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const vendorAccountService = new VendorAccountService();
export default vendorAccountService;

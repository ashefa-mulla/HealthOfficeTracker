import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { BankMasterListItem } from '@/types/bankMaster/bankMaster.types';

const BASE_BANK = '/api/BankMaster';

class BankMasterService {
  /**
   * GET /api/BankMaster/GetAllBankMaster
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getBankMasterList(): Promise<BankMasterListItem[]> {
    try {
      const response = await axiosInstance.get<BankMasterListItem[]>(
        `${BASE_BANK}/GetAllBankMaster`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/BankMaster/GetBankMaster/{id}
   */
  async getBankMaster(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_BANK}/GetBankMaster/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/BankMaster/addeditBankMaster
   */
  async addEditBankMaster(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_BANK}/addeditBankMaster`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/BankMaster/deleteBankMaster/{id}
   */
  async deleteBankMaster(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(`${BASE_BANK}/deleteBankMaster/${id}`);
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const bankMasterService = new BankMasterService();
export default bankMasterService;

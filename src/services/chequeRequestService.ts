import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { ChequeRequestListItem } from '@/types/chequeRequest/chequeRequest.types';
import { LookupItem } from '@/types/employee/employee.types';

const BASE_CHEQUE = '/api/ChequeRequest';

class ChequeRequestService {
  /**
   * GET /api/ChequeRequest/GetAllChequeRequest
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getChequeRequestList(): Promise<ChequeRequestListItem[]> {
    try {
      const response = await axiosInstance.get<ChequeRequestListItem[]>(
        `${BASE_CHEQUE}/GetAllChequeRequest`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/ChequeRequest/GetCheck/{id}
   */
  async getChequeRequest(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_CHEQUE}/GetCheck/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/ChequeRequest/addeditChequeRequest
   */
  async addEditChequeRequest(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_CHEQUE}/addeditChequeRequest`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/ChequeRequest/deleteChequeRequest/{id}
   */
  async deleteChequeRequest(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(`${BASE_CHEQUE}/deleteChequeRequest/${id}`);
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/BankMaster/GetAllBankList (id, name) */
  async getBanks(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>('/api/BankMaster/GetAllBankList');
      return (response.data || [])
        .map((r: any) => ({ id: Number(r.id ?? r.ID ?? 0), name: r.name ?? r.Name ?? '' }))
        .filter((r) => r.id > 0);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/PurchaseOrder/GetAllCostCentre (id, costCentreName) */
  async getCostCentres(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>('/api/PurchaseOrder/GetAllCostCentre');
      return (response.data || [])
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: r.costCentreName ?? r.CostCentreName ?? '',
        }))
        .filter((r) => r.id > 0);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/PurchaseOrder/GetPopayby (id, payBy, active) — names used as the Payment Method values */
  async getPayMethods(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>('/api/PurchaseOrder/GetPopayby');
      return (response.data || [])
        .filter((r: any) => (r.active ?? r.Active) !== false)
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: r.payBy ?? r.PayBy ?? '',
        }))
        .filter((r) => r.id > 0 && r.name);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const chequeRequestService = new ChequeRequestService();
export default chequeRequestService;

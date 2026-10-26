import axiosInstance from '@/config/axiosInstance';
import { SaveResponse } from '@/types/api.types';
import { axiosErrorToApiError } from '@/types/errors';
import {
  LeaveEmployeeItem,
  LeaveTransactionListItem,
} from '@/types/leave/leave.types';

const BASE_LEAVE = '/api/LeaveTransaction';
const BASE_UTILIZATION = '/api/UtilizationTracker';

class LeaveService {
  /**
   * GET /api/LeaveTransaction/GetLeaveTransactionList?empid={empId}&month={month}&year={year}
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getLeaveTransactionList(
    empId: number,
    month: number = 0,
    year: number = 0,
    currentYear: boolean = false
  ): Promise<LeaveTransactionListItem[]> {
    try {
      const response = await axiosInstance.get<LeaveTransactionListItem[]>(
        `${BASE_LEAVE}/GetLeaveTransactionList`,
        { params: { empid: empId, month, year, currentyear: currentYear } }
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/LeaveTransaction/GetLeaveEmployeeTransactionList
   * Every employee's leave transactions (admin Leave Management).
   */
  async getLeaveEmployeeTransactionList(): Promise<LeaveTransactionListItem[]> {
    try {
      const response = await axiosInstance.get<LeaveTransactionListItem[]>(
        `${BASE_LEAVE}/GetLeaveEmployeeTransactionList`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/LeaveTransaction/GetLeaveTransaction/{id}
   */
  async getLeaveTransaction(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(
        `${BASE_LEAVE}/GetLeaveTransaction/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/LeaveTransaction/AddEditLeaveTransaction
   */
  async addEditLeaveTransaction(data: any): Promise<SaveResponse | any> {
    try {
      const response = await axiosInstance.post<SaveResponse>(
        `${BASE_LEAVE}/AddEditLeaveTransaction`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/LeaveTransaction/DeleteLeaveTransaction/{id}
   */
  async deleteLeaveTransaction(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_LEAVE}/DeleteLeaveTransaction/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/GetEmployeeList/{companyId}
   */
  async getEmployeeList(companyId: number = 1): Promise<LeaveEmployeeItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_UTILIZATION}/GetEmployeeList/${companyId}`
      );
      return (response.data || []).map((e: any) => ({
        id: Number(e.id ?? e.ID ?? 0),
        name: e.name ?? e.Name ?? '',
      }));
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const leaveService = new LeaveService();
export default leaveService;

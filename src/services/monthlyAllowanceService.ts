import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  AllowanceMasterModel,
  EmployeeMonthlyAllowanceModel,
  MonthlyAllowanceQueryParams,
} from '@/types/monthlyAllowance/monthlyAllowance.types';

const BASE_URL = '/api/EmployeeMonthlyAllowance';

class MonthlyAllowanceService {
  /**
   * GET /api/EmployeeMonthlyAllowance/GetMonthlyAllowanceMasterList
   * Retrieves active allowances marked as IsMonthlyAllowance = true
   */
  async getMonthlyAllowanceMasterList(): Promise<AllowanceMasterModel[]> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetMonthlyAllowanceMasterList`);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeMonthlyAllowance/GetMonthlyAllowance/{id}
   */
  async getMonthlyAllowanceById(id: number | string): Promise<EmployeeMonthlyAllowanceModel | null> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetMonthlyAllowance/${id}`);
      return response.data || null;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeMonthlyAllowance/GetMonthlyAllowancesByEmpId/{empId}?month={month}&year={year}
   */
  async getMonthlyAllowancesByEmpId(
    empId: number,
    params?: { month?: number; year?: number }
  ): Promise<EmployeeMonthlyAllowanceModel[]> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetMonthlyAllowancesByEmpId/${empId}`, {
        params: {
          month: params?.month && params.month > 0 ? params.month : undefined,
          year: params?.year && params.year > 0 ? params.year : undefined,
        },
      });
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeMonthlyAllowance/GetMonthlyAllowances?empId={empId}&month={month}&year={year}&allowanceId={allowanceId}&isActive={isActive}
   */
  async getMonthlyAllowances(
    params?: MonthlyAllowanceQueryParams
  ): Promise<EmployeeMonthlyAllowanceModel[]> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetMonthlyAllowances`, {
        params: {
          empId: params?.empId && params.empId > 0 ? params.empId : undefined,
          month: params?.month && params.month > 0 ? params.month : undefined,
          year: params?.year && params.year > 0 ? params.year : undefined,
          allowanceId: params?.allowanceId && params.allowanceId > 0 ? params.allowanceId : undefined,
          isActive: params?.isActive !== undefined ? params.isActive : undefined,
        },
      });
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/EmployeeMonthlyAllowance/AddEditMonthlyAllowance
   */
  async addEditMonthlyAllowance(
    model: Partial<EmployeeMonthlyAllowanceModel>
  ): Promise<{ success: boolean; message: string; data?: EmployeeMonthlyAllowanceModel }> {
    try {
      const payload = {
        Id: Number(model.id ?? model.Id ?? 0),
        EmpId: Number(model.empId ?? model.EmpId ?? 0),
        AllowanceId: Number(model.allowanceId ?? model.AllowanceId ?? 0),
        Month: Number(model.month ?? model.Month ?? 0),
        Year: Number(model.year ?? model.Year ?? 0),
        Amount: Number(model.amount ?? model.Amount ?? 0),
        IsActive: model.isActive !== undefined ? Boolean(model.isActive) : true,
      };

      const response = await axiosInstance.post(`${BASE_URL}/AddEditMonthlyAllowance`, payload);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/EmployeeMonthlyAllowance/DeleteMonthlyAllowance/{id}
   */
  async deleteMonthlyAllowance(id: number | string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/DeleteMonthlyAllowance/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const monthlyAllowanceService = new MonthlyAllowanceService();
export default monthlyAllowanceService;

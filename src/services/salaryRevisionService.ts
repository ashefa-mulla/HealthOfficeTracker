import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  EmployeeSalaryRevisionModel,
  SalaryRevisionQueryParams,
  SalaryRevisionPaginatedResponse,
} from '@/types/salaryRevision/salaryRevision.types';

const BASE_URL = '/api/EmployeeSalaryRevision';

class SalaryRevisionService {
  /**
   * GET /api/EmployeeSalaryRevision/GetSalaryRevisionsByEmpId/{empId}?pageNumber={pageNumber}&pageSize={pageSize}&search={search}
   * Fetches paginated salary revisions for a specific employee.
   */
  async getSalaryRevisionsByEmpId(
    empId: number,
    params?: SalaryRevisionQueryParams
  ): Promise<SalaryRevisionPaginatedResponse> {
    const pageNumber = params?.pageNumber || 1;
    const pageSize = params?.pageSize || 100;
    const cleanParams: any = {
      pageNumber,
      pageSize,
    };
    if (params?.search && params.search.trim() !== '') {
      cleanParams.search = params.search.trim();
    }

    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/GetSalaryRevisionsByEmpId/${empId}`,
        { params: cleanParams }
      );

      const resData = response.data;
      if (Array.isArray(resData)) {
        return {
          data: resData,
          totalCount: resData.length,
          pageSize,
          currentPage: pageNumber,
          totalPages: Math.ceil(resData.length / pageSize) || 1,
        };
      }

      return {
        data: Array.isArray(resData?.data) ? resData.data : [],
        totalCount: Number(resData?.totalCount ?? 0),
        pageSize: Number(resData?.pageSize ?? pageSize),
        currentPage: Number(resData?.currentPage ?? pageNumber),
        totalPages: Number(resData?.totalPages ?? 0),
      };
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeSalaryRevision/GetActiveSalaryRevision/{empId}
   * Fetches the currently active salary revision for an employee.
   */
  async getActiveSalaryRevision(empId: number): Promise<EmployeeSalaryRevisionModel | null> {
    try {
      const response = await axiosInstance.get<EmployeeSalaryRevisionModel>(
        `${BASE_URL}/GetActiveSalaryRevision/${empId}`
      );
      if (response.data && (response.data.id || response.data.ID)) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeSalaryRevision/GetSalaryRevision/{id}
   * Fetches a specific salary revision by ID.
   */
  async getSalaryRevisionById(id: number): Promise<EmployeeSalaryRevisionModel | null> {
    try {
      const response = await axiosInstance.get<EmployeeSalaryRevisionModel>(
        `${BASE_URL}/GetSalaryRevision/${id}`
      );
      return response.data || null;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeSalaryRevision/GetAllSalaryRevisions?empId={empId}
   * Fetches all salary revisions, optionally filtered by employee.
   */
  async getAllSalaryRevisions(empId?: number): Promise<EmployeeSalaryRevisionModel[]> {
    try {
      const response = await axiosInstance.get<EmployeeSalaryRevisionModel[]>(
        `${BASE_URL}/GetAllSalaryRevisions`,
        { params: empId ? { empId } : {} }
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/EmployeeSalaryRevision/AddEditSalaryRevision
   * Creates or updates a salary revision.
   */
  async addEditSalaryRevision(model: EmployeeSalaryRevisionModel): Promise<any> {
    try {
      const payload = {
        Id: model.id ?? model.ID ?? 0,
        ID: model.id ?? model.ID ?? 0,
        id: model.id ?? model.ID ?? 0,
        EmpId: model.empId ?? model.Emp_ID ?? model.emp_ID ?? model.employeeID ?? model.EmployeeID ?? 0,
        Emp_ID: model.empId ?? model.Emp_ID ?? model.emp_ID ?? model.employeeID ?? model.EmployeeID ?? 0,
        empId: model.empId ?? model.Emp_ID ?? model.emp_ID ?? model.employeeID ?? model.EmployeeID ?? 0,
        Basic: Number(model.basic ?? model.Basic ?? 0),
        basic: Number(model.basic ?? model.Basic ?? 0),
        Matrix: Number(model.matrix ?? model.Matrix ?? 0),
        matrix: Number(model.matrix ?? model.Matrix ?? 0),
        FromDate: model.fromDate ?? model.FromDate ?? null,
        fromDate: model.fromDate ?? model.FromDate ?? null,
        ToDate: model.toDate ?? model.ToDate ?? null,
        toDate: model.toDate ?? model.ToDate ?? null,
        SeqNo: Number(model.seqNo ?? model.SeqNo ?? 1),
        seqNo: Number(model.seqNo ?? model.SeqNo ?? 1),
        IsActive: model.isActive !== undefined ? Boolean(model.isActive) : true,
        isActive: model.isActive !== undefined ? Boolean(model.isActive) : true,
        CreatedBy: model.createdBy ?? model.CreatedBy ?? null,
        UpdatedBy: model.updatedBy ?? model.UpdatedBy ?? null,
      };

      const response = await axiosInstance.post(
        `${BASE_URL}/AddEditSalaryRevision`,
        payload
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/EmployeeSalaryRevision/DeleteSalaryRevision/{id}
   * Deletes a salary revision by ID.
   */
  async deleteSalaryRevision(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/DeleteSalaryRevision/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const salaryRevisionService = new SalaryRevisionService();
export default salaryRevisionService;

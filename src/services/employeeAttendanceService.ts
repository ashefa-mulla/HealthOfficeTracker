import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  EmployeeAttendanceQueryParams,
  EmployeeAttendancePaginatedResponse,
  EmployeeAttendanceModel,
  UploadAttendanceResult,
} from '@/types/employeeAttendance/employeeAttendance.types';

const BASE_URL = '/api/EmployeeAttendance';

class EmployeeAttendanceService {
  /**
   * GET /api/EmployeeAttendance/GetEmployeeAttendanceList?empId={empId}&month={month}&year={year}&pageNumber={pageNumber}&pageSize={pageSize}&search={search}
   * Fetches employee attendance records using server-side pagination and filters.
   */
  async getEmployeeAttendanceList(
    params?: EmployeeAttendanceQueryParams
  ): Promise<EmployeeAttendancePaginatedResponse> {
    const pageNumber = params?.pageNumber || 1;
    const pageSize = params?.pageSize || 100;

    try {
      const cleanParams: any = {
        pageNumber,
        pageSize,
      };

      if (params?.empId && Number(params.empId) > 0) cleanParams.empId = Number(params.empId);
      if (params?.month && Number(params.month) > 0) cleanParams.month = Number(params.month);
      if (params?.year && Number(params.year) > 0) cleanParams.year = Number(params.year);
      if (params?.search && params.search.trim() !== '') cleanParams.search = params.search.trim();

      const response = await axiosInstance.get(
        `${BASE_URL}/GetEmployeeAttendanceList`,
        { params: cleanParams }
      );

      const resData = response.data;
      return {
        data: Array.isArray(resData?.data) ? resData.data : Array.isArray(resData) ? resData : [],
        totalCount: Number(resData?.totalCount ?? 0),
        pageSize: Number(resData?.pageSize ?? pageSize),
        currentPage: Number(resData?.currentPage ?? pageNumber),
        totalPages: Number(resData?.totalPages ?? 0),
      };
    } catch (error: any) {
      const status = error?.status ?? error?.response?.status;
      if (status === 404) {
        return {
          data: [],
          totalCount: 0,
          pageSize,
          currentPage: pageNumber,
          totalPages: 0,
        };
      }
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeAttendance/GetEmployeeAttendance/{id}
   * Fetches employee attendance by record ID.
   */
  async getEmployeeAttendanceById(id: number): Promise<EmployeeAttendanceModel | null> {
    try {
      const response = await axiosInstance.get<EmployeeAttendanceModel>(
        `${BASE_URL}/GetEmployeeAttendance/${id}`
      );
      return response.data || null;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/EmployeeAttendance/GetEmployeeAttendance?empId={empId}&month={month}&year={year}
   * Fetches employee attendance by employee, month, and year.
   */
  async getEmployeeAttendanceByEmpAndMonthYear(
    empId: number,
    month: number,
    year: number
  ): Promise<EmployeeAttendanceModel | null> {
    try {
      const response = await axiosInstance.get<EmployeeAttendanceModel>(
        `${BASE_URL}/GetEmployeeAttendance`,
        { params: { empId, month, year } }
      );
      return response.data || null;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/EmployeeAttendance/AddEditEmployeeAttendance
   * Inserts or updates employee attendance.
   */
  async addEditEmployeeAttendance(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_URL}/AddEditEmployeeAttendance`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/EmployeeAttendance/DeleteEmployeeAttendance/{id}
   * Deletes employee attendance record by ID.
   */
  async deleteEmployeeAttendance(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_URL}/DeleteEmployeeAttendance/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/EmployeeAttendance/UploadAttendanceExcel
   * Uploads an Excel (.xlsx, .xls) or CSV (.csv) file containing employee attendance.
   */
  async uploadAttendanceExcel(file: File): Promise<UploadAttendanceResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post<UploadAttendanceResult>(
        `${BASE_URL}/UploadAttendanceExcel`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const res = response.data;
      return {
        success: res.success ?? res.Success ?? true,
        message: res.message ?? res.Message ?? 'Excel processed successfully.',
        totalRows: res.totalRows ?? res.TotalRows ?? 0,
        insertedCount: res.insertedCount ?? res.InsertedCount ?? 0,
        updatedCount: res.updatedCount ?? res.UpdatedCount ?? 0,
        failedCount: res.failedCount ?? res.FailedCount ?? 0,
        errors: res.errors ?? res.Errors ?? [],
      };
    } catch (error: any) {
      const responseData = error?.response?.data;
      if (
        responseData &&
        typeof responseData === 'object' &&
        ('message' in responseData || 'Message' in responseData)
      ) {
        return {
          success: false,
          message:
            responseData.message ||
            responseData.Message ||
            'Failed to upload attendance excel.',
          totalRows: responseData.totalRows ?? responseData.TotalRows ?? 0,
          insertedCount: responseData.insertedCount ?? responseData.InsertedCount ?? 0,
          updatedCount: responseData.updatedCount ?? responseData.UpdatedCount ?? 0,
          failedCount: responseData.failedCount ?? responseData.FailedCount ?? 0,
          errors: responseData.errors ?? responseData.Errors ?? [],
        };
      }
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * Fetches employee dropdown list for selection.
   * Tries /api/UtilizationTracker/GetEmployeeList/{companyId} first,
   * then /api/Employee/getuserlist, then /api/Dashborad/GetTaem.
   */
  async getEmployeeList(companyId: number = 1): Promise<{ id: number; name: string }[]> {
    // 1. Primary: /api/UtilizationTracker/GetEmployeeList/{companyId}
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/UtilizationTracker/GetEmployeeList/${companyId}`
      );
      const raw = Array.isArray(response.data) ? response.data : [];
      const list = raw
        .map((r: any) => {
          const id = Number(r.id ?? r.ID ?? r.empId ?? r.Emp_ID ?? 0);
          const rawName =
            r.name ??
            r.Name ??
            r.fullname ??
            r.Fullname ??
            [r.firstname || r.firstName, r.lastname || r.lastName].filter(Boolean).join(' ');
          const name = String(rawName || '').trim();
          return { id, name };
        })
        .filter((r) => r.id > 0 && r.name && !r.name.toLowerCase().includes('--select--'));

      if (list.length > 0) {
        return list;
      }
    } catch (err) {
      console.warn('UtilizationTracker/GetEmployeeList failed, trying fallback...', err);
    }

    // 2. Fallback: /api/Employee/getuserlist
    try {
      const response = await axiosInstance.get<any[]>('/api/Employee/getuserlist');
      const users = Array.isArray(response.data) ? response.data : [];
      const list = users
        .map((u: any) => {
          const id = Number(u.id ?? u.ID ?? 0);
          const fullName = [u.firstname || u.firstName, u.lastname || u.lastName]
            .filter(Boolean)
            .join(' ')
            .trim();
          const name = fullName || u.fullname || u.Fullname || u.name || u.Name || `Employee #${id}`;
          return { id, name };
        })
        .filter((u) => u.id > 0);

      if (list.length > 0) {
        return list;
      }
    } catch (err) {
      console.warn('Employee/getuserlist fallback failed, trying GetTaem...', err);
    }

    // 3. Fallback: /api/Dashborad/GetTaem
    try {
      const response = await axiosInstance.get<any[]>('/api/Dashborad/GetTaem');
      const team = Array.isArray(response.data) ? response.data : [];
      const list = team
        .map((t: any) => ({
          id: Number(t.id ?? t.ID ?? 0),
          name: String(t.name ?? t.Name ?? `Employee #${t.id ?? t.ID}`).trim(),
        }))
        .filter((t) => t.id > 0 && !t.name.toLowerCase().includes('--select--'));

      return list;
    } catch (err) {
      console.warn('All employee list endpoints failed:', err);
      return [];
    }
  }
}

export const employeeAttendanceService = new EmployeeAttendanceService();
export default employeeAttendanceService;

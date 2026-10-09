import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  TaskActivityItem,
  TaskActivityQueryParams,
  TaskActivityPageResponse,
} from '@/types/activity/activity.types';

const BASE_UTILIZATION = '/api/UtilizationTracker';

class TaskActivityService {
  /**
   * GET /api/UtilizationTracker/GetActiveLogOfEmployeeWithPagination
   * Calls the paginated endpoint with optional start/end date, Employeeid, utype, pageNumber, pageSize, and search.
   */
  async getActiveLogOfEmployeeWithPagination(
    params: TaskActivityQueryParams
  ): Promise<TaskActivityPageResponse> {
    try {
      const response = await axiosInstance.get<any>(
        `${BASE_UTILIZATION}/GetActiveLogOfEmployeeWithPagination`,
        {
          params: {
            start: params.start || null,
            end: params.end || null,
            Employeeid: params.Employeeid || null,
            utype: params.utype ?? 3,
            pageNumber: params.pageNumber ?? 1,
            pageSize: params.pageSize ?? 10,
            search: params.search || null,
          },
        }
      );

      const resData = response.data || {};
      const data: TaskActivityItem[] = Array.isArray(resData.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];

      const totalCount = Number(
        resData.totalCount ??
          resData.TotalCount ??
          resData.totalRecords ??
          resData.TotalRecords ??
          data.length
      );

      const pageSize = Number(resData.pageSize ?? params.pageSize ?? 10);
      const currentPage = Number(resData.currentPage ?? params.pageNumber ?? 1);
      const calculatedPages = Math.ceil(totalCount / (pageSize || 10)) || 1;
      const totalPages = Number(resData.totalPages ?? calculatedPages);

      return {
        data,
        totalCount,
        pageSize,
        currentPage,
        totalPages,
      };
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return {
          data: [],
          totalCount: 0,
          pageSize: params.pageSize ?? 10,
          currentPage: params.pageNumber ?? 1,
          totalPages: 0,
        };
      }
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/EditTrackertask/{trackerTaskId}
   * Fetches task activity details for editing
   */
  async getEditTrackerTaskById(trackerTaskId: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(
        `${BASE_UTILIZATION}/EditTrackertask/${trackerTaskId}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/UtilizationTracker/EditTrackertask
   * Saves updated task activity record
   */
  async editTrackerTask(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_UTILIZATION}/EditTrackertask`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/GetEmployeeList/{companyId}
   * Fetches employee dropdown list for admin activity assignment
   */
  async getEmployeeList(companyId: number = 1): Promise<any[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_UTILIZATION}/GetEmployeeList/${companyId}`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Reports/DownloadActiveLogReport
   * Downloads or opens the active log PDF report for an employee
   */
  async downloadActiveLogReport(params: {
    stdt: string;
    enddt: string;
    empid: number;
    uid?: number;
  }): Promise<Blob> {
    try {
      const response = await axiosInstance.get('/api/Reports/DownloadActiveLogReport', {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
          empid: params.empid,
          uid: params.uid ?? 3,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      // If error is a Blob containing JSON error message, extract it
      if (error?.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          throw new Error(parsed.message || parsed || 'Failed to download report.');
        } catch (parseErr: any) {
          if (parseErr.message && !parseErr.message.includes('JSON')) {
            throw parseErr;
          }
        }
      }
      throw axiosErrorToApiError(error);
    }
  }
}

export const taskActivityService = new TaskActivityService();
export default taskActivityService;

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
}

export const taskActivityService = new TaskActivityService();
export default taskActivityService;

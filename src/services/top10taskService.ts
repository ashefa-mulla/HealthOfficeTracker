import axiosInstance from '@/config/axiosInstance';
import { ApiResponse, SaveResponse } from '@/types/api.types';
import { axiosErrorToApiError } from '@/types/errors';
import {
  Top10TaskListItem,
  Top10TaskModel,
  EmployerNameListItem,
  TrackerProjectItem,
  TrackerSubProjectItem,
  TrackerSubProjectCategoryItem,
  Top10TaskPageResponse,
} from '@/types/top10task/top10task.types';

const BASE_TOP10 = '/api/Top10TaskList';
const BASE_UTILIZATION = '/api/UtilizationTracker';

class Top10TaskService {
  /**
   * GET /api/Top10TaskList/GetTaskListForUser?EmpID={empId}&status={status}
   */
  async getTaskListForUser(
    empId: number,
    status: string = 'P'
  ): Promise<Top10TaskListItem[]> {
    try {
      const response = await axiosInstance.get<Top10TaskListItem[]>(
        `${BASE_TOP10}/GetTaskListForUser`,
        {
          params: {
            EmpID: empId,
            employeeid: empId,
            status,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Top10TaskList/gettasklistforuserwithpegination?EmpID={empId}&status={status}&pageNumber={page}&pageSize={pageSize}
   */
  async getTaskListForUserWithPagination(
    empId: number,
    status: string = 'P',
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<Top10TaskPageResponse> {
    try {
      const response = await axiosInstance.get<any>(
        `${BASE_TOP10}/gettasklistforuserwithpegination`,
        {
          params: {
            EmpID: empId,
            status,
            pageNumber,
            pageSize,
          },
        }
      );

      let rawItems: any[] = [];
      let total = 0;

      // Check X-Pagination header
      const xPagination =
        response.headers?.['x-pagination'] ||
        response.headers?.['X-Pagination'];
      if (xPagination) {
        try {
          const parsedHeader =
            typeof xPagination === 'string'
              ? JSON.parse(xPagination)
              : xPagination;
          total = Number(
            parsedHeader.totalRecords ??
              parsedHeader.TotalRecords ??
              parsedHeader.totalCount ??
              parsedHeader.TotalCount ??
              0
          );
        } catch {
          // ignore json parse error
        }
      }

      if (response.data && Array.isArray(response.data.data)) {
        rawItems = response.data.data;
        if (!total) {
          total = Number(
            response.data.totalCount ??
              response.data.TotalCount ??
              response.data.totalRecords ??
              response.data.TotalRecords ??
              response.data.total ??
              response.data.Total ??
              response.data.count ??
              response.data.Count ??
              response.data.xpage?.totalRecords ??
              0
          );
        }
      } else if (Array.isArray(response.data)) {
        rawItems = response.data;
      } else if (response.data && typeof response.data === 'object') {
        rawItems =
          response.data.items ||
          response.data.list ||
          response.data.data ||
          response.data.results ||
          [];
        if (!total) {
          total = Number(
            response.data.totalCount ??
              response.data.TotalCount ??
              response.data.totalRecords ??
              response.data.TotalRecords ??
              response.data.total ??
              response.data.Total ??
              response.data.count ??
              response.data.Count ??
              0
          );
        }
      }

      // Check if items contain TotalCount property from SQL stored procedure (e.g. COUNT(*) OVER() AS TotalCount)
      if (!total && rawItems.length > 0) {
        const first = rawItems[0];
        const itemTotal =
          first.TotalCount ??
          first.totalCount ??
          first.TotalRecords ??
          first.totalRecords ??
          first.Total ??
          first.total ??
          first.Total_Count ??
          first.total_count ??
          first.RecordCount ??
          first.recordCount ??
          first.TotalRows ??
          first.totalRows;
        if (
          itemTotal !== undefined &&
          itemTotal !== null &&
          !isNaN(Number(itemTotal)) &&
          Number(itemTotal) > 0
        ) {
          total = Number(itemTotal);
        }
      }

      if (!total) {
        total = rawItems.length;
      }

      return {
        data: rawItems,
        totalCount: total,
      };
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Top10TaskList/gettasklistforuserpendinglist/{empId}
   */
  async getTaskListForUserPendingList(
    empId: number
  ): Promise<Top10TaskListItem[]> {
    try {
      const response = await axiosInstance.get<Top10TaskListItem[]>(
        `${BASE_TOP10}/gettasklistforuserpendinglist/${empId}`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Top10TaskList/GetTaskbyID/{id}
   */
  async getTaskById(id: number): Promise<Top10TaskModel> {
    try {
      const response = await axiosInstance.get<Top10TaskModel>(
        `${BASE_TOP10}/GetTaskbyID/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/Top10TaskList/AddorEditTaskList
   */
  async addOrEditTaskList(data: Top10TaskModel): Promise<SaveResponse | any> {
    try {
      const response = await axiosInstance.post<SaveResponse>(
        `${BASE_TOP10}/AddorEditTaskList`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Top10TaskList/GetTaskListDetail
   */
  async getTaskListDetail(): Promise<Top10TaskListItem[]> {
    try {
      const response = await axiosInstance.get<Top10TaskListItem[]>(
        `${BASE_TOP10}/GetTaskListDetail`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Top10TaskList/GetEmployerName
   */
  async getEmployerNameList(): Promise<EmployerNameListItem[]> {
    try {
      const response = await axiosInstance.get<EmployerNameListItem[]>(
        `${BASE_TOP10}/GetEmployerName`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/GetTrackerProject?companyid={companyId}&branchid={branchId}
   */
  async getTrackerProject(
    companyId: number = 1,
    branchId: number = 1
  ): Promise<TrackerProjectItem[]> {
    try {
      const response = await axiosInstance.get<TrackerProjectItem[]>(
        `${BASE_UTILIZATION}/GetTrackerProject`,
        {
          params: {
            companyid: companyId,
            branchid: branchId,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/GetTrackerSubProject/{projectId}
   */
  async getTrackerSubProject(
    projectId: number
  ): Promise<TrackerSubProjectItem[]> {
    try {
      const response = await axiosInstance.get<TrackerSubProjectItem[]>(
        `${BASE_UTILIZATION}/GetTrackerSubProject/${projectId}`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/GetTrackerSubProjectCategory?projectid={projectId}&subprojectcategoryid={subProjectCategoryId}
   */
  async getTrackerSubProjectCategory(
    projectId: number,
    subProjectCategoryId: number
  ): Promise<TrackerSubProjectCategoryItem[]> {
    try {
      const response = await axiosInstance.get<TrackerSubProjectCategoryItem[]>(
        `${BASE_UTILIZATION}/GetTrackerSubProjectCategory`,
        {
          params: {
            projectid: projectId,
            subprojectcategoryid: subProjectCategoryId,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/UtilizationTracker/GetTrackerTask/{empId}
   */
  async getTrackerTask(empId: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(
        `${BASE_UTILIZATION}/GetTrackerTask/${empId}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/UtilizationTracker/AddEditTrackerTask
   */
  async addEditTrackerTask(
    data: any
  ): Promise<SaveResponse | any> {
    try {
      const response = await axiosInstance.post<SaveResponse>(
        `${BASE_UTILIZATION}/AddEditTrackerTask`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/Top10TaskList/DeleteTask/{id}
   */
  async deleteTask(id: number): Promise<boolean | SaveResponse> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_TOP10}/DeleteTask/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const top10TaskService = new Top10TaskService();
export default top10TaskService;

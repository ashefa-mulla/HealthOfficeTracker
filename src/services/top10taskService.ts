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
            employeeid: empId,
            status,
            pageNumber,
            pageSize,
          },
        }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return {
          data: response.data.data,
          totalCount: response.data.totalCount || response.data.data.length,
        };
      } else if (Array.isArray(response.data)) {
        return {
          data: response.data,
          totalCount: response.data.length,
        };
      } else {
        return {
          data: response.data?.items || response.data?.list || [],
          totalCount: response.data?.totalCount || response.data?.totalRecords || 0,
        };
      }
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

import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { ProjectListItem } from '@/types/project/project.types';
import { LookupItem } from '@/types/employee/employee.types';

const BASE_PROJECT = '/api/TrackerSubProject';

const toLookup = (rows: any[], nameKey: string = 'name'): LookupItem[] =>
  (rows || [])
    .map((r: any) => {
      const key = nameKey.charAt(0).toUpperCase() + nameKey.slice(1);
      return {
        id: Number(r.id ?? r.ID ?? 0),
        name: r[nameKey] ?? r[key] ?? '',
      };
    })
    .filter((r) => r.id > 0);

class ProjectService {
  /**
   * GET /api/TrackerSubProject/GetTrackerSubProjectList
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getProjectList(): Promise<ProjectListItem[]> {
    try {
      const response = await axiosInstance.get<ProjectListItem[]>(
        `${BASE_PROJECT}/GetTrackerSubProjectList`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/TrackerSubProject/GetTrackerSubProject/{id}
   */
  async getProject(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_PROJECT}/GetTrackerSubProject/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/TrackerSubProject/addeditSubProject
   */
  async addEditProject(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_PROJECT}/addeditSubProject`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/TrackerSubProject/deleteSubProject/{id}
   */
  async deleteProject(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(`${BASE_PROJECT}/deleteSubProject/${id}`);
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/TrackerSubProject/GetCompanies */
  async getCompanies(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_PROJECT}/GetCompanies`);
      return toLookup(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/TrackerSubProject/GetProjects (clients: id, project) */
  async getClients(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_PROJECT}/GetProjects`);
      return toLookup(response.data, 'project');
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/TrackerSubProject/GetProjectCategoryList */
  async getCategories(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_PROJECT}/GetProjectCategoryList`);
      return toLookup(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const projectService = new ProjectService();
export default projectService;

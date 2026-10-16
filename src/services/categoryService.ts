import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { CategoryListItem } from '@/types/category/category.types';
import { LookupItem } from '@/types/employee/employee.types';

const BASE_CATEGORY = '/api/TrackerSubProjectCategory';

class CategoryService {
  /**
   * GET /api/TrackerSubProjectCategory/GetTrackerSubProjectcategoryWithProjectList
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getCategoryList(): Promise<CategoryListItem[]> {
    try {
      const response = await axiosInstance.get<CategoryListItem[]>(
        `${BASE_CATEGORY}/GetTrackerSubProjectcategoryWithProjectList`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/TrackerSubProjectCategory/GetTrackerSubProjectCategorybyID/{id}
   */
  async getCategory(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(
        `${BASE_CATEGORY}/GetTrackerSubProjectCategorybyID/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/TrackerSubProjectCategory/addeditSubProjectCategory
   */
  async addEditCategory(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_CATEGORY}/addeditSubProjectCategory`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/TrackerSubProjectCategory/deleteSubProjectCategory/{id}
   */
  async deleteCategory(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_CATEGORY}/deleteSubProjectCategory/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/TrackerSubProjectCategory/GetTrackerSubProjectList/{clientId}
   * Projects (TblTrackerSubProject: id, subcategory) under a client.
   */
  async getProjectsByClient(clientId: number): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_CATEGORY}/GetTrackerSubProjectList/${clientId}`
      );
      return (response.data || [])
        .map((r: any) => ({
          id: Number(r.id ?? r.Id ?? 0),
          name: r.subcategory ?? r.Subcategory ?? '',
        }))
        .filter((r) => r.id > 0);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;

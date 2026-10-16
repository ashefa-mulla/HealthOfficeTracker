import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { AccountCategoryListItem } from '@/types/accountCategory/accountCategory.types';

const BASE_ACCOUNT_CATEGORY = '/api/AccountCategory';

class AccountCategoryService {
  /**
   * GET /api/AccountCategory/GetAllAccountCategoryList
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getAccountCategoryList(): Promise<AccountCategoryListItem[]> {
    try {
      const response = await axiosInstance.get<AccountCategoryListItem[]>(
        `${BASE_ACCOUNT_CATEGORY}/GetAllAccountCategoryList`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/AccountCategory/GetCategory/{id}
   */
  async getAccountCategory(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_ACCOUNT_CATEGORY}/GetCategory/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/AccountCategory/addeditAccountCategory
   */
  async addEditAccountCategory(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_ACCOUNT_CATEGORY}/addeditAccountCategory`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/AccountCategory/deleteaccountaategory/{id}
   * (the API route really is spelled "aategory")
   */
  async deleteAccountCategory(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_ACCOUNT_CATEGORY}/deleteaccountaategory/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const accountCategoryService = new AccountCategoryService();
export default accountCategoryService;

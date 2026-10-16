import axiosInstance from '@/config/axiosInstance';
import { SaveResponse } from '@/types/api.types';
import { axiosErrorToApiError } from '@/types/errors';
import {
  EmployeeListItem,
  LookupItem,
} from '@/types/employee/employee.types';

const BASE_EMPLOYEE = '/api/Employee';
const BASE_COMMON = '/api/Common';

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

class EmployeeService {
  /**
   * GET /api/Employee/getuserlist
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getUserList(): Promise<EmployeeListItem[]> {
    try {
      const response = await axiosInstance.get<EmployeeListItem[]>(
        `${BASE_EMPLOYEE}/getuserlist`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Employee/get/{id}
   */
  async getEmployee(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_EMPLOYEE}/get/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/Employee/AddEditEmployee
   */
  async addEditEmployee(data: any): Promise<SaveResponse | any> {
    try {
      const response = await axiosInstance.post<SaveResponse>(
        `${BASE_EMPLOYEE}/AddEditEmployee`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/Employee/changepassword
   * The API verifies OldPassword before setting the new one.
   */
  async changePassword(data: {
    identityID: string;
    oldPassword: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_EMPLOYEE}/changepassword`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/Employee/Changeusername
   */
  async changeUserName(data: { identityID: string; userName: string }): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_EMPLOYEE}/Changeusername`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/Employee/delete/{id}
   */
  async deleteEmployee(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_EMPLOYEE}/delete/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/Common/GetCountries */
  async getCountries(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_COMMON}/GetCountries`);
      return toLookup(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/Common/GetStates/{countryId} */
  async getStates(countryId: number): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_COMMON}/GetStates/${countryId}`
      );
      return toLookup(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/Common/GetCities/{stateId} */
  async getCities(stateId: number): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_COMMON}/GetCities/${stateId}`
      );
      return toLookup(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/Common/GetDesignation */
  async getDesignations(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_COMMON}/GetDesignation`);
      return toLookup(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/Common/GetUserTypes (TblUserType: id, type) */
  async getUserTypes(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_COMMON}/GetUserTypes`);
      return toLookup(response.data, 'type');
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/Common/GetTimeZone (TblTimezone: id, nameOfTimeZone) */
  async getTimeZones(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_COMMON}/GetTimeZone`);
      return toLookup(response.data, 'nameOfTimeZone');
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/Common?foldername={folder}  (the API upload action has no extra route segment)
   * Returns the stored relative path (dbPath) to save on the employee record.
   */
  async uploadFile(file: File, folder: string = 'Employer'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post<{ dbPath: string }>(
        BASE_COMMON,
        formData,
        {
          params: { foldername: folder },
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data?.dbPath || '';
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const employeeService = new EmployeeService();
export default employeeService;

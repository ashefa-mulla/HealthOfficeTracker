import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { isAxiosError } from 'axios';
import {
  AllowanceMasterListItem,
  AllowanceTypeOption,
} from '@/types/allowanceMaster/allowanceMaster.types';
import { AllowanceMasterForm } from '@/types/allowanceMaster/allowanceMaster.schema';

const BASE_URL = '/api/EmployeeAllowanceMaster';

/** Accepts camelCase (default JSON) or PascalCase from the .NET serializer. */
const toListItem = (r: any): AllowanceMasterListItem => ({
  id: Number(r?.id ?? r?.Id ?? 0),
  allowanceName: String(r?.allowanceName ?? r?.AllowanceName ?? ''),
  allowanceCode: String(r?.allowanceCode ?? r?.AllowanceCode ?? ''),
  allowanceType: String(r?.allowanceType ?? r?.AllowanceType ?? ''),
  description: String(r?.description ?? r?.Description ?? ''),
});

/** Keeps the server's plain-text error (e.g. "Allowance code already exists.") as the message. */
const toError = (error: unknown): Error => {
  if (isAxiosError(error) && typeof error.response?.data === 'string' && error.response.data) {
    return new Error(error.response.data);
  }
  return axiosErrorToApiError(error);
};

class AllowanceMasterService {
  /** GET /api/EmployeeAllowanceMaster/GetAllowanceMasterList?isActive=true */
  async getAllowanceMasterList(isActive: boolean | null = true): Promise<AllowanceMasterListItem[]> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetAllowanceMasterList`, {
        params: { isActive: isActive ?? undefined },
      });
      return Array.isArray(response.data) ? response.data.map(toListItem) : [];
    } catch (error) {
      throw toError(error);
    }
  }

  /** GET /api/EmployeeAllowanceMaster/GetAllowanceMaster/{id} */
  async getAllowanceMaster(id: number): Promise<AllowanceMasterListItem | null> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetAllowanceMaster/${id}`);
      return response.data ? toListItem(response.data) : null;
    } catch (error) {
      throw toError(error);
    }
  }

  /** GET /api/EmployeeAllowanceMaster/GetAllowanceTypes */
  async getAllowanceTypes(): Promise<AllowanceTypeOption[]> {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/GetAllowanceTypes`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw toError(error);
    }
  }

  /** POST /api/EmployeeAllowanceMaster/addeditAllowanceMaster (Id = 0 creates, otherwise updates) */
  async saveAllowanceMaster(form: AllowanceMasterForm): Promise<{ success: boolean; message: string }> {
    try {
      const payload = {
        id: Number(form.id ?? 0),
        allowanceName: form.allowanceName.trim(),
        allowanceCode: form.allowanceCode.trim(),
        allowanceType: form.allowanceType,
        description: (form.description ?? '').trim(),
      };
      const response = await axiosInstance.post(`${BASE_URL}/addeditAllowanceMaster`, payload);
      return response.data ?? { success: true, message: 'Allowance saved successfully.' };
    } catch (error) {
      throw toError(error);
    }
  }

  /** DELETE /api/EmployeeAllowanceMaster/DeActivateAllowanceMaster/{id} (soft delete) */
  async deActivateAllowanceMaster(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/DeActivateAllowanceMaster/${id}`);
      return response.data ?? { success: true, message: 'Allowance deactivated successfully.' };
    } catch (error) {
      throw toError(error);
    }
  }
}

export const allowanceMasterService = new AllowanceMasterService();
export default allowanceMasterService;

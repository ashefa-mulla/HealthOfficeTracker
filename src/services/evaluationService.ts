import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  EvaluationLockPayload,
  EvaluationQuestionPayload,
  EvaluationRow,
  EvaluationSubmissionPayload,
} from '@/types/evaluation/evaluation.types';
import { toEvaluationRow } from '@/types/evaluation/evaluation.mapper';

const BASE_EMPLOYEE = '/api/employee';

class EvaluationService {
  /**
   * GET /api/employee/getmonthlyevaluationsummary?employeeId={id}&evalYear={y}&evalMonth={m}
   * The API answers 404 when the employee has no questions yet; that is an empty list, not an error
   * (no toast - the page shows its own "No evaluation for this user" message).
   */
  async getMonthlySummary(
    employeeId: number,
    evalYear: number,
    evalMonth: number
  ): Promise<EvaluationRow[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_EMPLOYEE}/getmonthlyevaluationsummary`,
        { params: { employeeId, evalYear, evalMonth } }
      );
      return Array.isArray(response.data) ? response.data.map(toEvaluationRow) : [];
    } catch (error) {
      // The shared axios instance already converts errors to ApiError (with .status)
      const status = (error as any)?.status ?? (error as any)?.response?.status;
      if (status === 404) return [];
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetTaem (the API route really is spelled "GetTaem")
   * Same employee list the old Angular Evaluation screen used.
   */
  async getTeamList(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axiosInstance.get<any[]>('/api/Dashborad/GetTaem');
      return (Array.isArray(response.data) ? response.data : [])
        .map((e: any) => ({
          id: Number(e.id ?? e.ID ?? 0),
          name: e.name ?? e.Name ?? '',
        }))
        .filter((e) => e.id > 0);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/employee/addmonthlyevaluationsubmission
   * Saves a batch of weekly answers (insert when id = 0, update otherwise).
   */
  async saveSubmissions(data: EvaluationSubmissionPayload[]): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_EMPLOYEE}/addmonthlyevaluationsubmission`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/employee/lockevaluation
   */
  async saveLock(data: EvaluationLockPayload): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_EMPLOYEE}/lockevaluation`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/employee/addeditevaluationquestion
   */
  async addEditQuestion(data: EvaluationQuestionPayload): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_EMPLOYEE}/addeditevaluationquestion`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/employee/toggleevaluationquestionstatus/{id}
   */
  async toggleQuestionStatus(id: number): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        `${BASE_EMPLOYEE}/toggleevaluationquestionstatus/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/employee/deleteevaluationquestion/{id}
   */
  async deleteQuestion(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(
        `${BASE_EMPLOYEE}/deleteevaluationquestion/${id}`
      );
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const evaluationService = new EvaluationService();
export default evaluationService;

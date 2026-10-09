import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';

const BASE_DAILYTODO = '/api/DailyTodo';

class DailyTodoService {
  /**
   * GET api/DailyTodo/GetDailyEvents?start=${start}&end=${end}&s_mm=${s_mm}&s_yy=${s_yy}&empid=${empid}&callid=${callid}
   */
  async onGetDailyEvents(
    start: string,
    end: string,
    s_mm: string,
    s_yy: string,
    empid: number,
    callid: number = 0
  ): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DAILYTODO}/GetDailyEvents`,
        {
          params: {
            start,
            end,
            s_mm,
            s_yy,
            empid,
            callid,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET api/DailyTodo/GetDailySummary?start=${start}&end=${end}&empid=${empid}
   */
  async onGetDailySummary(
    start: string,
    end: string,
    empid: number
  ): Promise<any> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DAILYTODO}/GetDailySummary`,
        {
          params: {
            start,
            end,
            empid,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET api/DailyTodo/GetTodo/{id}
   */
  async onGetTodobyID(id: number | string): Promise<any> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DAILYTODO}/GetTodo/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET api/DailyTodo/GetTasklist/{id}
   */
  async onGettasklistbyID(id: number | string): Promise<any> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DAILYTODO}/GetTasklist/${id}`
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST api/DailyTodo/AddEditTodo
   */
  async onAddEditTodo(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post(
        `${BASE_DAILYTODO}/AddEditTodo`,
        data
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const dailyTodoService = new DailyTodoService();
export default dailyTodoService;

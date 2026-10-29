/**
 * Dashboard API Service for HO Tracker
 * Converted from Angular dashboard.service.ts
 */

import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import {
  Below3HrEmpDuration,
  MentionPointsSummary,
  NotTrackedEmployee,
  OnlineEmployeeDashboard,
  PurchaseOrderDueDateEvent,
  ClientProjectSummaryItem,
  OutstandingInvoiceSummary,
  EmployeeWorkTimeSummary,
  EmployeeActivityDetail,
} from '@/types/dashboard/dashboard.types';

const BASE_DASHBOARD = '/api/Dashborad';

class DashboardService {
  /**
   * GET /api/Dashborad/onlineemployeedashboard?userIds=${userIds}
   * Fetches real-time productivity statistics for online employees
   */
  async getOnlineEmployeeDashboard(userIds: string): Promise<OnlineEmployeeDashboard[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/onlineemployeedashboard`,
        {
          params: { userIds: userIds || '' },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetEmployeesNotTrackedYesterday
   * Fetches employees who did not track any hours yesterday
   */
  async getEmployeesNotTrackedYesterday(): Promise<NotTrackedEmployee[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetEmployeesNotTrackedYesterday`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetBelow3HrEmployeeDailyDuration?startDate=${startDate}&endDate=${endDate}
   * Fetches list of employees who logged under 3 hours for a date range
   */
  async getBelow3HrEmployeeDailyDuration(
    startDate: string,
    endDate: string
  ): Promise<Below3HrEmpDuration[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetBelow3HrEmployeeDailyDuration`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetMentionPointsSummary?startDate=${startDate}&endDate=${endDate}
   * Fetches positive and negative mention points summary per employee
   */
  async getMentionPointsSummary(
    startDate: string,
    endDate: string
  ): Promise<MentionPointsSummary[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetMentionPointsSummary`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/PurchaseOrder/GetPurchaseOrderDueDateEvents?mon=${month}&year=${year}
   * Fetches Purchase Order due date events for calendar display
   */
  async getPurchaseOrderDueDateList(
    month: number,
    year: number
  ): Promise<PurchaseOrderDueDateEvent[]> {
    try {
      const response = await axiosInstance.get(
        '/api/PurchaseOrder/GetPurchaseOrderDueDateEvents',
        {
          params: { mon: month, year },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetCurrentMonthOutstanding?adminId=${adminId}
   * Fetches current month outstanding invoice amount for clinicians/clients
   */
  async getCurrentMonthOutstanding(
    adminId: number | string = 0
  ): Promise<OutstandingInvoiceSummary> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetCurrentMonthOutstanding`,
        {
          params: { adminId },
        }
      );
      return response.data || {};
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/clientprojectsummerybyperson?adminId=${adminId}&start=${start}&end=${end}
   * Fetches billable vs non-billable summary per person
   */
  async getClientProjectSummaryByPerson(
    adminId: number | string,
    start: string,
    end: string
  ): Promise<ClientProjectSummaryItem[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/clientprojectsummerybyperson`,
        {
          params: { adminId, start, end },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetNotification
   * Fetches notifications list
   */
  async getNotificationList(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetNotification`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetTaem
   * Fetches team members list
   */
  async getTeamList(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetTaem`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/employeetaskdummaryforyesterday
   * Fetches task summary for yesterday
   */
  async getEmployeeTaskSummaryForYesterdayList(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/employeetaskdummaryforyesterday`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetTodayLeaveList
   * Fetches today's leave list
   */
  async getTodayLeaveList(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/GetTodayLeaveList`
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/DailyTodo/getdailytaskforall
   */
  async getTaskDetails(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/api/DailyTodo/getdailytaskforall');
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/clientgraphreport?stdt=${stdt}&enddt=${enddt}&empid=${empid}
   */
  async clientGraph(
    stdt: string,
    enddt: string,
    empid: number | string = 0
  ): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_DASHBOARD}/clientgraphreport`,
        {
          params: { stdt, enddt, empid },
        }
      );
      return response.data || [];
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetEmployeeWorkTimeSummary?reportDate=&employeeId=
   * Per-employee total tracked time for a day (API returns 404 when there is no data)
   */
  async getEmployeeWorkTimeSummary(
    reportDate?: string,
    employeeId?: number
  ): Promise<EmployeeWorkTimeSummary[]> {
    try {
      const response = await axiosInstance.get(`${BASE_DASHBOARD}/GetEmployeeWorkTimeSummary`, {
        params: { reportDate, employeeId },
      });
      return response.data || [];
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/Dashborad/GetEmployeeActivityDetails?reportDate=&employeeId=
   * Activity-level log for an employee on a day (API returns 404 when there is no data)
   */
  async getEmployeeActivityDetails(
    reportDate?: string,
    employeeId?: number
  ): Promise<EmployeeActivityDetail[]> {
    try {
      const response = await axiosInstance.get(`${BASE_DASHBOARD}/GetEmployeeActivityDetails`, {
        params: { reportDate, employeeId },
      });
      return response.data || [];
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      throw axiosErrorToApiError(error);
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;

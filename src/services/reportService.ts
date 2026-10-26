import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { LookupOption } from '@/types/report/report.types';
import employeeService from './employeeService';

const BASE_REPORTS = '/api/Reports';

/**
 * Helper to extract human-readable error from axios blob error response
 */
export async function extractBlobErrorMessage(error: any): Promise<string> {
  if (error?.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'string') return parsed;
        if (parsed?.message) return parsed.message;
        if (parsed?.title) return parsed.title;
        return text;
      } catch {
        return text || 'Failed to generate report.';
      }
    } catch {
      return 'Failed to generate report.';
    }
  }
  return error?.response?.data?.message || error?.message || 'Failed to generate report.';
}

/**
 * Helper to open PDF blob in new window or trigger file download
 */
export function openPdfBlob(blob: Blob, fileName: string, downloadDirectly: boolean = false): void {
  const fileUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  if (!downloadDirectly) {
    const newWindow = window.open(fileUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      triggerDownload(fileUrl, fileName);
    }
  } else {
    triggerDownload(fileUrl, fileName);
  }
  setTimeout(() => window.URL.revokeObjectURL(fileUrl), 30000);
}

function triggerDownload(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

class ReportService {
  /**
   * 1. Purchase Order Statement Report
   * GET /api/Reports/DownloadPurchaseOrderReport/{poid}
   */
  async downloadPurchaseOrderReport(poid: number): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadPurchaseOrderReport/${poid}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 2. Time Sheet Report
   * GET /api/Reports/DownloadUserLogReport?stdt={stdt}&enddt={enddt}&empid={empid}
   */
  async downloadUserLogReport(params: { stdt: string; enddt: string; empid?: number }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadUserLogReport`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
          empid: params.empid ?? 0,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 3. Monthly Invoice
   * GET /api/Reports/DownloadMonthlyInvoiceReport?stdt={stdt}&enddt={enddt}&id={id}&invoicelayout={invoicelayout}&invoiceactive={invoiceactive}
   */
  async downloadMonthlyInvoiceReport(params: {
    stdt: string;
    enddt: string;
    id: number;
    invoicelayout?: number;
    invoiceactive?: number;
  }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadMonthlyInvoiceReport`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
          id: params.id,
          invoicelayout: params.invoicelayout ?? 1,
          invoiceactive: params.invoiceactive ?? 1,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 4. Utilization Report
   * GET /api/Reports/DownloadUtilizationUserTaskReport?stdt={stdt}&enddt={enddt}&empid={empid}&uid={uid}
   */
  async downloadUtilizationUserTaskReport(params: {
    stdt: string;
    enddt: string;
    empid: number;
    uid?: number;
  }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadUtilizationUserTaskReport`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
          empid: params.empid,
          uid: params.uid ?? 3,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 5. Attendance Report
   * GET /api/Reports/DownloadAttendanceReport/{month}
   */
  async downloadAttendanceReport(month: string): Promise<Blob> {
    try {
      const cleanMonth = encodeURIComponent(month || new Date().toISOString().slice(0, 7));
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadAttendanceReport/${cleanMonth}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 6. Monthly Invoice in Excel
   * GET /api/Reports/GetTrackerTaskbyMonth?stdt={stdt}&enddt={enddt}&id={id}&invoiceactive={invoiceactive}
   */
  async downloadMonthlyInvoiceExcel(params: {
    stdt: string;
    enddt: string;
    id: number;
    invoiceactive?: number;
  }): Promise<void> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_REPORTS}/GetTrackerTaskbyMonth`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
          id: params.id,
          invoiceactive: params.invoiceactive ?? 1,
        },
      });
      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length === 0) {
        throw new Error('No invoice data found for the selected criteria.');
      }

      // Generate CSV file directly for Excel download
      const headers = ['Start Date', 'End Date', 'Firstname', 'Lastname', 'Task', 'Sub Project', 'Duration', 'Amount', 'Hours', 'Total Amount'];
      const rows = data.map((d: any) => [
        `"${d.start_time ?? ''}"`,
        `"${d.end_time ?? ''}"`,
        `"${(d.firstname ?? '').replace(/"/g, '""')}"`,
        `"${(d.lastname ?? '').replace(/"/g, '""')}"`,
        `"${(d.activity ?? '').replace(/"/g, '""')}"`,
        `"${(d.subcategory ?? '').replace(/"/g, '""')}"`,
        `"${d.duration ?? ''}"`,
        `"${d.amount ?? 0}"`,
        `"${d.hoursvalue ?? 0}"`,
        `"${d.totalAmount ?? 0}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SummaryInvoice_${params.stdt}_to_${params.enddt}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error: any) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 6. User Utilization Report
   * GET /api/Reports/DownloadUserUtilizationReport?stdt={stdt}&enddt={enddt}
   */
  async downloadUserUtilizationReport(params: { stdt: string; enddt: string }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadUserUtilizationReport`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 7. Employee Leave Report
   * GET /api/Reports/DownloadLeaveTransactionReport/{month}?year={year}&empid={empid}&currentyear={currentyear}&hidedate={hidedate}
   */
  async downloadLeaveTransactionReport(params: {
    month?: string;
    year?: number;
    empid?: number;
    currentyear?: boolean;
    hidedate?: boolean;
  }): Promise<Blob> {
    try {
      const cleanMonth = encodeURIComponent(params.month || '0');
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadLeaveTransactionReport/${cleanMonth}`, {
        params: {
          year: params.year,
          empid: params.empid ?? 0,
          currentyear: !!params.currentyear,
          hidedate: !!params.hidedate,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 8. Utilization Report with Project
   * GET /api/Reports/DownloadUtilizationReportwithProject?stdt={stdt}&enddt={enddt}&empid={empid}&projectid={projectid}&subprojectid={subprojectid}&uid={uid}
   */
  async downloadUtilizationReportwithProject(params: {
    stdt: string;
    enddt: string;
    empid: number;
    projectid: number;
    subprojectid?: number;
    uid?: number;
  }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadUtilizationReportwithProject`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
          empid: params.empid,
          projectid: params.projectid,
          subprojectid: params.subprojectid ?? 0,
          uid: params.uid ?? 3,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 9. Productivity Analytics Report
   * GET /api/Reports/PrintUserUtilizationwithperReportReport or /api/Reports/PrintUserUtilizationwithperReport?format=pdf
   */
  async downloadProductivityAnalyticsReport(params: { stdt: string; enddt: string }): Promise<Blob> {
    try {
      // Primary route in backend controller
      const response = await axiosInstance.get(`${BASE_REPORTS}/PrintUserUtilizationwithperReportReport`, {
        params: {
          stdt: params.stdt,
          enddt: params.enddt,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (firstErr) {
      try {
        // Fallback endpoint route with format=pdf
        const fallback = await axiosInstance.get(`${BASE_REPORTS}/PrintUserUtilizationwithperReport`, {
          params: {
            stdt: params.stdt,
            enddt: params.enddt,
            format: 'pdf',
          },
          responseType: 'blob',
        });
        return fallback.data;
      } catch (error) {
        const msg = await extractBlobErrorMessage(error);
        throw new Error(msg);
      }
    }
  }

  /**
   * 10. Employee - Wise Production Report
   * GET /api/Reports/DownloadUserTrackerTaskwithAmount?EID={eid}&stdt={stdt}&enddt={enddt}&empid={empid}
   */
  async downloadUserTrackerTaskwithAmount(params: {
    eid: number;
    stdt: string;
    enddt: string;
    empid?: number;
  }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadUserTrackerTaskwithAmount`, {
        params: {
          EID: params.eid,
          stdt: params.stdt,
          enddt: params.enddt,
          empid: params.empid ?? params.eid,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  /**
   * 11. Monthly Evaluation Report Summary
   * GET /api/Reports/DownloadMonthlyEvaluationReportSummary?year={year}&month={month}&format=pdf
   */
  async downloadMonthlyEvaluationReportSummary(params: { year: number; month: number }): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${BASE_REPORTS}/DownloadMonthlyEvaluationReportSummary`, {
        params: {
          year: params.year,
          month: params.month,
          format: 'pdf',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const msg = await extractBlobErrorMessage(error);
      throw new Error(msg);
    }
  }

  // -------------------------------------------------------------
  // Parameter Lookups
  // -------------------------------------------------------------

  /**
   * GET /api/PurchaseOrder/GetPurchaseOrderParaList/{compnayId}
   */
  async getPurchaseOrderList(companyId: number = 1): Promise<LookupOption[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/PurchaseOrder/GetPurchaseOrderParaList/${companyId}`
      );
      return (Array.isArray(response.data) ? response.data : [])
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: String(r.name ?? r.Name ?? ''),
        }))
        .filter((r) => r.id > 0);
    } catch (error) {
      return [];
    }
  }

  /**
   * GET /api/UtilizationTracker/GetEmployeeList/{Companyid}
   */
  async getEmployeeList(companyId: number = 1): Promise<LookupOption[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/UtilizationTracker/GetEmployeeList/${companyId}`
      );
      const list = (Array.isArray(response.data) ? response.data : [])
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: String(r.name ?? r.Name ?? ''),
        }))
        .filter((r) => r.id > 0 && r.name && !r.name.includes('--Select--'));

      if (list.length > 0) return list;
    } catch {
      // fallback
    }

    try {
      const users = await employeeService.getUserList();
      return users.map((u: any) => ({
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name,
      }));
    } catch {
      return [];
    }
  }

  /**
   * GET /api/UtilizationTracker/GetTrackerProject or GetTrackerProjectclient
   */
  async getProjectList(
    companyId: number = 1,
    branchId: number = 1,
    adminId: number = 0,
    isClinician: boolean = false
  ): Promise<LookupOption[]> {
    try {
      const safeCompanyId = Number(companyId) && !isNaN(Number(companyId)) ? Number(companyId) : 1;
      const safeBranchId = Number(branchId) && !isNaN(Number(branchId)) ? Number(branchId) : 1;
      const safeAdminId = Number(adminId) && !isNaN(Number(adminId)) ? Number(adminId) : 0;

      const url = isClinician
        ? `/api/UtilizationTracker/GetTrackerProjectclient?companyid=${safeCompanyId}&branchid=${safeBranchId}`
        : `/api/UtilizationTracker/GetTrackerProject?companyid=${safeCompanyId}&branchid=${safeBranchId}&adminId=${safeAdminId}`;
      const response = await axiosInstance.get<any[]>(url);
      return (Array.isArray(response.data) ? response.data : [])
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: String(r.project ?? r.Project ?? r.name ?? r.Name ?? ''),
        }))
        .filter((r) => r.id > 0);
    } catch {
      return [];
    }
  }

  /**
   * GET /api/UtilizationTracker/GetTrackerSubProject/{projectid}
   */
  async getSubProjectList(projectId: number): Promise<LookupOption[]> {
    if (!projectId) return [];
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/UtilizationTracker/GetTrackerSubProject/${projectId}`
      );
      return (Array.isArray(response.data) ? response.data : [])
        .map((r: any) => ({
          id: Number(r.id ?? r.ID ?? 0),
          name: String(r.subcategory ?? r.Subcategory ?? r.name ?? r.Name ?? ''),
        }))
        .filter((r) => r.id > 0);
    } catch {
      return [];
    }
  }

  /**
   * GET /api/common/years
   */
  async getYears(): Promise<number[]> {
    try {
      const response = await axiosInstance.get<any[]>('/api/common/years');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
          .map((y: any) => Number(y.year ?? y.Year ?? y))
          .filter((y) => !isNaN(y) && y > 1990)
          .sort((a, b) => b - a);
      }
    } catch {}
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => currentYear - i);
  }

  /**
   * GET /api/common/months
   */
  async getMonths(): Promise<LookupOption[]> {
    try {
      const response = await axiosInstance.get<any[]>('/api/common/months');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
          .map((m: any) => ({
            id: Number(m.id ?? m.ID ?? m.monthNo ?? m.month ?? 0),
            name: String(m.name ?? m.Name ?? m.monthName ?? ''),
          }))
          .filter((m) => m.id > 0);
      }
    } catch {}

    return [
      { id: 1, name: 'January' },
      { id: 2, name: 'February' },
      { id: 3, name: 'March' },
      { id: 4, name: 'April' },
      { id: 5, name: 'May' },
      { id: 6, name: 'June' },
      { id: 7, name: 'July' },
      { id: 8, name: 'August' },
      { id: 9, name: 'September' },
      { id: 10, name: 'October' },
      { id: 11, name: 'November' },
      { id: 12, name: 'December' },
    ];
  }
}

export const reportService = new ReportService();
export default reportService;

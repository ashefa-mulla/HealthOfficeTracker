/**
 * Leave Transaction types (Apply Leave)
 * Backend: LeaveTransactionController
 */

/** Row returned by GET /api/LeaveTransaction/GetLeaveTransactionList (GetLeaveTransactionList_Result) */
export interface LeaveTransactionListItem {
  id: number;
  year: number;
  month: number;
  fromDate: string;
  toDate: string;
  start_date?: string;
  end_date?: string;
  emp_id: number;
  leaves: number | null;
  sick_Leaves: number | null;
  pl: number | null;
  sl: number | null;
  lwp: number | null;
  employee: string;
  isApprove: boolean | null;
  [key: string]: any;
}

/** Payload for POST /api/LeaveTransaction/AddEditLeaveTransaction (BusinessApp.Models.LeaveTransaction) */
export interface LeaveTransactionModel {
  id: number;
  year: number;
  month: number;
  fromDate: string;
  toDate: string;
  empId: number;
  leaves: number | null;
  sickLeaves: number | null;
  pl: number | null;
  sl: number | null;
  lwp: number | null;
  pLeaves: number | null;
  isApprove: boolean;
  isSickLeaves: boolean;
}

/** Employee dropdown row from GET /api/UtilizationTracker/GetEmployeeList/{companyId} */
export interface LeaveEmployeeItem {
  id: number;
  name: string;
}

export interface LeavePageResponse {
  data: LeaveTransactionListItem[];
  totalCount: number;
}

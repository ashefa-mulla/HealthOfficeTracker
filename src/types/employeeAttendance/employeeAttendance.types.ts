/**
 * Employee Attendance types
 * Backend: EmployeeAttendanceController & Stored Procedure [dbo].[spa_getemployeeattendance]
 */

export interface EmployeeAttendanceListItem {
  id?: number;
  ID?: number;
  employeeID?: number;
  empId?: number;
  Emp_ID?: number;
  fullname?: string | null;
  Fullname?: string | null;
  employeeName?: string | null;
  month: number;
  Month?: number;
  monthName?: string | null;
  MonthName?: string | null;
  year?: number | null;
  Year?: number | null;
  working_Days?: number | null;
  Working_Days?: number | null;
  workingDays?: number | null;
  attendance?: number | null;
  Attendance?: number | null;
  pl?: number | null;
  PL?: number | null;
  cl?: number | null;
  CL?: number | null;
  sl?: number | null;
  SL?: number | null;
  totalLeaves?: number | null;
  TotalLeaves?: number | null;
  lopDays?: number | null;
  LOPDays?: number | null;
  paidDays?: number | null;
  PaidDays?: number | null;
  updated_by?: number | null;
  updatedBy?: number | null;
  updated_date?: string | null;
  updatedDate?: string | null;
  isApproved?: boolean | null;
  isapproved?: boolean | null;
  IsApproved?: boolean | null;
  [key: string]: any;
}

export interface EmployeeAttendanceQueryParams {
  month?: number | null;
  year?: number | null;
  pageNumber?: number;
  pageSize?: number;
  search?: string | null;
  empId?: number | null;
}

export interface EmployeeAttendancePaginatedResponse {
  data: EmployeeAttendanceListItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface EmployeeAttendanceModel {
  id: number;
  empId: number;
  employeeName?: string | null;
  month: number;
  year?: number | null;
  workingDays?: number | null;
  attendance?: number | null;
  pl?: number | null;
  cl?: number | null;
  sl?: number | null;
  updatedBy?: number | null;
  updatedDate?: string | null;
  isApproved?: boolean | null;
  isapproved?: boolean | null;
  IsApproved?: boolean | null;
}

export interface UploadAttendanceResult {
  success: boolean;
  message: string;
  totalRows?: number;
  TotalRows?: number;
  insertedCount?: number;
  InsertedCount?: number;
  updatedCount?: number;
  UpdatedCount?: number;
  failedCount?: number;
  FailedCount?: number;
  errors?: string[];
  Errors?: string[];
  [key: string]: any;
}

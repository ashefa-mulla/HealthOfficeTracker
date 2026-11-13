/**
 * Employee Salary Revision Types
 * Corresponds to backend EmployeeSalaryRevisionController & spa_getemployeesalaryrevision_Result
 */

export interface EmployeeSalaryRevisionModel {
  id?: number;
  ID?: number;
  empId?: number;
  Emp_ID?: number;
  emp_ID?: number;
  employeeID?: number;
  EmployeeID?: number;
  fullname?: string | null;
  Fullname?: string | null;
  basic?: number;
  Basic?: number;
  matrix?: number;
  Matrix?: number;
  fromDate?: string | null;
  FromDate?: string | null;
  toDate?: string | null;
  ToDate?: string | null;
  seqNo?: number;
  SeqNo?: number;
  createdBy?: number | string | null;
  CreatedBy?: number | string | null;
  createdDate?: string | null;
  CreatedDate?: string | null;
  updatedBy?: number | string | null;
  UpdatedBy?: number | string | null;
  updatedDate?: string | null;
  UpdatedDate?: string | null;
  isActive?: boolean | number;
  IsActive?: boolean | number;
  status?: string | null;
  Status?: string | null;
  [key: string]: any;
}

export interface SalaryRevisionQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string | null;
}

export interface SalaryRevisionPaginatedResponse {
  data: EmployeeSalaryRevisionModel[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface SalaryRevisionFormData {
  id?: number;
  empId: number;
  basic: number;
  matrix: number;
  fromDate: string;
  toDate?: string | null;
  seqNo?: number;
  isActive: boolean;
}

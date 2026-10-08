/**
 * Types for My Activities / Task Activity module
 * Mapped to C# spa_getactivelogofemployee_Result backend model
 */

export interface TaskActivityItem {
  id?: number;
  fullname?: string | null;
  oExecDate?: string | null;
  starttime?: string | null;
  oOutDate?: string | null;
  endtime?: string | null;
  duration?: string | null;
  updated_date?: string | Date | null;
  project?: string | null;
  subcategory?: string | null;
  subprojectcategory?: string | null;
  activity?: string | null;
  secondvalue?: number | null;
}

export interface TaskActivityQueryParams {
  start?: string | null;
  end?: string | null;
  Employeeid?: number | null;
  utype?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string | null;
}

export interface TaskActivityPageResponse {
  data: TaskActivityItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

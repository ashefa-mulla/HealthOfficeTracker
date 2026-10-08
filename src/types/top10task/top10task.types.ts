/**
 * Types for Top 10 Task / My Tracker Task module
 * Formatted to match VirtualClinic-React standard type definitions
 */

export interface Top10TaskListItem {
  id: number;
  pointPerson?: string | null;
  secondPerson?: string | null;
  accountablePerson?: string | null;
  project?: string | null;
  subProject?: string | null;
  subProjectCategory?: string | null;
  task?: string | null;
  completed?: string | null;
  status_Percentage?: string | null;
  duration?: string | null;
  projected?: number;
  priority?: string | null;
  etahh?: string | number;
  etamm?: string | number;
  assignDate?: string | Date;
  eta?: string | Date;

  // PascalCase aliases from C# API backend
  ID?: number;
  PointPerson?: string | null;
  SecondPerson?: string | null;
  AccountablePerson?: string | null;
  Project?: string | null;
  SubProject?: string | null;
  SubProjectCategory?: string | null;
  Task?: string | null;
  Completed?: string | null;
  Status_Percentage?: string | null;
  Duration?: string | null;
  Projected?: number;
  Priority?: string | null;
  ETAHH?: string | null;
  ETAMM?: string | null;
  AssignDate?: string | Date;
  ETA?: string | Date;

  [key: string]: any;
}

export type GetTaskListForUserwithPegination_Results = Top10TaskListItem;

export interface EtaTimeObj {
  hour: number;
  minute: number;
  second?: number;
}

export interface Top10TaskModel {
  id: number;
  pointPerson: number | null;
  secondPerson?: number | null;
  accountablePerson?: number | null;
  project: number | null;
  subproject: number | null;
  subProjectCategory: number | null;
  task?: string | null;
  subject: string | null;
  completed?: string;
  duration?: number;
  projected?: number;
  eta?: string | Date;
  etaTime?: number | EtaTimeObj;
  etahh?: number | string;
  etamm?: number | string;
  actualTime?: number;
  createdTime?: string | Date;
  assignDate?: string | Date;
  isRecurrent?: boolean;
}

export interface EmployerNameListItem {
  id: number;
  name: string;
}

export interface TrackerProjectItem {
  id: number;
  project: string;
}

export interface TrackerSubProjectItem {
  id: number;
  subcategory: string;
  projectid?: number;
}

export interface TrackerSubProjectCategoryItem {
  id: number;
  subcategory: string;
  projectid?: number;
  subprojectcategoryid?: number;
}

export interface Top10TaskPageResponse {
  data: Top10TaskListItem[];
  totalCount: number;
}

export interface Top10TaskQueryParams {
  empId: number;
  status: string;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface UtilizationTrackerModel {
  id: number;
  companyid: number;
  branchid: number;
  employeeid: number;
  projectId: number;
  subProjectId: number;
  activity: string;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  duration?: string | null;
  updateddate?: string | Date | null;
  button?: string | null;
  subProjectCategoryId: number;
  taskListid?: number | null;
  activeInvoice: boolean;
  cloneID: number;
  isAdmin?: boolean | null;
  nonBillable?: boolean | null;
  watcherAppTitle?: string | null;
  updatedBy?: number | null;
  [key: string]: any;
}

export type UtilizationTrackerTaskPayload = UtilizationTrackerModel;



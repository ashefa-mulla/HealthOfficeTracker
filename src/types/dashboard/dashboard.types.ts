/**
 * Dashboard Types for HO Tracker
 * Converted from Angular dashboard.model.ts
 */

export interface Graphdata {
  fullname: string;
  project: string;
  duration: string;
  secondvalue: number;
}

export interface Graphdataamt {
  fullname: string;
  secondvalue: number; // duration in seconds
  rate: number; // hourly rate in dollars
}

export interface MentionPointsSummary {
  userId: number;
  fullName: string;
  total_NegativePoints: number;
  total_PositivePoints: number;
  summaryDate?: string;
}

export interface Below3HrEmpDuration {
  id: number;
  name: string;
  total_Duration: string;
  start_Time?: string;
  end_Time?: string;
}

export interface NotTrackedEmployee {
  id: number;
  name: string;
}

export interface OnlineEmployeeDashboard {
  id: number;
  user: string;
  totalTasks: number;
  pending: number;
  completed: number;
  assignedHours: number;
  actualHours: number;
  efficiency: number;
  oExecDate?: string; // IN time
  oOutDate?: string; // OUT time
  profileimage?: string; // employee photo
  online?: boolean;
}

export interface ChartData {
  name: string;
  uniqueName: string;
  hours: number;
}

export interface PurchaseOrderDueDateEvent {
  id?: number | string;
  title: string;
  start: string | Date;
  color?: any;
  allDay?: boolean;
  actions?: any[];
}

export interface ClientProjectSummaryItem {
  person: string;
  billableHours: number;
  nonBillableHours: number;
}

export interface OutstandingInvoiceSummary {
  totalOutstandingAmount?: number;
  [key: string]: any;
}

/** GET /api/Dashborad/GetEmployeeWorkTimeSummary */
export interface EmployeeWorkTimeSummary {
  employeeId: number;
  employeeName: string;
  reportDate: string;
  firstActivityLocal?: string;
  lastActivityLocal?: string;
  totalSeconds: number;
  totalHours: number;
  totalTime: string;
  meetingSeconds: number;
  meetingHours: number;
  activityCount: number;
  applicationCount: number;
}

/** GET /api/Dashborad/GetEmployeeActivityDetails */
export interface EmployeeActivityDetail {
  id: number;
  employeeId: number;
  employeeName: string;
  reportDate: string;
  startTimeLocal: string;
  endTimeLocal: string;
  applicationName?: string;
  processName?: string;
  windowTitle?: string;
  durationSeconds: number;
  isInMeeting: boolean;
  meetingPlatform?: string | null;
  meetingActivityId?: string | null;
  deviceId?: string;
  activityId?: string;
  startTimeUtc?: string;
  endTimeUtc?: string;
}

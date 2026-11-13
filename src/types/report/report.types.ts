export type ReportCategory = 'All' | 'Financial' | 'Productivity' | 'Attendance' | 'Evaluation' | 'Payroll';

export interface ReportItemDefinition {
  id: number;
  key: string;
  title: string;
  description: string;
  category: 'Financial' | 'Productivity' | 'Attendance' | 'Evaluation' | 'Payroll';
  icon: string;
  color: string;
  badge?: string;
  allowedSessionTypes?: number[]; // if undefined, allowed for non-client (sessiontype !== 2)
}

export interface ReportFormParams {
  poid?: number;
  stDt?: string;
  endDt?: string;
  empid?: number;
  empId?: number;
  projectId?: number;
  subProjectId?: number;
  invoicelayout?: number;
  invoiceactive?: number;
  month?: string | number;
  year?: number;
  currentyear?: boolean;
  hidedate?: boolean;
  format?: string;
}

export interface LookupOption {
  id: number;
  name: string;
}

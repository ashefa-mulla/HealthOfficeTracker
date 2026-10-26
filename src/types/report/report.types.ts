export type ReportCategory = 'All' | 'Financial' | 'Productivity' | 'Attendance' | 'Evaluation';

export interface ReportItemDefinition {
  id: number;
  key: string;
  title: string;
  description: string;
  category: 'Financial' | 'Productivity' | 'Attendance' | 'Evaluation';
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
  projectId?: number;
  subProjectId?: number;
  invoicelayout?: number;
  invoiceactive?: number;
  month?: string;
  year?: number;
  currentyear?: boolean;
  hidedate?: boolean;
}

export interface LookupOption {
  id: number;
  name: string;
}

/**
 * Project types (Admin > Client > Project)
 * Backend: TrackerSubProjectController (a "project" is a TblTrackerSubProject row under a client)
 */

/** Row returned by GET /api/TrackerSubProject/GetTrackerSubProjectList (GetTrackerSubProject_Result) */
export interface ProjectListItem {
  id: number;
  company_Name: string | null;
  name?: string | null;
  /** Parent client */
  project: string | null;
  /** Project name */
  subcategory: string | null;
  description: string | null;
  amount: string | number | null;
  [key: string]: any;
}

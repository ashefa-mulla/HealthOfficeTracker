/**
 * Client types (Admin > Client)
 * Backend: TrackerProjectController (a "client" is a TblTrackerProject row)
 */

/** Row returned by GET /api/TrackerProject/GetAllTrackerProject (GetTrackerProject_Result) */
export interface ClientListItem {
  id: number;
  company_Name: string | null;
  name?: string | null;
  project: string | null;
  project_Description: string | null;
  [key: string]: any;
}

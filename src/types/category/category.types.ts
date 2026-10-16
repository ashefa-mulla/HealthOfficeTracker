/**
 * Category types (Admin > Client > Category)
 * Backend: TrackerSubProjectCategoryController (a "category" is a TblTrackerSubProjectCategory row under a project)
 */

/** Row returned by GET /api/TrackerSubProjectCategory/GetTrackerSubProjectcategoryWithProjectList */
export interface CategoryListItem {
  id: number;
  company_Name: string | null;
  name?: string | null;
  /** Category name */
  subcategory: string | null;
  description: string | null;
  amount: string | number | null;
  /** Parent client */
  project: string | null;
  /** Parent project */
  subproject: string | null;
  [key: string]: any;
}

/**
 * Account Category types (Admin > Accounts > Account Category)
 * Backend: AccountCategoryController
 */

/** Row returned by GET /api/AccountCategory/GetAllAccountCategoryList (GetAllAccountCategory_Result) */
export interface AccountCategoryListItem {
  id: number;
  name: string | null;
  active: boolean | null;
  [key: string]: any;
}

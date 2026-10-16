/**
 * Employee types (Admin > Users)
 * Backend: EmployeeController (GET getuserlist) -> EmployeeModel
 */

/** Row returned by GET /api/Employee/getuserlist (EmployeeModel) */
export interface EmployeeListItem {
  id: number;
  employerCode: string | null;
  firstname: string | null;
  middlename?: string | null;
  lastname: string | null;
  joiningDate: string | null;
  primaryContact: string | null;
  primaryEmail: string | null;
  cityId: number | null;
  stateId: number | null;
  countryId: number | null;
  profileimage: string | null;
  active: boolean | null;
  [key: string]: any;
}

/** Lookup row returned by CommonController GetStates / GetCities */
export interface LookupItem {
  id: number;
  name: string;
}

/** id -> name maps used to resolve City / State columns (API only returns ids) */
export interface EmployeeLookups {
  states: Record<number, string>;
  cities: Record<number, string>;
}

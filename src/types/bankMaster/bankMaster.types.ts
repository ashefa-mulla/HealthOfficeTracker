/**
 * Bank Master types (Admin > Accounts > Bank Master)
 * Backend: BankMasterController
 */

/** Row returned by GET /api/BankMaster/GetAllBankMaster (GetAllBankDetail_Result) */
export interface BankMasterListItem {
  id: number;
  accountNo: number | string | null;
  name: string | null;
  openingDate: string | null;
  active: boolean | null;
  [key: string]: any;
}

/**
 * Vendor Account types (Admin > Accounts > Vendor Account)
 * Backend: VendorAccountController
 */

/** Row returned by GET /api/VendorAccount/GetAllVendorAccount (GetAllVandorAccount_Result) */
export interface VendorAccountListItem {
  id: number;
  categoryID: number | null;
  name: string | null;
  address: string | null;
  contact: number | string | null;
  emailID: string | null;
  active: boolean | null;
  categoryName: string | null;
  [key: string]: any;
}

/** Row returned by GET /api/VendorAccount/GetVendorAccountNumberByVendorID/{id} */
export interface VendorAccountNumberItem {
  id: number;
  vandorAccountID: number | null;
  accountNo: number | string | null;
}

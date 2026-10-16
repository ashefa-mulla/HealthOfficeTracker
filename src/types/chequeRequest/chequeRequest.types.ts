/**
 * Cheque Request types (Admin > Accounts > Cheque Request)
 * Backend: ChequeRequestController
 */

/** Row returned by GET /api/ChequeRequest/GetAllChequeRequest (GetAllChequeRequest_Result) */
export interface ChequeRequestListItem {
  id: number;
  bank_ID: number | null;
  /** Bank name */
  name: string | null;
  requestDate: string | null;
  payTo: string | null;
  memo: string | null;
  address: string | null;
  costCentreName: string | null;
  payMethod: string | null;
  amount: number | null;
  [key: string]: any;
}

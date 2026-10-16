/**
 * Purchase Order types (Admin > Accounts > Purchase Order)
 * Backend: PurchaseOrderController
 */

/** Which list the page is showing */
export type PurchaseOrderView = 'due' | 'active' | 'inactive';

/**
 * Normalised row for the list. The two list SPs (GetPurchaseOrderList and
 * GetPurchaseOrderListbyFilter) return the same shape, with keys like PO_Type / PO_Amount
 * whose camelCased spelling is ambiguous, so rows are normalised in purchaseOrder.mapper.
 */
export interface PurchaseOrderListItem {
  id: number;
  /** Next payment due date (PaymentDueDate) */
  nextDate: string | null;
  poDate: string | null;
  /** PO_Amount */
  amount: number;
  /** Vendor name (Name) */
  vendor: string | null;
  /** Payment frequency (PaytypeName) */
  paymentFrequency: string | null;
  /** PO_Type */
  poType: string | null;
  code: string | null;
  accountNo: number | string | null;
  remarks: string | null;
}

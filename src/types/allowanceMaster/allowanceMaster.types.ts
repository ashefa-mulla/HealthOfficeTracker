/** Row shown on the Allowance Master list (only the fields the screen uses). */
export interface AllowanceMasterListItem {
  id: number;
  allowanceName: string;
  allowanceCode: string;
  /** "E" = Earning (taxable), "D" = Deduction (not taxable). */
  allowanceType: string;
  description: string;
}

/** Item from GET /api/EmployeeAllowanceMaster/GetAllowanceTypes. */
export interface AllowanceTypeOption {
  value: string;
  text: string;
}

export const ALLOWANCE_TYPE_LABELS: Record<string, string> = {
  E: "Earning",
  D: "Deduction",
};

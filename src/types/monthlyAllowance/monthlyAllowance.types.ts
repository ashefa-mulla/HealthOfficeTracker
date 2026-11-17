export interface AllowanceMasterModel {
  id: number;
  allowanceName: string;
  allowanceCode: string;
  allowanceType: string;
  description?: string;
  isTaxable: boolean;
  isFixed: boolean;
  calculationType?: string;
  isLopapplicable: boolean;
  isActive: boolean;
  createdBy?: number;
  createdDate?: string;
  updatedBy?: number;
  updatedDate?: string;
  isMonthlyAllowance: boolean;

  // Fallbacks for PascalCase from .NET serializer
  Id?: number;
  AllowanceName?: string;
  AllowanceCode?: string;
  AllowanceType?: string;
  Description?: string;
  IsTaxable?: boolean;
  IsFixed?: boolean;
  CalculationType?: string;
  IsLopapplicable?: boolean;
  IsActive?: boolean;
  IsMonthlyAllowance?: boolean;
}

export interface EmployeeMonthlyAllowanceModel {
  id: number;
  empId: number;
  allowanceId: number;
  month: number;
  year: number;
  amount: number;
  createdBy?: number;
  createdDate?: string;
  updatedBy?: number;
  updatedDate?: string;
  isActive: boolean;

  // Display properties
  employeeName?: string;
  allowanceName?: string;
  allowanceCode?: string;
  allowanceType?: string;

  // Fallbacks for PascalCase & sp_GetEmployeeMonthlyAllowance_Result from .NET serializer
  ID?: number;
  Id?: number;
  EmpID?: number;
  empID?: number;
  EmpId?: number;
  AllowanceID?: number;
  allowanceID?: number;
  AllowanceId?: number;
  Month?: number | null;
  Year?: number | null;
  Amount?: number;
  IsActive?: boolean;
  EmployeeName?: string;
  AllowanceName?: string;
  AllowanceCode?: string;
  AllowanceType?: string;
}

export type sp_GetEmployeeMonthlyAllowance_Result = EmployeeMonthlyAllowanceModel;

export interface MonthlyAllowanceQueryParams {
  empId?: number;
  month?: number;
  year?: number;
  allowanceId?: number;
  isActive?: boolean;
}

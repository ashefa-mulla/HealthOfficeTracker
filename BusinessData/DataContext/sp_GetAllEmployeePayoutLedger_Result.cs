using System;

namespace BusinessData.DataContext
{
    public class sp_GetAllEmployeePayoutLedger_Result
    {
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string Designation { get; set; }
        public string PaySlipMonth { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }

        public decimal WorkingDays { get; set; }
        public decimal Attendance { get; set; }
        public decimal PL { get; set; }
        public decimal CL { get; set; }
        public decimal SL { get; set; }
        public decimal Leaves { get; set; }
        public decimal LOPDays { get; set; }
        public decimal PaidDays { get; set; }

        public decimal GrossWages { get; set; }
        public decimal MatrixRate { get; set; }
        public int GrandTotalPoints { get; set; }
        public decimal MatrixAmount { get; set; }

        public decimal Conveyance { get; set; }
        public decimal Miscellaneous { get; set; }
        public decimal OtherAllowance { get; set; }
        public decimal IncentivePay { get; set; }
        public decimal TotalEarnings { get; set; }

        public decimal ProfessionalTax { get; set; }
        public decimal LOPDeduction { get; set; }
        public decimal Deduction1 { get; set; }
        public decimal Deduction2 { get; set; }
        public decimal Deduction3 { get; set; }
        public decimal TotalDeductions { get; set; }
        public decimal NetSalary { get; set; }

        public string CompanyName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string ZipCode { get; set; }
        public string Website { get; set; }
        public string PrimaryContact { get; set; }
        public string PrimaryEmail { get; set; }
    }
}

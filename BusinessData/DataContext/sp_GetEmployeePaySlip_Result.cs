using System;

namespace BusinessData.DataContext
{
    public class sp_GetEmployeePaySlip_Result
    {
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string DesignationID { get; set; }
        public string PaySlipMonth { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }

        public decimal GrossWages { get; set; }
        public int WorkingDays { get; set; }
        public decimal Leaves { get; set; }
        public decimal LOPDays { get; set; }
        public decimal PaidDays { get; set; }

        // Component itemization from stored procedure
        public string ComponentCode { get; set; }
        public string ComponentName { get; set; }
        public string ComponentType { get; set; }
        public decimal Amount { get; set; }

        // Evaluation Matrix
        public decimal MatrixRate { get; set; }
        public decimal GrandTotalPoints { get; set; }

        // Totals & Net Salary
        public decimal TotalEarnings { get; set; }
        public decimal TotalDeductions { get; set; }
        public decimal NetSalary { get; set; }

        // Company Details
        public string CompanyName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
        public string Website { get; set; }
        public string PrimaryContact { get; set; }
        public string PrimaryEmail { get; set; }

        // Attendance & Leave Details
        public int Attendance { get; set; }
        public decimal PL { get; set; }
        public decimal CL { get; set; }
        public decimal SL { get; set; }
    }
}

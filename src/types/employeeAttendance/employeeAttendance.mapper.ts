import { EmployeeAttendanceForm } from "./employeeAttendance.schema";

const idOrNull = (v: any) => (v ? Number(v) : null);
const numOrDefault = (v: any, d: number = 0) =>
  v === undefined || v === null || v === "" || isNaN(Number(v)) ? d : Number(v);

export const emptyEmployeeAttendanceForm = (): EmployeeAttendanceForm => {
  const now = new Date();
  return {
    id: 0,
    empId: null as any,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    workingDays: 0,
    attendance: 0,
    pl: 0,
    cl: 0,
    sl: 0,
    isApproved: false,
    updatedBy: null,
  };
};

export const toEmployeeAttendanceForm = (data: any): EmployeeAttendanceForm => {
  const now = new Date();
  return {
    id: Number(data?.id ?? data?.Id ?? data?.ID ?? 0),
    empId: idOrNull(data?.empId ?? data?.EmpId ?? data?.Emp_ID ?? data?.EmployeeID) as any,
    month: numOrDefault(data?.month ?? data?.Month, now.getMonth() + 1),
    year: numOrDefault(data?.year ?? data?.Year, now.getFullYear()),
    workingDays: numOrDefault(data?.workingDays ?? data?.WorkingDays ?? data?.Working_Days, 0),
    attendance: numOrDefault(data?.attendance ?? data?.Attendance, 0),
    pl: numOrDefault(data?.pl ?? data?.Pl ?? data?.PL, 0),
    cl: numOrDefault(data?.cl ?? data?.Cl ?? data?.CL, 0),
    sl: numOrDefault(data?.sl ?? data?.Sl ?? data?.SL, 0),
    isApproved: Boolean(
      data?.isApproved ??
      data?.isapproved ??
      data?.IsApproved ??
      data?.Isapproved ??
      data?.is_approved ??
      false
    ),
    updatedBy: data?.updatedBy ?? data?.UpdatedBy ?? data?.updated_by ?? null,
  };
};

export const toEmployeeAttendanceModel = (
  form: EmployeeAttendanceForm,
  currentUserId?: number
) => ({
  id: Number(form.id || 0),
  empId: Number(form.empId),
  month: Number(form.month),
  year: Number(form.year),
  workingDays: Number(form.workingDays || 0),
  attendance: Number(form.attendance || 0),
  pl: Number(form.pl || 0),
  cl: Number(form.cl || 0),
  sl: Number(form.sl || 0),
  isApproved: Boolean(form.isApproved),
  isapproved: Boolean(form.isApproved),
  IsApproved: Boolean(form.isApproved),
  updatedBy: currentUserId || (form.updatedBy ? Number(form.updatedBy) : null),
  updatedDate: new Date().toISOString(),
});

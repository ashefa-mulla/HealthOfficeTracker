import { z } from "zod";

const requiredId = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message })
  );

const numberField = (min: number = 0, message: string = "Must be 0 or more") =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
    z.number().min(min, message).default(0)
  );

export const employeeAttendanceFormSchema = z.object({
  id: z.number().default(0),
  empId: requiredId("Employee is required!"),
  month: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? new Date().getMonth() + 1 : Number(val)),
    z.number().min(1, "Month is required!").max(12, "Invalid month")
  ),
  year: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? new Date().getFullYear() : Number(val)),
    z.number().min(2000, "Year must be 2000 or later").max(2100, "Invalid year")
  ),
  workingDays: numberField(0, "Working days must be 0 or more"),
  attendance: numberField(0, "Attendance must be 0 or more"),
  pl: numberField(0, "Paid leave must be 0 or more"),
  cl: numberField(0, "Casual leave must be 0 or more"),
  sl: numberField(0, "Sick leave must be 0 or more"),
  updatedBy: z.number().nullable().optional(),
});

export type EmployeeAttendanceForm = z.infer<typeof employeeAttendanceFormSchema>;


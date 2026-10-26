import { z } from "zod";

export const leaveFormSchema = z
  .object({
    id: z.number().default(0),
    empId: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .nullable()
        .refine((val) => val !== null && val > 0, {
          message: "Employee is required!",
        })
    ),
    fromDate: z.string().min(1, "From Date is required!"),
    toDate: z.string().min(1, "To Date is required!"),
    leaves: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
      z.number().min(0.5, "Leave days must be at least 0.5!")
    ),
    isSickLeaves: z.boolean().default(false),
    isApprove: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const from = new Date(data.fromDate).getTime();
      const to = new Date(data.toDate).getTime();
      return isNaN(from) || isNaN(to) || to >= from;
    },
    { message: "To Date must be on or after From Date!", path: ["toDate"] }
  );

export type LeaveForm = z.infer<typeof leaveFormSchema>;

const leaveDays = (label: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
    z.number().min(0, `${label} cannot be negative!`)
  );

/** Admin Leave Management: edit the day split and approve */
export const leaveApprovalSchema = z
  .object({
    id: z.number().default(0),
    empId: z.number().default(0),
    fromDate: z.string().min(1, "From Date is required!"),
    toDate: z.string().min(1, "To Date is required!"),
    leaves: leaveDays("Leaves"),
    sickLeaves: leaveDays("Sick Leaves"),
    lwp: leaveDays("LWP"),
    // Not editable here; carried through so a save does not wipe them
    pl: z.number().default(0),
    sl: z.number().default(0),
    isApprove: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const from = new Date(data.fromDate).getTime();
      const to = new Date(data.toDate).getTime();
      return isNaN(from) || isNaN(to) || to >= from;
    },
    { message: "To Date must be on or after From Date!", path: ["toDate"] }
  )
  .refine((data) => data.leaves + data.sickLeaves + data.lwp > 0, {
    message: "Enter at least one of Leaves, Sick Leaves or LWP!",
    path: ["leaves"],
  });

export type LeaveApprovalForm = z.infer<typeof leaveApprovalSchema>;

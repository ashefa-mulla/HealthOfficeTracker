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

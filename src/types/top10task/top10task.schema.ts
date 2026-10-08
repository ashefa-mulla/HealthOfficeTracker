import { z } from "zod";

export const top10TaskFormSchema = z
  .object({
    id: z.number().default(0),
    pointPerson: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .nullable()
        .refine((val) => val !== null && val > 0, {
          message: "Assignee is required!",
        })
    ),
    secondPerson: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z.number().nullable().optional()
    ),
    accountablePerson: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z.number().nullable().optional()
    ),
    project: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .nullable()
        .refine((val) => val !== null && val > 0, {
          message: "Cost Centre is required!",
        })
    ),
    subproject: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .nullable()
        .refine((val) => val !== null && val > 0, {
          message: "Project is required!",
        })
    ),
    subProjectCategory: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z
        .number()
        .nullable()
        .refine((val) => val !== null && val > 0, {
          message: "Category is required!",
        })
    ),
    subject: z.string().min(1, "Task is required!"),
    task: z.string().nullable().optional(),
    completed: z.string().default("Not Started"),
    duration: z.number().default(0),
    projected: z.number().default(0),
    eta: z.string().nullable().optional(),
    etaHour: z.string().default("00"),
    etaMinute: z.string().default("00"),
    actualTime: z.number().default(0),
    createdTime: z.string().nullable().optional(),
    assignDate: z.string().min(1, "Assign Date is required!"),
    isRecurrent: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const totalMinutes =
        (parseInt(data.etaHour || "0", 10) || 0) * 60 +
        (parseInt(data.etaMinute || "0", 10) || 0);
      return totalMinutes > 0;
    },
    {
      message: "Daily Projected ETA is required!",
      path: ["etaHour"],
    }
  );

export type Top10TaskForm = z.infer<typeof top10TaskFormSchema>;

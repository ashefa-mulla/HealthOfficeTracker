import { z } from "zod";

const requiredId = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message })
  );

const optionalId = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
  z.number().nullable()
);

const optionalText = z.string().nullable().optional();

export const projectFormSchema = z.object({
  id: z.number().default(0),
  branchId: z.number().default(0),
  companyId: requiredId("Company is required!"),
  projectId: requiredId("Client is required!"),
  subcategory: z.string().trim().min(1, "Project is required!"),
  description: optionalText,
  amount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, "Price must be 0 or more!").nullable()
  ),
  projectCategory: optionalId,
  assignDate: optionalText,
  eta: optionalText,
  etaTimebyproject: optionalText,
  active: z.boolean().default(true),
  projectActive: z.boolean().default(true),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;

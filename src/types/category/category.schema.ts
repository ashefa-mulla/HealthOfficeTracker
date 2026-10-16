import { z } from "zod";

const requiredId = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message })
  );

const optionalText = z.string().nullable().optional();

export const categoryFormSchema = z.object({
  id: z.number().default(0),
  branchId: z.number().default(0),
  companyId: requiredId("Company is required!"),
  projectId: requiredId("Client is required!"),
  subprojectId: requiredId("Project is required!"),
  subcategory: z.string().trim().min(1, "Category is required!"),
  description: optionalText,
  amount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, "Price must be 0 or more!").nullable()
  ),
  active: z.boolean().default(true),
  projectActive: z.boolean().default(true),
});

export type CategoryForm = z.infer<typeof categoryFormSchema>;

import { z } from "zod";

export const accountCategoryFormSchema = z.object({
  id: z.number().default(0),
  name: z
    .string()
    .trim()
    .min(1, "Category Name is required!")
    .max(50, "Category Name must be 50 characters or less!"),
  active: z.boolean().default(true),
});

export type AccountCategoryForm = z.infer<typeof accountCategoryFormSchema>;

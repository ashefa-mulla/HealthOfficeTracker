import { z } from "zod";

export const bankMasterFormSchema = z.object({
  id: z.number().default(0),
  name: z
    .string()
    .trim()
    .min(1, "Bank Name is required!")
    .max(70, "Bank Name must be 70 characters or less!"),
  // numeric(18,0) in the database
  accountNo: z
    .string()
    .trim()
    .min(1, "Account Number is required!")
    .regex(/^\d{1,18}$/, "Account Number must be digits only (max 18)!"),
  openingDate: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export type BankMasterForm = z.infer<typeof bankMasterFormSchema>;

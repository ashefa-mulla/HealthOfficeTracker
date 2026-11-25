import { z } from "zod";

export const allowanceMasterFormSchema = z.object({
  id: z.number().default(0),
  allowanceName: z
    .string()
    .trim()
    .min(1, "Allowance Name is required!")
    .max(150, "Allowance Name must be 150 characters or less!"),
  allowanceCode: z
    .string()
    .trim()
    .min(1, "Allowance Code is required!")
    .max(50, "Allowance Code must be 50 characters or less!"),
  allowanceType: z
    .string()
    .min(1, "Allowance Type is required!")
    .refine((v) => v === "E" || v === "D", "Allowance Type must be Earning or Deduction."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less!"),
});

/** Declared explicitly: the blank default ("") is not a literal "E" | "D", so z.infer would be too narrow. */
export interface AllowanceMasterForm {
  id: number;
  allowanceName: string;
  allowanceCode: string;
  allowanceType: string;
  description: string;
}

export const emptyAllowanceMasterForm = (): AllowanceMasterForm => ({
  id: 0,
  allowanceName: "",
  allowanceCode: "",
  allowanceType: "",
  description: "",
});

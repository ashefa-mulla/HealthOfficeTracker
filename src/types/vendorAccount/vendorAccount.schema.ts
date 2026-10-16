import { z } from "zod";

const optionalText = z.string().nullable().optional();

export const vendorAccountFormSchema = z.object({
  id: z.number().default(0),
  categoryId: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message: "Category is required!" })
  ),
  name: z.string().trim().min(1, "Vendor Name is required!"),
  // numeric(15,0) in the database
  contact: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || /^\d{1,15}$/.test(v), {
      message: "Contact must be digits only (max 15)!",
    }),
  emailId: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Email is not valid!",
    }),
  address: optionalText,
  otherInformation: optionalText,
  active: z.boolean().default(true),
  accountNumbers: z
    .array(
      z.object({
        // not named "id": useFieldArray reserves that key for its own row key
        rowId: z.number().default(0),
        // numeric(18,0) in the database
        accountNo: z
          .string()
          .trim()
          .min(1, "Account No is required!")
          .regex(/^\d{1,18}$/, "Account No must be digits only (max 18)!"),
      })
    )
    .default([]),
});

export type VendorAccountForm = z.infer<typeof vendorAccountFormSchema>;

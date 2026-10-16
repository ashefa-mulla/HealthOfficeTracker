import { z } from "zod";

const requiredId = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message })
  );

export const chequeRequestFormSchema = z.object({
  id: z.number().default(0),
  bankId: requiredId("Bank Name is required!"),
  requestDate: z.string().min(1, "Request Date is required!"),
  payTo: z.string().trim().min(1, "PayTo is required!"),
  memo: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  costCenterId: requiredId("Cost Centre is required!"),
  payMethod: z.string().nullable().optional(),
  amount: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message: "Amount must be greater than 0!" })
  ),
});

export type ChequeRequestForm = z.infer<typeof chequeRequestFormSchema>;

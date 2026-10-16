import { z } from "zod";

const optionalText = z.string().nullable().optional();

const optionalId = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
  z.number().nullable()
);

const requiredId = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message })
  );

/** Required number (0 allowed), e.g. "No of Qty" */
const requiredNumber = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && !isNaN(val as number), { message })
  );

export const purchaseOrderFormSchema = z.object({
  id: z.number().default(0),
  code: optionalText,

  podate: z.string().min(1, "Purchase Order Date is required!"),
  poType: z
    .string()
    .nullable()
    .refine((v) => v === "General" || v === "Recurrent", { message: "Order Type is required!" }),
  startDate: optionalText,
  endDate: optionalText,

  categoryId: requiredId("Category is required!"),
  vendorId: requiredId("Vendor is required!"),
  vendorAccountNo: optionalId,
  why: optionalText,
  accountable: optionalText,
  costCentreId: optionalId,

  noOfQty: requiredNumber("No of Qty is required!"),
  lowerLimit: requiredNumber("Lower Limit is required!"),
  upperLimit: requiredNumber("Upper Limit is required!"),
  principalAmt: requiredNumber("Principal Amount is required!"),
  interestAmt: requiredNumber("Interest Amount is required!"),
  poAmount: requiredNumber("Amount is required!"),

  paytype: optionalId,
  payby: optionalId,
  processMethod: requiredId("Process Method is required!"),
  snailMail: optionalId,
  remarks: optionalText,

  weblink: optionalText,
  onlineAccessUsername: optionalText,
  onlineAccessPassword: optionalText,
  paymentDueDate: optionalText,
  active: z.boolean().default(true),

  workflow: optionalText,
});

export type PurchaseOrderForm = z.infer<typeof purchaseOrderFormSchema>;

/** Frequency of Payment (paytype) options, as in the old screen */
export const PAYTYPE_OPTIONS = [
  { value: 1, label: "Monthly" },
  { value: 2, label: "Quarterly" },
  { value: 3, label: "Half Yearly" },
  { value: 4, label: "Yearly" },
  { value: 5, label: "Weekly" },
  { value: 6, label: "Every 2 years" },
  { value: 7, label: "Every 3 years" },
];

/** Process Method options, as in the old screen */
export const PROCESS_METHOD_OPTIONS = [
  { value: 1, label: "Auto-charge" },
  { value: 2, label: "Manual- Admin to call" },
];

export const PO_TYPE_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Recurrent", label: "Recurrent" },
];

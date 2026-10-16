import { z } from "zod";

const optionalId = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
  z.number().nullable()
);

const optionalText = z.string().nullable().optional();

export const clientFormSchema = z.object({
  id: z.number().default(0),
  branchId: z.number().default(0),
  companyId: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, { message: "Company is required!" })
  ),
  project: z.string().trim().min(1, "Client is required!"),
  projectDescription: optionalText,
  vendorCompany: optionalText,
  personName: optionalText,
  addressLine1: optionalText,
  addressLine2: optionalText,
  countryId: optionalId,
  stateId: optionalId,
  cityId: optionalId,
  zip: optionalText,
  active: z.boolean().default(true),
});

export type ClientForm = z.infer<typeof clientFormSchema>;

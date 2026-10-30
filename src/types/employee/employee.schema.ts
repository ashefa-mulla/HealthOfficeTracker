import { z } from "zod";

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

const optionalText = z.string().nullable().optional();

const optionalEmail = z
  .string()
  .nullable()
  .optional()
  .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Email is not valid!",
  });

export const employeeFormSchema = z
  .object({
    // identity (hidden)
    id: z.number().default(0),
    userId: z.number().default(0),
    identityId: optionalText,
    employerCode: optionalText,

    // profile
    firstname: z.string().trim().min(1, "First Name is required!"),
    middlename: optionalText,
    lastname: z.string().trim().min(1, "Last Name is required!"),
    designationid: requiredId("Designation is required!"),
    dob: optionalText,
    joiningDate: z.string().min(1, "Joining Date is required!"),
    relieveDate: optionalText,
    maritalStatus: optionalText,
    payrollOn: z.boolean().default(false),
    noOfChild: optionalId,
    active: z.boolean().default(true),
    profileimage: optionalText,
    cvdoc: optionalText,
    agreementDoc: optionalText,

    // contact
    primaryContact: z
      .string()
      .trim()
      .min(1, "Primary Contact is required!")
      .regex(/^((\+91-?)|0)?[0-9]{10}$/, "Primary Contact is not valid!"),
    primaryEmail: z
      .string()
      .trim()
      .min(1, "Primary Email is required!")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid!"),
    alternateContact: optionalText,
    alternateEmail: optionalEmail,
    emergencycontactperson: optionalText,
    emergencycontact: optionalText,

    // address
    addressLine1: optionalText,
    addressLine2: optionalText,
    countryId: requiredId("Country is required!"),
    stateId: requiredId("State is required!"),
    cityId: requiredId("City is required!"),
    zip: optionalText,
    timezone: z.string().trim().min(1, "Time Zone is required!"),
    comments: optionalText,

    // login (UserDetail)
    // On create the username is the Primary Email and the password is the default one
    // (same as the Angular app); both are filled in by the mapper, not entered by the user.
    userName: optionalText,
    password: optionalText,
    reTypePassword: optionalText,
    userType: requiredId("User Type is required!"),
    pin: optionalText,
    userActive: z.boolean().default(true),
  });

export type EmployeeForm = z.infer<typeof employeeFormSchema>;

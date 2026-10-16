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
    designationid: optionalId,
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
    primaryContact: optionalText,
    primaryEmail: optionalEmail,
    alternateContact: optionalText,
    alternateEmail: optionalEmail,
    emergencycontactperson: optionalText,
    emergencycontact: optionalText,

    // address
    addressLine1: optionalText,
    addressLine2: optionalText,
    countryId: optionalId,
    stateId: optionalId,
    cityId: optionalId,
    zip: optionalText,
    timezone: optionalText,
    comments: optionalText,

    // login (UserDetail)
    userName: z
      .string()
      .trim()
      .min(1, "Username/Email is required!")
      .regex(/^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/, "Username/Email is not valid!"),
    password: optionalText,
    reTypePassword: optionalText,
    userType: requiredId("User Type is required!"),
    pin: optionalText,
    userActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    // Password is only entered when creating a new user
    if (!data.id) {
      if (!data.password) {
        ctx.addIssue({ code: "custom", path: ["password"], message: "Password is required!" });
      }
      if (!data.reTypePassword) {
        ctx.addIssue({ code: "custom", path: ["reTypePassword"], message: "Re-type Password is required!" });
      } else if (data.password !== data.reTypePassword) {
        ctx.addIssue({
          code: "custom",
          path: ["reTypePassword"],
          message: "'Re-type Password' and 'Password' do not match!",
        });
      }
    }
  });

export type EmployeeForm = z.infer<typeof employeeFormSchema>;

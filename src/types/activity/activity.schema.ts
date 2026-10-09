import { z } from 'zod';

export const activityEditFormSchema = z.object({
  id: z.number().default(0),
  branchid: z.number().default(1),
  companyid: z.number().default(1),
  employeeid: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  taskListid: z.number().default(0),
  projectId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, {
        message: 'Client is required!',
      })
  ),
  subProjectId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, {
        message: 'Project is required!',
      })
  ),
  subProjectCategoryId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  activity: z.string().min(1, 'Activity is required!'),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  startTimeDisplay: z.string().default(''),
  endTimeDisplay: z.string().default(''),
  duration: z.string().default('00:00:00'),
  activeInvoice: z.boolean().default(true),
  isAdmin: z.boolean().default(true),
  updatedBy: z.number().default(0),
  ActivityUpdatedby: z.number().default(0),
});

export type ActivityEditForm = z.infer<typeof activityEditFormSchema>;

export const emptyActivityEditForm = (empId = 0, companyId = 1, branchId = 1): ActivityEditForm => ({
  id: 0,
  branchid: branchId,
  companyid: companyId,
  employeeid: empId,
  taskListid: 0,
  projectId: 0,
  subProjectId: 0,
  subProjectCategoryId: 0,
  activity: '',
  startTime: '',
  endTime: '',
  startTimeDisplay: '',
  endTimeDisplay: '',
  duration: '00:00:00',
  activeInvoice: true,
  isAdmin: true,
  updatedBy: empId,
  ActivityUpdatedby: empId,
});

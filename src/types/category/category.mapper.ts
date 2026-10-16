import { CategoryForm } from "./category.schema";

const text = (v: any) => (v === undefined || v === null ? "" : String(v));
const idOrNull = (v: any) => (v ? Number(v) : null);

export const emptyCategoryForm = (): CategoryForm => ({
  id: 0,
  branchId: 0,
  companyId: null as any,
  projectId: null as any,
  subprojectId: null as any,
  subcategory: "",
  description: "",
  amount: null,
  active: true,
  projectActive: true,
});

/** GET /api/TrackerSubProjectCategory/GetTrackerSubProjectCategorybyID/{id} returns TblTrackerSubProjectCategory (camelCased). */
export const toCategoryForm = (data: any): CategoryForm => ({
  id: Number(data?.id || 0),
  branchId: Number(data?.branchId || 0),
  companyId: idOrNull(data?.companyId) as any,
  projectId: idOrNull(data?.projectId) as any,
  subprojectId: idOrNull(data?.subprojectId) as any,
  subcategory: text(data?.subcategory),
  description: text(data?.description),
  amount: data?.amount === null || data?.amount === undefined ? null : Number(data.amount),
  active: data?.active !== false,
  projectActive: data?.projectActive !== false,
});

/** Payload for POST /api/TrackerSubProjectCategory/addeditSubProjectCategory (TrackerSubProjectCategoryModel). */
export const toCategoryModel = (form: CategoryForm) => ({
  id: Number(form.id || 0),
  companyId: Number(form.companyId),
  branchId: Number(form.branchId || 1),
  subcategory: form.subcategory.trim(),
  description: form.description || "",
  amount: form.amount ?? 0,
  subprojectId: Number(form.subprojectId),
  projectId: Number(form.projectId),
  active: Boolean(form.active),
  projectActive: Boolean(form.projectActive),
});

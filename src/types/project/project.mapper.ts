import { ProjectForm } from "./project.schema";
import { formatLocalDateToIso } from "@/helpers/dateHelper";

const text = (v: any) => (v === undefined || v === null ? "" : String(v));
const idOrNull = (v: any) => (v ? Number(v) : null);

export const emptyProjectForm = (): ProjectForm => ({
  id: 0,
  branchId: 0,
  companyId: null as any,
  projectId: null as any,
  subcategory: "",
  description: "",
  amount: null,
  projectCategory: null,
  assignDate: "",
  eta: "",
  etaTimebyproject: "",
  active: true,
  projectActive: true,
});

/** GET /api/TrackerSubProject/GetTrackerSubProject/{id} returns TblTrackerSubProject (camelCased). */
export const toProjectForm = (data: any): ProjectForm => ({
  id: Number(data?.id || 0),
  branchId: Number(data?.branchId || 0),
  companyId: idOrNull(data?.companyId) as any,
  projectId: idOrNull(data?.projectId) as any,
  subcategory: text(data?.subcategory),
  description: text(data?.description),
  amount: data?.amount === null || data?.amount === undefined ? null : Number(data.amount),
  projectCategory: idOrNull(data?.projectCategory),
  assignDate: data?.assignDate ? formatLocalDateToIso(data.assignDate) : "",
  eta: data?.eta ? formatLocalDateToIso(data.eta) : "",
  etaTimebyproject: text(data?.etatimebyproject),
  active: data?.active !== false,
  projectActive: data?.projectActive !== false,
});

/** Payload for POST /api/TrackerSubProject/addeditSubProject (TrackerSubProjectModel). */
export const toProjectModel = (form: ProjectForm) => ({
  id: Number(form.id || 0),
  companyId: Number(form.companyId),
  branchId: Number(form.branchId || 1),
  projectId: Number(form.projectId),
  subcategory: form.subcategory.trim(),
  description: form.description || "",
  amount: form.amount ?? 0,
  active: Boolean(form.active),
  projectActive: Boolean(form.projectActive),
  projectCategory: form.projectCategory || null,
  assignDate: form.assignDate ? formatLocalDateToIso(form.assignDate) : null,
  eta: form.eta ? formatLocalDateToIso(form.eta) : null,
  etaTimebyproject: form.etaTimebyproject || "",
});

import { ClientForm } from "./client.schema";

const text = (v: any) => (v === undefined || v === null ? "" : String(v));
const idOrNull = (v: any) => (v ? Number(v) : null);

export const emptyClientForm = (): ClientForm => ({
  id: 0,
  branchId: 0,
  companyId: null as any,
  project: "",
  projectDescription: "",
  vendorCompany: "",
  personName: "",
  addressLine1: "",
  addressLine2: "",
  countryId: null,
  stateId: null,
  cityId: null,
  zip: "",
  active: true,
});

/** GET /api/TrackerProject/GetTrackerProject/{id} returns TblTrackerProject (camelCased). */
export const toClientForm = (data: any): ClientForm => ({
  id: Number(data?.id || 0),
  branchId: Number(data?.branchId || 0),
  companyId: idOrNull(data?.companyId) as any,
  project: text(data?.project),
  projectDescription: text(data?.projectDescription),
  vendorCompany: text(data?.vendorCompany),
  personName: text(data?.personName),
  addressLine1: text(data?.addressLine1),
  addressLine2: text(data?.addressLine2),
  countryId: idOrNull(data?.countryId),
  stateId: idOrNull(data?.stateId),
  cityId: idOrNull(data?.cityId),
  zip: text(data?.zip),
  active: data?.active !== false,
});

/** Payload for POST /api/TrackerProject/addeditTrackerProject (TrackerProjectModel). */
export const toClientModel = (form: ClientForm) => ({
  id: Number(form.id || 0),
  companyId: Number(form.companyId),
  branchId: Number(form.branchId || 1),
  project: form.project.trim(),
  projectDescription: form.projectDescription || "",
  vendorCompany: form.vendorCompany || "",
  personName: form.personName || "",
  addressLine1: form.addressLine1 || "",
  addressLine2: form.addressLine2 || "",
  countryId: form.countryId || 0,
  stateId: form.stateId || 0,
  cityId: form.cityId || 0,
  zip: form.zip || "",
  active: Boolean(form.active),
});

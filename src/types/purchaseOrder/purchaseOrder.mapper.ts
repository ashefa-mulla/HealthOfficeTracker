import { PurchaseOrderListItem } from "./purchaseOrder.types";
import { PurchaseOrderForm } from "./purchaseOrder.schema";
import { formatLocalDateToIso } from "@/helpers/dateHelper";

/** Case/underscore-insensitive lookup: "PO_Type" / "po_Type" / "pO_Type" / "poType" all match "potype". */
const pick = (row: any, ...names: string[]): any => {
  const wanted = names.map((n) => n.replace(/_/g, "").toLowerCase());
  for (const key of Object.keys(row || {})) {
    if (wanted.includes(key.replace(/_/g, "").toLowerCase())) return row[key];
  }
  return null;
};

const textOrNull = (v: any): string | null =>
  v === undefined || v === null || v === "" ? null : String(v);

export const toPurchaseOrderListItem = (row: any): PurchaseOrderListItem => ({
  id: Number(pick(row, "id") || 0),
  nextDate: textOrNull(pick(row, "paymentDueDate")),
  poDate: textOrNull(pick(row, "poDate")),
  amount: Number(pick(row, "poAmount") || 0),
  vendor: textOrNull(pick(row, "name")),
  paymentFrequency: textOrNull(pick(row, "paytypeName")),
  poType: textOrNull(pick(row, "poType")),
  code: textOrNull(pick(row, "code")),
  accountNo: pick(row, "accountNo"),
  remarks: textOrNull(pick(row, "remarks")),
});

// ---------------------------------------------------------------------------
// Add / Edit form
// ---------------------------------------------------------------------------

const fText = (v: any) => (v === undefined || v === null ? "" : String(v));
const fId = (v: any) => (v !== undefined && v !== null && v !== "" && !isNaN(Number(v)) && Number(v) > 0 ? Number(v) : null);
const fNum = (v: any) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? null : Number(v));
const fDate = (v: any) => (v ? formatLocalDateToIso(v) : "");

export const emptyPurchaseOrderForm = (): PurchaseOrderForm => ({
  id: 0,
  code: "",
  podate: formatLocalDateToIso(new Date()),
  poType: null as any,
  startDate: "",
  endDate: "",
  categoryId: null as any,
  vendorId: null as any,
  vendorAccountNo: null,
  why: "",
  accountable: "",
  costCentreId: null,
  noOfQty: 0,
  lowerLimit: null as any,
  upperLimit: null as any,
  principalAmt: null as any,
  interestAmt: null as any,
  poAmount: null as any,
  paytype: null,
  payby: null,
  processMethod: null as any,
  snailMail: null,
  remarks: "",
  weblink: "",
  onlineAccessUsername: "",
  onlineAccessPassword: "",
  paymentDueDate: "",
  active: true,
  workflow: "",
});

/** GET /api/PurchaseOrder/GetPurchaseorder/{id} returns TblPodetail (camelCased). */
export const toPurchaseOrderForm = (d: any): PurchaseOrderForm => ({
  id: Number(d?.id || 0),
  code: fText(d?.code),
  podate: fDate(d?.podate),
  poType: d?.poType === "General" || d?.poType === "Recurrent" ? d.poType : null,
  startDate: fDate(d?.startDate),
  endDate: fDate(d?.endDate),
  categoryId: fId(d?.categoryId) as any,
  vendorId: fId(d?.vendorId) as any,
  vendorAccountNo: fId(d?.vendorAccountNo),
  why: fText(d?.why),
  accountable: fText(d?.accountable),
  costCentreId: fId(d?.costCentreId),
  noOfQty: fNum(d?.noOfQty) as any,
  lowerLimit: fNum(d?.lowerLimit) as any,
  upperLimit: fNum(d?.upperLimit) as any,
  principalAmt: fNum(d?.principalAmt) as any,
  interestAmt: fNum(d?.interestAmt) as any,
  poAmount: fNum(d?.poAmount) as any,
  paytype: fId(d?.paytype),
  payby: fId(d?.payby),
  processMethod: fId(d?.processMethod) as any,
  snailMail: fId(d?.snailMail),
  remarks: fText(d?.remarks),
  weblink: fText(d?.weblink),
  onlineAccessUsername: fText(d?.onlineAccessUsername),
  onlineAccessPassword: fText(d?.onlineAccessPassword),
  paymentDueDate: fDate(d?.paymentDueDate),
  active: d?.active !== false,
  workflow: fText(d?.workflow),
});

const dOrNull = (v: any) => (v ? formatLocalDateToIso(v) : null);

/** Scalar fields of the loaded record only (drops any navigation objects/arrays). */
const plainFields = (raw: any): Record<string, any> => {
  const out: Record<string, any> = {};
  Object.keys(raw || {}).forEach((k) => {
    const v = raw[k];
    if (v === null || typeof v !== "object") out[k] = v;
  });
  return out;
};

/**
 * Payload for POST /api/PurchaseOrder/addeditPurchasehorder (PurchaseOrderModel).
 * `raw` is the record loaded by GetPurchaseorder/{id}; fields that are not on the form
 * (check/CC detail, bank name, online access flag, order...) are sent back unchanged so an
 * update never blanks them.
 * `filesdoc` is the path of a newly uploaded "Account Summary" file, or "NoFile".
 */
export const toPurchaseOrderModel = (
  form: PurchaseOrderForm,
  raw: any,
  userId: number,
  filesdoc: string
) => ({
  ...plainFields(raw),
  id: Number(form.id || 0),
  companyId: Number(raw?.companyId || localStorage.getItem("companyid") || 1),
  podate: dOrNull(form.podate),
  code: form.code || raw?.code || "0",
  poType: form.poType,
  categoryId: Number(form.categoryId),
  vendorId: Number(form.vendorId),
  vendorAccountNo: form.vendorAccountNo,
  noOfQty: form.noOfQty,
  poAmount: form.poAmount,
  payby: form.payby === null ? null : String(form.payby),
  remarks: form.remarks || "",
  weblink: form.weblink || "",
  paytype: form.paytype ?? 0,
  active: Boolean(form.active),
  updatedBy: userId || Number(raw?.updatedBy || 0),
  updatedDate: new Date().toISOString(),
  costCentreId: form.costCentreId ?? 0,
  paymentDueDate: dOrNull(form.paymentDueDate),
  processMethod: Number(form.processMethod),
  startDate: dOrNull(form.startDate),
  endDate: dOrNull(form.endDate),
  why: form.why || "",
  accountable: form.accountable || "",
  onlineAccessUsername: form.onlineAccessUsername || "",
  onlineAccessPassword: form.onlineAccessPassword || "",
  workflow: form.workflow || "",
  lowerLimit: form.lowerLimit,
  upperLimit: form.upperLimit,
  principalAmt: form.principalAmt,
  interestAmt: form.interestAmt,
  snailMail: form.snailMail === null ? null : String(form.snailMail),
  filesdoc: filesdoc || "NoFile",
});

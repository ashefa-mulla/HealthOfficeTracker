import { VendorAccountForm } from "./vendorAccount.schema";
import { VendorAccountNumberItem } from "./vendorAccount.types";

const text = (v: any) => (v === undefined || v === null ? "" : String(v));

/** Digits-only string for a numeric DB column (avoids "1e+21" style output for big numbers). */
const digits = (v: any): string => {
  if (v === undefined || v === null || v === "") return "";
  if (typeof v === "number") return v.toLocaleString("fullwide", { useGrouping: false });
  return String(v);
};

export const emptyVendorAccountForm = (): VendorAccountForm => ({
  id: 0,
  categoryId: null as any,
  name: "",
  contact: "",
  emailId: "",
  address: "",
  otherInformation: "",
  active: true,
  accountNumbers: [],
});

/**
 * GET /api/VendorAccount/GetVendorAccounts/{id} (VendorAccountModel, camelCased)
 * + account numbers from GetVendorAccountNumberByVendorID/{id}.
 */
export const toVendorAccountForm = (
  data: any,
  numbers: VendorAccountNumberItem[]
): VendorAccountForm => ({
  id: Number(data?.id || 0),
  categoryId: (data?.categoryId ? Number(data.categoryId) : null) as any,
  name: text(data?.name),
  contact: digits(data?.contact),
  emailId: text(data?.emailId),
  address: text(data?.address),
  otherInformation: text(data?.otherInformation),
  active: data?.active !== false,
  accountNumbers: (numbers || []).map((n) => ({
    rowId: Number(n.id || 0),
    accountNo: digits(n.accountNo),
  })),
});

/**
 * Payload for POST /api/VendorAccount/addeditvendoraccount (VendorAccountModel).
 *
 * The API only reports success for a NEW vendor when account numbers are posted
 * (otherwise it returns 400 even though the vendor was inserted), so an empty list
 * is sent as null for new vendors.
 * Account numbers are sent as digit strings: numeric(18) can exceed JS number precision
 * and the API's Newtonsoft deserializer converts numeric strings to decimal.
 */
export const toVendorAccountModel = (form: VendorAccountForm) => {
  const isEdit = Number(form.id || 0) > 0;
  const numbers = (form.accountNumbers || []).map((n) => ({
    id: Number(n.rowId || 0),
    vandorAccountID: isEdit ? Number(form.id) : null,
    accountNo: n.accountNo,
  }));

  return {
    id: Number(form.id || 0),
    categoryId: Number(form.categoryId),
    name: form.name.trim(),
    address: form.address || "",
    contact: form.contact ? form.contact : null,
    emailId: form.emailId || "",
    active: Boolean(form.active),
    getAllAccountCategory: false,
    otherInformation: form.otherInformation || "",
    tblVandorAccountNumber: numbers.length === 0 && !isEdit ? null : numbers,
  };
};

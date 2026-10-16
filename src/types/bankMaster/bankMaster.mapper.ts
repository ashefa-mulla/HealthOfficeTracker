import { BankMasterForm } from "./bankMaster.schema";
import { formatLocalDateToIso, parseSafeDate } from "@/helpers/dateHelper";

/** Digits-only string for a numeric DB column (avoids "1e+21" style output for big numbers). */
const digits = (v: any): string => {
  if (v === undefined || v === null || v === "") return "";
  if (typeof v === "number") return v.toLocaleString("fullwide", { useGrouping: false });
  return String(v);
};

/** "YYYY-MM-DD" with no time/zone, so the server never shifts the day. */
const toDateOnly = (v: any): string => {
  const d = parseSafeDate(v);
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const emptyBankMasterForm = (): BankMasterForm => ({
  id: 0,
  name: "",
  accountNo: "",
  openingDate: formatLocalDateToIso(new Date()),
  active: true,
});

/** GET /api/BankMaster/GetBankMaster/{id} returns TblBankMaster (camelCased). */
export const toBankMasterForm = (data: any): BankMasterForm => ({
  id: Number(data?.id || 0),
  name: data?.name ? String(data.name) : "",
  accountNo: digits(data?.accountNo),
  openingDate: data?.openingDate ? formatLocalDateToIso(data.openingDate) : "",
  active: data?.active !== false,
});

/**
 * Payload for POST /api/BankMaster/addeditBankMaster (BankMasterModel).
 * AccountNo is sent as a digit string (numeric(18) can exceed JS number precision;
 * the API's Newtonsoft deserializer converts it to decimal).
 */
export const toBankMasterModel = (form: BankMasterForm) => ({
  id: Number(form.id || 0),
  accountNo: form.accountNo,
  name: form.name.trim(),
  openingDate: form.openingDate ? toDateOnly(form.openingDate) : null,
  active: Boolean(form.active),
});

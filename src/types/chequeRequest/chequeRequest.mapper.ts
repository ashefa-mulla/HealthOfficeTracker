import { ChequeRequestForm } from "./chequeRequest.schema";
import { formatLocalDateToIso, parseSafeDate } from "@/helpers/dateHelper";

const text = (v: any) => (v === undefined || v === null ? "" : String(v));
const idOrNull = (v: any) => (v ? Number(v) : null);

/** "YYYY-MM-DD" with no time/zone, so the server never shifts the day. */
const toDateOnly = (v: any): string => {
  const d = parseSafeDate(v);
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * RequestDate is a DateOnly on the server entity; depending on the JSON settings it can
 * arrive as "yyyy-MM-dd" or as { year, month, day }. Handle both.
 */
const readDate = (v: any): string => {
  if (!v) return "";
  if (typeof v === "object" && v.year && v.month && v.day) {
    return formatLocalDateToIso(new Date(Number(v.year), Number(v.month) - 1, Number(v.day)));
  }
  return formatLocalDateToIso(v);
};

export const emptyChequeRequestForm = (): ChequeRequestForm => ({
  id: 0,
  bankId: null as any,
  requestDate: formatLocalDateToIso(new Date()),
  payTo: "",
  memo: "",
  address: "",
  costCenterId: null as any,
  payMethod: "",
  amount: null as any,
});

/** GET /api/ChequeRequest/GetCheck/{id} returns TblChequeRequest (camelCased). */
export const toChequeRequestForm = (data: any): ChequeRequestForm => ({
  id: Number(data?.id || 0),
  bankId: idOrNull(data?.bankId) as any,
  requestDate: readDate(data?.requestDate),
  payTo: text(data?.payTo),
  memo: text(data?.memo),
  address: text(data?.address),
  costCenterId: idOrNull(data?.costCenterId) as any,
  payMethod: text(data?.payMethod),
  amount: data?.amount === null || data?.amount === undefined ? (null as any) : Number(data.amount),
});

/**
 * Payload for POST /api/ChequeRequest/addeditChequeRequest (ChequeRequestModel).
 * The API takes a batch: bankId / id live on the wrapper and are copied onto each row.
 * NOTE: for a NEW request the API also emails the request to accounting.
 */
export const toChequeRequestModel = (form: ChequeRequestForm, currentUser: string) => ({
  bankId: Number(form.bankId),
  id: Number(form.id || 0),
  currentUser,
  chequeRequest: [
    {
      id: Number(form.id || 0),
      bankId: Number(form.bankId),
      requestDate: toDateOnly(form.requestDate),
      payTo: form.payTo.trim(),
      memo: form.memo || "",
      address: form.address || "",
      costCenterId: Number(form.costCenterId),
      payMethod: form.payMethod || "",
      amount: form.amount,
    },
  ],
});

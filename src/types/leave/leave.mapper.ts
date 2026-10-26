import { LeaveApprovalForm, LeaveForm } from "./leave.schema";
import { LeaveTransactionModel } from "./leave.types";
import { formatLocalDateToIso, parseSafeDate } from "@/helpers/dateHelper";

const startOfTodayIso = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return formatLocalDateToIso(d);
};

/** Inclusive calendar-day count between two dates (used to pre-fill "Leaves"). */
export const calcLeaveDays = (from: any, to: any): number => {
  const f = parseSafeDate(from);
  const t = parseSafeDate(to);
  if (!f || !t) return 0;
  const start = new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime();
  const end = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
  if (end < start) return 0;
  return Math.round((end - start) / 86400000) + 1;
};

export const emptyLeaveForm = (empId?: number): LeaveForm => ({
  id: 0,
  empId: (empId || null) as any,
  fromDate: startOfTodayIso(),
  toDate: startOfTodayIso(),
  leaves: 1,
  isSickLeaves: false,
  isApprove: false,
});

/** GET /GetLeaveTransaction/{id} returns TblLeaveTransaction (camelCased). */
export const toLeaveForm = (data: any): LeaveForm => {
  const sick = Number(data?.sickLeaves || 0);
  const leaves = Number(data?.leaves || 0) + sick;
  return {
    id: Number(data?.id || 0),
    empId: (data?.empId ? Number(data.empId) : null) as any,
    fromDate: data?.fromDate ? formatLocalDateToIso(data.fromDate) : startOfTodayIso(),
    toDate: data?.toDate ? formatLocalDateToIso(data.toDate) : startOfTodayIso(),
    leaves,
    isSickLeaves: sick > 0,
    isApprove: Boolean(data?.isApprove),
  };
};

/**
 * NOTE: the API's AddEditLeaveTransaction reads sick-leave days from `LWP`
 * when isSickLeaves is true (it copies LWP -> SickLeaves, then zeroes LWP),
 * so LWP carries the day count in that case.
 */
export const toLeaveModel = (form: LeaveForm): LeaveTransactionModel => {
  const from = parseSafeDate(form.fromDate) || new Date();
  const days = Number(form.leaves || 0);
  return {
    id: Number(form.id || 0),
    year: from.getFullYear(),
    month: from.getMonth() + 1,
    fromDate: formatLocalDateToIso(form.fromDate),
    toDate: formatLocalDateToIso(form.toDate),
    empId: Number(form.empId),
    leaves: form.isSickLeaves ? 0 : days,
    sickLeaves: 0,
    pl: 0,
    sl: 0,
    lwp: form.isSickLeaves ? days : 0,
    pLeaves: 0,
    isApprove: Boolean(form.isApprove),
    isSickLeaves: Boolean(form.isSickLeaves),
  };
};

/** GET /GetLeaveTransaction/{id} -> admin approval form (days kept exactly as stored) */
export const toLeaveApprovalForm = (data: any): LeaveApprovalForm => ({
  id: Number(data?.id || 0),
  empId: Number(data?.empId || 0),
  fromDate: data?.fromDate ? formatLocalDateToIso(data.fromDate) : startOfTodayIso(),
  toDate: data?.toDate ? formatLocalDateToIso(data.toDate) : startOfTodayIso(),
  leaves: Number(data?.leaves || 0),
  sickLeaves: Number(data?.sickLeaves || 0),
  lwp: Number(data?.lwp || 0),
  pl: Number(data?.pl || 0),
  sl: Number(data?.sl || 0),
  isApprove: Boolean(data?.isApprove),
});

/**
 * Admin save: Leaves / SickLeaves / LWP are sent as entered (isSickLeaves stays false).
 * The API stores Pl from `pLeaves`, so the existing Pl is sent there.
 * NOTE: when approving with Leaves = 0 and SickLeaves = 0, the API moves LWP into Leaves.
 */
export const toLeaveApprovalModel = (form: LeaveApprovalForm): LeaveTransactionModel => {
  const from = parseSafeDate(form.fromDate) || new Date();
  return {
    id: Number(form.id || 0),
    year: from.getFullYear(),
    month: from.getMonth() + 1,
    fromDate: formatLocalDateToIso(form.fromDate),
    toDate: formatLocalDateToIso(form.toDate),
    empId: Number(form.empId),
    leaves: Number(form.leaves || 0),
    sickLeaves: Number(form.sickLeaves || 0),
    pl: Number(form.pl || 0),
    sl: Number(form.sl || 0),
    lwp: Number(form.lwp || 0),
    pLeaves: Number(form.pl || 0),
    isApprove: Boolean(form.isApprove),
    isSickLeaves: false,
  };
};

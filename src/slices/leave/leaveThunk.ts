import { createAsyncThunk } from '@reduxjs/toolkit';
import leaveService from '../../services/leaveService';
import toastService from '../../services/toastService';
import { LeaveApprovalForm, LeaveForm } from '../../types/leave/leave.schema';
import {
  toLeaveApprovalForm,
  toLeaveApprovalModel,
  toLeaveForm,
  toLeaveModel,
} from '../../types/leave/leave.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setEmployeeList,
  setError,
  saveSuccess,
  deleteSuccess,
} from './leaveSlice';

/**
 * Fetch leave transactions for an employee.
 * Note: the API only honours month/year when empId is 0 (admin "all employees").
 */
export const fetchLeaveList = createAsyncThunk(
  'leave/fetchLeaveList',
  async (
    params: { empId: number; month?: number; year?: number; currentYear?: boolean },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading());
      const list = await leaveService.getLeaveTransactionList(
        params.empId,
        params.month ?? 0,
        params.year ?? 0,
        params.currentYear ?? false
      );
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch leave list';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/** Admin Leave Management: every employee's leave transactions */
export const fetchAllEmployeeLeaves = createAsyncThunk(
  'leave/fetchAllEmployeeLeaves',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await leaveService.getLeaveEmployeeTransactionList();
      // The stored procedure can return placeholder rows with id 0 (the old screen filtered them too)
      const list = data.filter((r) => Number(r.id) > 0);
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch leave list';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/** Admin Leave Management: one leave for the edit / approve modal (does not touch list loading) */
export const fetchLeaveApprovalById = createAsyncThunk(
  'leave/fetchLeaveApprovalById',
  async (id: number) => {
    try {
      const data = await leaveService.getLeaveTransaction(id);
      return toLeaveApprovalForm(data);
    } catch (error: any) {
      toastService.error(error?.message || 'Failed to fetch leave details');
      throw error;
    }
  }
);

export const saveLeaveApproval = createAsyncThunk(
  'leave/saveLeaveApproval',
  async (form: LeaveApprovalForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await leaveService.addEditLeaveTransaction(toLeaveApprovalModel(form));
      const msg = form.isApprove ? 'Leave is approved' : 'Record is updated';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save leave';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  'leave/fetchLeaveById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await leaveService.getLeaveTransaction(id);
      const form = toLeaveForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch leave details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveLeave = createAsyncThunk(
  'leave/saveLeave',
  async (params: { form: LeaveForm; id: number }, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await leaveService.addEditLeaveTransaction(
        toLeaveModel(params.form)
      );
      const msg = params.id > 0 ? 'Record is updated' : 'Leave applied successfully';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save leave';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeLeave = createAsyncThunk(
  'leave/removeLeave',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await leaveService.deleteLeaveTransaction(id);
      dispatch(deleteSuccess(id));
      toastService.success('Record deleted');
      return id;
    } catch (error: any) {
      const errorMsg = error?.message || 'Error deleting record';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchLeaveEmployees = createAsyncThunk(
  'leave/fetchLeaveEmployees',
  async (companyId: number = 1, { dispatch }) => {
    try {
      const list = await leaveService.getEmployeeList(companyId);
      dispatch(setEmployeeList(list));
      return list;
    } catch (error: any) {
      console.error('Error fetching employee list:', error?.message);
      return [];
    }
  }
);

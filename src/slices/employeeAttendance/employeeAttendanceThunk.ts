import { createAsyncThunk } from '@reduxjs/toolkit';
import employeeAttendanceService from '../../services/employeeAttendanceService';
import toastService from '../../services/toastService';
import { EmployeeAttendanceForm } from '../../types/employeeAttendance/employeeAttendance.schema';
import { EmployeeAttendanceQueryParams } from '../../types/employeeAttendance/employeeAttendance.types';
import {
  toEmployeeAttendanceForm,
  toEmployeeAttendanceModel,
} from '../../types/employeeAttendance/employeeAttendance.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  saveSuccess,
  deleteSuccess,
} from './employeeAttendanceSlice';

export const fetchEmployeeAttendanceList = createAsyncThunk(
  'employeeAttendance/fetchEmployeeAttendanceList',
  async (params: EmployeeAttendanceQueryParams | undefined, { dispatch }) => {
    try {
      dispatch(setLoading());
      const response = await employeeAttendanceService.getEmployeeAttendanceList(params);
      dispatch(fetchSuccess(response));
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch employee attendance list';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchEmployeeAttendanceById = createAsyncThunk(
  'employeeAttendance/fetchEmployeeAttendanceById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await employeeAttendanceService.getEmployeeAttendanceById(id);
      const form = toEmployeeAttendanceForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch employee attendance details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveEmployeeAttendance = createAsyncThunk(
  'employeeAttendance/saveEmployeeAttendance',
  async (form: EmployeeAttendanceForm, { dispatch, getState }) => {
    try {
      dispatch(setSaving());
      const state = getState() as any;
      const currentUserId = state?.Login?.user?.id ?? null;
      const model = toEmployeeAttendanceModel(form, currentUserId);
      const response = await employeeAttendanceService.addEditEmployeeAttendance(model);
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(response?.message || msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save employee attendance';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeEmployeeAttendance = createAsyncThunk(
  'employeeAttendance/removeEmployeeAttendance',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await employeeAttendanceService.deleteEmployeeAttendance(id);
      dispatch(deleteSuccess(id));
      toastService.success('Record deleted');
      return id;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete employee attendance';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchEmployeeAttendanceDropdowns = createAsyncThunk(
  'employeeAttendance/fetchEmployeeAttendanceDropdowns',
  async (_: void, { dispatch }) => {
    try {
      const companyId =
        Number(localStorage.getItem('companyid') || localStorage.getItem('companyId')) || 1;
      const employees = await employeeAttendanceService.getEmployeeList(companyId);

      dispatch(setDropdowns({ employees, employeeList: employees }));
      return { employees, employeeList: employees };
    } catch (error: any) {
      console.warn('Failed to load employee dropdowns:', error);
      return { employees: [], employeeList: [] };
    }
  }
);

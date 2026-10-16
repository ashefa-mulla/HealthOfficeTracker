import { createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';
import toastService from '../../services/toastService';
import { EmployeeForm } from '../../types/employee/employee.schema';
import {
  toEmployeeForm,
  toEmployeeFormModel,
} from '../../types/employee/employee.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setLookups,
  setSelected,
  setDropdowns,
  setError,
  saveSuccess,
  deleteSuccess,
} from './employeeSlice';

/**
 * City / State columns: the API only returns ids, so resolve names through
 * CommonController (GetStates per country, GetCities per state).
 */
const loadLookups = async (list: any[], dispatch: any) => {
  try {
    const countryIds = [...new Set(list.map((e) => Number(e.countryId || 0)))].filter((v) => v > 0);
    const stateIds = [...new Set(list.map((e) => Number(e.stateId || 0)))].filter((v) => v > 0);

    const [stateGroups, cityGroups] = await Promise.all([
      Promise.all(countryIds.map((id) => employeeService.getStates(id).catch(() => []))),
      Promise.all(stateIds.map((id) => employeeService.getCities(id).catch(() => []))),
    ]);

    const states: Record<number, string> = {};
    const cities: Record<number, string> = {};
    stateGroups.flat().forEach((s) => (states[s.id] = s.name));
    cityGroups.flat().forEach((c) => (cities[c.id] = c.name));
    dispatch(setLookups({ states, cities }));
  } catch (error) {
    console.error('Error resolving city/state names:', error);
  }
};

export const fetchEmployeeList = createAsyncThunk(
  'employee/fetchEmployeeList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await employeeService.getUserList();
      dispatch(fetchSuccess(list));
      loadLookups(list, dispatch);
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch users';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchEmployeeById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const raw = await employeeService.getEmployee(id);
      const form = toEmployeeForm(raw);
      dispatch(setSelected({ form, raw }));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch user details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveEmployee = createAsyncThunk(
  'employee/saveEmployee',
  async (
    params: { form: EmployeeForm; raw: any; updatedBy: string },
    { dispatch }
  ) => {
    try {
      dispatch(setSaving());
      const response = await employeeService.addEditEmployee(
        toEmployeeFormModel(params.form, params.raw, params.updatedBy)
      );
      const msg = Number(params.form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save user';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeEmployee = createAsyncThunk(
  'employee/removeEmployee',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await employeeService.deleteEmployee(id);
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

/** Countries, designations, user types and time zones for the form dropdowns. */
export const fetchEmployeeDropdowns = createAsyncThunk(
  'employee/fetchEmployeeDropdowns',
  async (_: void, { dispatch }) => {
    try {
      const [countries, designations, userTypes, timeZones] = await Promise.all([
        employeeService.getCountries().catch(() => []),
        employeeService.getDesignations().catch(() => []),
        employeeService.getUserTypes().catch(() => []),
        employeeService.getTimeZones().catch(() => []),
      ]);
      dispatch(setDropdowns({ countries, designations, userTypes, timeZones }));
    } catch (error: any) {
      console.error('Error fetching employee dropdowns:', error?.message);
    }
  }
);

export const fetchStatesByCountry = createAsyncThunk(
  'employee/fetchStatesByCountry',
  async (countryId: number, { dispatch }) => {
    try {
      const states = countryId > 0 ? await employeeService.getStates(countryId) : [];
      dispatch(setDropdowns({ states }));
    } catch (error: any) {
      dispatch(setDropdowns({ states: [] }));
    }
  }
);

export const fetchCitiesByState = createAsyncThunk(
  'employee/fetchCitiesByState',
  async (stateId: number, { dispatch }) => {
    try {
      const cities = stateId > 0 ? await employeeService.getCities(stateId) : [];
      dispatch(setDropdowns({ cities }));
    } catch (error: any) {
      dispatch(setDropdowns({ cities: [] }));
    }
  }
);

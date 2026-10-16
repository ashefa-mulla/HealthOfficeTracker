import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EmployeeListItem,
  EmployeeLookups,
  LookupItem,
} from '@/types/employee/employee.types';
import { EmployeeForm } from '@/types/employee/employee.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface EmployeeDropdowns {
  countries: LookupItem[];
  states: LookupItem[];
  cities: LookupItem[];
  designations: LookupItem[];
  userTypes: LookupItem[];
  timeZones: LookupItem[];
}

export interface EmployeeExtendedState
  extends BaseEntityState<EmployeeListItem, EmployeeForm> {
  lookups: EmployeeLookups;
  /** Record loaded by get/{id}; its non-form fields are sent back on update */
  selectedRaw: any | null;
  dropdowns: EmployeeDropdowns;
}

const initialState: EmployeeExtendedState = {
  ...createBaseState<EmployeeListItem, EmployeeForm>(),
  lookups: { states: {}, cities: {} },
  selectedRaw: null,
  dropdowns: {
    countries: [],
    states: [],
    cities: [],
    designations: [],
    userTypes: [],
    timeZones: [],
  },
};

const employeeSlice = createSlice({
  name: 'Employee',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<EmployeeListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setLookups: (state, action: PayloadAction<EmployeeLookups>) => {
      state.lookups = action.payload;
    },

    setSelected: (
      state,
      action: PayloadAction<{ form: EmployeeForm; raw: any } | null>
    ) => {
      state.selected = action.payload ? action.payload.form : null;
      state.selectedRaw = action.payload ? action.payload.raw : null;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<EmployeeDropdowns>>) => {
      state.dropdowns = { ...state.dropdowns, ...action.payload };
    },

    saveSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.saving = false;
      state.success = true;
      state.message = action.payload;
    },

    deleteSuccess: (state, action: PayloadAction<number>) => {
      state.saving = false;
      state.success = true;
      state.list = state.list.filter((o) => o.id !== action.payload);
      state.message = 'Record deleted';
    },

    resetEmployeeState: (state) => {
      resetBaseState(state);
      state.selected = null;
      state.selectedRaw = null;
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  setLookups,
  setSelected,
  setDropdowns,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetEmployeeState,
} = employeeSlice.actions;

export default employeeSlice.reducer;

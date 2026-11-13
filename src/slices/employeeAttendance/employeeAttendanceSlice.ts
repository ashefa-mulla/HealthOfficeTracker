import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EmployeeAttendanceListItem,
  EmployeeAttendancePaginatedResponse,
} from '@/types/employeeAttendance/employeeAttendance.types';
import { EmployeeAttendanceForm } from '@/types/employeeAttendance/employeeAttendance.schema';
import { LookupItem } from '@/types/employee/employee.types';
import {
  createPaginatedState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
  PaginatedState,
} from '@/types/reducer.type';

export interface EmployeeAttendanceDropdowns {
  employees: LookupItem[];
  employeeList: LookupItem[];
}

export interface EmployeeAttendanceState
  extends BaseEntityState<EmployeeAttendanceListItem, EmployeeAttendanceForm>,
    PaginatedState {
  dropdowns: EmployeeAttendanceDropdowns;
}

const initialState: EmployeeAttendanceState = {
  ...createPaginatedState<EmployeeAttendanceListItem, EmployeeAttendanceForm>(100),
  dropdowns: { employees: [], employeeList: [] },
};

const employeeAttendanceSlice = createSlice({
  name: 'EmployeeAttendance',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<EmployeeAttendancePaginatedResponse>) => {
      state.loading = false;
      state.list = action.payload.data;
      state.totalRecords = action.payload.totalCount;
      state.pageSize = action.payload.pageSize;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<EmployeeAttendanceForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<EmployeeAttendanceDropdowns>>) => {
      const emps = action.payload.employees || action.payload.employeeList || state.dropdowns.employees || [];
      state.dropdowns = {
        ...state.dropdowns,
        ...action.payload,
        employees: emps,
        employeeList: emps,
      };
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
      const targetId = action.payload;
      state.list = state.list.filter(
        (o) => (o.id ?? o.ID) !== targetId
      );
      state.totalRecords = Math.max(0, state.totalRecords - 1);
      state.message = 'Record deleted';
    },

    resetEmployeeAttendanceState: (state) => {
      resetBaseState(state);
      state.selected = null;
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetEmployeeAttendanceState,
} = employeeAttendanceSlice.actions;

export default employeeAttendanceSlice.reducer;

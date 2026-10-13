import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LeaveEmployeeItem,
  LeaveTransactionListItem,
} from '@/types/leave/leave.types';
import { LeaveForm } from '@/types/leave/leave.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface LeaveExtendedState
  extends BaseEntityState<LeaveTransactionListItem, LeaveForm> {
  employeeList: LeaveEmployeeItem[];
}

const initialState: LeaveExtendedState = {
  ...createBaseState<LeaveTransactionListItem, LeaveForm>(),
  employeeList: [],
};

const leaveSlice = createSlice({
  name: 'Leave',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<LeaveTransactionListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<LeaveForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setEmployeeList: (state, action: PayloadAction<LeaveEmployeeItem[]>) => {
      state.employeeList = action.payload;
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

    resetLeaveState: (state) => {
      resetBaseState(state);
      state.selected = null;
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setEmployeeList,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetLeaveState,
} = leaveSlice.actions;

export default leaveSlice.reducer;

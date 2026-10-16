import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EvaluationRow } from '@/types/evaluation/evaluation.types';
import { LeaveEmployeeItem } from '@/types/leave/leave.types';
import {
  createBaseState,
  baseReducers,
  BaseEntityState,
} from '@/types/reducer.type';

export interface EvaluationExtendedState extends BaseEntityState<EvaluationRow, never> {
  employeeList: LeaveEmployeeItem[];
}

const initialState: EvaluationExtendedState = {
  ...createBaseState<EvaluationRow, never>(),
  employeeList: [],
};

const evaluationSlice = createSlice({
  name: 'Evaluation',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<EvaluationRow[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    clearList: (state) => {
      state.list = [];
      state.loading = false;
    },

    setEmployeeList: (state, action: PayloadAction<LeaveEmployeeItem[]>) => {
      state.employeeList = action.payload;
    },

    /** After lock / unlock: the whole month is locked or not */
    setLockState: (state, action: PayloadAction<boolean>) => {
      state.list = state.list.map((r) => ({ ...r, isLocked: action.payload }));
    },

    saveSuccess: (state) => {
      state.saving = false;
      state.success = true;
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  clearList,
  setEmployeeList,
  setLockState,
  setError,
  clearError,
  saveSuccess,
} = evaluationSlice.actions;

export default evaluationSlice.reducer;

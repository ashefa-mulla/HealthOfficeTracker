import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChequeRequestListItem } from '@/types/chequeRequest/chequeRequest.types';
import { ChequeRequestForm } from '@/types/chequeRequest/chequeRequest.schema';
import { LookupItem } from '@/types/employee/employee.types';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface ChequeRequestDropdowns {
  banks: LookupItem[];
  costCentres: LookupItem[];
  payMethods: LookupItem[];
}

export interface ChequeRequestExtendedState
  extends BaseEntityState<ChequeRequestListItem, ChequeRequestForm> {
  dropdowns: ChequeRequestDropdowns;
}

const initialState: ChequeRequestExtendedState = {
  ...createBaseState<ChequeRequestListItem, ChequeRequestForm>(),
  dropdowns: { banks: [], costCentres: [], payMethods: [] },
};

const chequeRequestSlice = createSlice({
  name: 'ChequeRequest',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<ChequeRequestListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<ChequeRequestForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<ChequeRequestDropdowns>>) => {
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

    resetChequeRequestState: (state) => {
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
  setDropdowns,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetChequeRequestState,
} = chequeRequestSlice.actions;

export default chequeRequestSlice.reducer;

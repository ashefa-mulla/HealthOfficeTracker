import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankMasterListItem } from '@/types/bankMaster/bankMaster.types';
import { BankMasterForm } from '@/types/bankMaster/bankMaster.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export type BankMasterState = BaseEntityState<BankMasterListItem, BankMasterForm>;

const initialState: BankMasterState = createBaseState<BankMasterListItem, BankMasterForm>();

const bankMasterSlice = createSlice({
  name: 'BankMaster',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<BankMasterListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<BankMasterForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
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

    resetBankMasterState: (state) => {
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
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetBankMasterState,
} = bankMasterSlice.actions;

export default bankMasterSlice.reducer;

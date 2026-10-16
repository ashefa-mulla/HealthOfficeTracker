import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VendorAccountListItem } from '@/types/vendorAccount/vendorAccount.types';
import { VendorAccountForm } from '@/types/vendorAccount/vendorAccount.schema';
import { LookupItem } from '@/types/employee/employee.types';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface VendorAccountExtendedState
  extends BaseEntityState<VendorAccountListItem, VendorAccountForm> {
  categories: LookupItem[];
}

const initialState: VendorAccountExtendedState = {
  ...createBaseState<VendorAccountListItem, VendorAccountForm>(),
  categories: [],
};

const vendorAccountSlice = createSlice({
  name: 'VendorAccount',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<VendorAccountListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<VendorAccountForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setCategories: (state, action: PayloadAction<LookupItem[]>) => {
      state.categories = action.payload;
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

    resetVendorAccountState: (state) => {
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
  setCategories,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetVendorAccountState,
} = vendorAccountSlice.actions;

export default vendorAccountSlice.reducer;

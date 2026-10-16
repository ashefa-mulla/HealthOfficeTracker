import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountCategoryListItem } from '@/types/accountCategory/accountCategory.types';
import { AccountCategoryForm } from '@/types/accountCategory/accountCategory.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export type AccountCategoryState = BaseEntityState<AccountCategoryListItem, AccountCategoryForm>;

const initialState: AccountCategoryState = createBaseState<
  AccountCategoryListItem,
  AccountCategoryForm
>();

const accountCategorySlice = createSlice({
  name: 'AccountCategory',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<AccountCategoryListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<AccountCategoryForm | null>) => {
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

    resetAccountCategoryState: (state) => {
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
  resetAccountCategoryState,
} = accountCategorySlice.actions;

export default accountCategorySlice.reducer;

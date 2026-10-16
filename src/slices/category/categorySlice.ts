import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryListItem } from '@/types/category/category.types';
import { LookupItem } from '@/types/employee/employee.types';
import { CategoryForm } from '@/types/category/category.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface CategoryDropdowns {
  companies: LookupItem[];
  clients: LookupItem[];
  projects: LookupItem[];
}

export interface CategoryExtendedState extends BaseEntityState<CategoryListItem, CategoryForm> {
  dropdowns: CategoryDropdowns;
}

const initialState: CategoryExtendedState = {
  ...createBaseState<CategoryListItem, CategoryForm>(),
  dropdowns: { companies: [], clients: [], projects: [] },
};

const categorySlice = createSlice({
  name: 'Category',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<CategoryListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<CategoryForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<CategoryDropdowns>>) => {
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

    resetCategoryState: (state) => {
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
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;

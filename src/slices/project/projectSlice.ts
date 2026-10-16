import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectListItem } from '@/types/project/project.types';
import { LookupItem } from '@/types/employee/employee.types';
import { ProjectForm } from '@/types/project/project.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface ProjectDropdowns {
  companies: LookupItem[];
  clients: LookupItem[];
  categories: LookupItem[];
}

export interface ProjectExtendedState extends BaseEntityState<ProjectListItem, ProjectForm> {
  dropdowns: ProjectDropdowns;
}

const initialState: ProjectExtendedState = {
  ...createBaseState<ProjectListItem, ProjectForm>(),
  dropdowns: { companies: [], clients: [], categories: [] },
};

const projectSlice = createSlice({
  name: 'Project',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<ProjectListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<ProjectForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<ProjectDropdowns>>) => {
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

    resetProjectState: (state) => {
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
  resetProjectState,
} = projectSlice.actions;

export default projectSlice.reducer;

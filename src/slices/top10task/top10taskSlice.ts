import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Top10TaskListItem,
  Top10TaskModel,
  EmployerNameListItem,
  TrackerProjectItem,
  TrackerSubProjectItem,
  TrackerSubProjectCategoryItem,
} from '@/types/top10task/top10task.types';
import {
  createPaginatedState,
  baseReducers,
  advancedPageReducers,
  paginationReducers,
  resetBaseState,
  BaseEntityState,
  PaginatedState,
} from '@/types/reducer.type';

export interface Top10TaskExtendedState
  extends BaseEntityState<Top10TaskListItem, Top10TaskModel>,
    PaginatedState {
  allTasks: Top10TaskListItem[];
  totalProjectedHours: string;
  pointPersonList: EmployerNameListItem[];
  projectList: TrackerProjectItem[];
  subProjectList: TrackerSubProjectItem[];
  subProjectCategoryList: TrackerSubProjectCategoryItem[];
  defaultStatus: string;
  searchQuery: string;
}

const initialBase = createPaginatedState<Top10TaskListItem, Top10TaskModel>(10);

const initialState: Top10TaskExtendedState = {
  ...initialBase,
  allTasks: [],
  totalProjectedHours: '0h 0m',
  pointPersonList: [],
  projectList: [],
  subProjectList: [],
  subProjectCategoryList: [],
  defaultStatus: 'P',
  searchQuery: '',
};

const top10TaskSlice = createSlice({
  name: 'Top10Task',
  initialState,
  reducers: {
    ...baseReducers,
    ...paginationReducers,
    ...advancedPageReducers,

    fetchSuccess: (state, action: PayloadAction<Top10TaskListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setAllTasks: (state, action: PayloadAction<Top10TaskListItem[]>) => {
      state.allTasks = action.payload;
    },

    setSelected: (state, action: PayloadAction<Top10TaskModel | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setTotalProjectedHours: (state, action: PayloadAction<string>) => {
      state.totalProjectedHours = action.payload;
    },

    setPointPersonList: (state, action: PayloadAction<EmployerNameListItem[]>) => {
      state.pointPersonList = action.payload;
    },

    setProjectList: (state, action: PayloadAction<TrackerProjectItem[]>) => {
      state.projectList = action.payload;
    },

    setSubProjectList: (state, action: PayloadAction<TrackerSubProjectItem[]>) => {
      state.subProjectList = action.payload;
    },

    setSubProjectCategoryList: (
      state,
      action: PayloadAction<TrackerSubProjectCategoryItem[]>
    ) => {
      state.subProjectCategoryList = action.payload;
    },

    setDefaultStatus: (state, action: PayloadAction<string>) => {
      state.defaultStatus = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
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
      state.allTasks = state.allTasks.filter((o) => o.id !== action.payload);
      state.totalRecords = Math.max(0, state.totalRecords - 1);
      state.message = 'Record deleted';
    },

    resetTop10TaskState: (state) => {
      resetBaseState(state);
      state.selected = null;
      state.searchQuery = '';
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  setAllTasks,
  setListWithPagination,
  setSelected,
  setSuccess,
  setError,
  setPagination,
  clearError,
  setTotalProjectedHours,
  setPointPersonList,
  setProjectList,
  setSubProjectList,
  setSubProjectCategoryList,
  setDefaultStatus,
  setSearchQuery,
  saveSuccess,
  deleteSuccess,
  resetTop10TaskState,
} = top10TaskSlice.actions;

export default top10TaskSlice.reducer;

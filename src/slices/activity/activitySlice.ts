import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskActivityItem } from '@/types/activity/activity.types';

export interface ActivityState {
  list: TaskActivityItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  searchTerm: string;
  startDate: string;
  endDate: string;
  selectedEmployeeId: number | null;
}

const initialState: ActivityState = {
  list: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalRecords: 0,
  totalPages: 1,
  searchTerm: '',
  startDate: '',
  endDate: '',
  selectedEmployeeId: null,
};

const activitySlice = createSlice({
  name: 'Activity',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setActivityList: (state, action: PayloadAction<TaskActivityItem[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<{
        currentPage: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
      }>
    ) => {
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
      state.totalRecords = action.payload.totalRecords;
      state.totalPages = action.payload.totalPages;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setSelectedEmployeeId: (state, action: PayloadAction<number | null>) => {
      state.selectedEmployeeId = action.payload;
    },
    resetActivityState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setActivityList,
  setPagination,
  setSearchTerm,
  setDateRange,
  setSelectedEmployeeId,
  resetActivityState,
} = activitySlice.actions;

export default activitySlice.reducer;

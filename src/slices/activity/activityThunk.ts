import { createAsyncThunk } from '@reduxjs/toolkit';
import taskActivityService from '@/services/taskActivityService';
import {
  setLoading,
  setError,
  setActivityList,
  setPagination,
} from './activitySlice';
import { TaskActivityQueryParams } from '@/types/activity/activity.types';

export const fetchActivityListWithPagination = createAsyncThunk(
  'activity/fetchWithPagination',
  async (params: TaskActivityQueryParams, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response =
        await taskActivityService.getActiveLogOfEmployeeWithPagination(params);

      dispatch(setActivityList(response.data));
      dispatch(
        setPagination({
          currentPage: response.currentPage,
          pageSize: response.pageSize,
          totalRecords: response.totalCount,
          totalPages: response.totalPages,
        })
      );
      return response;
    } catch (err: any) {
      const errorMsg =
        err?.message || 'Failed to fetch employee activity logs';
      dispatch(setError(errorMsg));
      throw err;
    }
  }
);

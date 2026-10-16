import { createAsyncThunk } from '@reduxjs/toolkit';
import evaluationService from '../../services/evaluationService';
import toastService from '../../services/toastService';
import {
  EvaluationLockPayload,
  EvaluationQuestionPayload,
  EvaluationSubmissionPayload,
} from '../../types/evaluation/evaluation.types';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setEmployeeList,
  setLockState,
  setError,
  saveSuccess,
} from './evaluationSlice';

export const fetchEvaluationSummary = createAsyncThunk(
  'evaluation/fetchEvaluationSummary',
  async (
    params: { employeeId: number; evalYear: number; evalMonth: number },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading());
      const list = await evaluationService.getMonthlySummary(
        params.employeeId,
        params.evalYear,
        params.evalMonth
      );
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch evaluation';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveEvaluationQuestion = createAsyncThunk(
  'evaluation/saveEvaluationQuestion',
  async (payload: EvaluationQuestionPayload, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await evaluationService.addEditQuestion(payload);
      dispatch(saveSuccess());
      toastService.success(payload.id > 0 ? 'Question is updated' : 'Question is added');
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save question';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveEvaluationSubmissions = createAsyncThunk(
  'evaluation/saveEvaluationSubmissions',
  async (payload: EvaluationSubmissionPayload[], { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await evaluationService.saveSubmissions(payload);
      dispatch(saveSuccess());
      toastService.success('Evaluation is saved');
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save evaluation';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/**
 * Lock / unlock a month for an employee. Applied immediately (like the old Angular toggle).
 * The current lock record id is re-read first so a lock created since the page loaded is updated, not duplicated.
 */
export const toggleEvaluationLock = createAsyncThunk(
  'evaluation/toggleEvaluationLock',
  async (
    params: {
      employeeId: number;
      evalYear: number;
      evalMonth: number;
      isLocked: boolean;
      lockedBy: number | null;
    },
    { dispatch }
  ) => {
    try {
      dispatch(setSaving());
      const current = await evaluationService.getMonthlySummary(
        params.employeeId,
        params.evalYear,
        params.evalMonth
      );
      const payload: EvaluationLockPayload = {
        id: current[0]?.lockId || 0,
        employeeId: params.employeeId,
        evalYear: params.evalYear,
        evalMonth: params.evalMonth,
        isLocked: params.isLocked,
        lockedAt: null,
        lockedBy: params.lockedBy,
      };
      const response = await evaluationService.saveLock(payload);
      dispatch(setLockState(params.isLocked));
      dispatch(saveSuccess());
      toastService.success(params.isLocked ? 'Evaluation locked.' : 'Evaluation unlocked.');
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to update lock';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const toggleEvaluationQuestion = createAsyncThunk(
  'evaluation/toggleEvaluationQuestion',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await evaluationService.toggleQuestionStatus(id);
      dispatch(saveSuccess());
      toastService.success('Status updated');
      return id;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to change status';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeEvaluationQuestion = createAsyncThunk(
  'evaluation/removeEvaluationQuestion',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await evaluationService.deleteQuestion(id);
      dispatch(saveSuccess());
      toastService.success('Record deleted');
      return id;
    } catch (error: any) {
      const errorMsg = error?.message || 'Error deleting record';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/** Employees for the Employee dropdown (GET api/Dashborad/GetTaem, as in the old Angular screen). */
export const fetchEvaluationEmployees = createAsyncThunk(
  'evaluation/fetchEvaluationEmployees',
  async (_: void, { dispatch }) => {
    try {
      const list = await evaluationService.getTeamList();
      dispatch(setEmployeeList(list));
    } catch (error: any) {
      console.error('Error fetching employee list:', error?.message);
    }
  }
);

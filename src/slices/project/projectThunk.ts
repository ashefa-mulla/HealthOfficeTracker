import { createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';
import toastService from '../../services/toastService';
import { ProjectForm } from '../../types/project/project.schema';
import { toProjectForm, toProjectModel } from '../../types/project/project.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  saveSuccess,
  deleteSuccess,
} from './projectSlice';

export const fetchProjectList = createAsyncThunk(
  'project/fetchProjectList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await projectService.getProjectList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch projects';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await projectService.getProject(id);
      const form = toProjectForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch project details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveProject = createAsyncThunk(
  'project/saveProject',
  async (form: ProjectForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await projectService.addEditProject(toProjectModel(form));
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save project';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeProject = createAsyncThunk(
  'project/removeProject',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await projectService.deleteProject(id);
      dispatch(deleteSuccess(id));
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

/** Companies, clients and project categories for the form dropdowns. */
export const fetchProjectDropdowns = createAsyncThunk(
  'project/fetchProjectDropdowns',
  async (_: void, { dispatch }) => {
    const [companies, clients, categories] = await Promise.all([
      projectService.getCompanies().catch(() => []),
      projectService.getClients().catch(() => []),
      projectService.getCategories().catch(() => []),
    ]);
    dispatch(setDropdowns({ companies, clients, categories }));
  }
);

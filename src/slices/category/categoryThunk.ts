import { createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/categoryService';
import projectService from '../../services/projectService';
import toastService from '../../services/toastService';
import { CategoryForm } from '../../types/category/category.schema';
import { toCategoryForm, toCategoryModel } from '../../types/category/category.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  saveSuccess,
  deleteSuccess,
} from './categorySlice';

export const fetchCategoryList = createAsyncThunk(
  'category/fetchCategoryList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await categoryService.getCategoryList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch categories';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await categoryService.getCategory(id);
      const form = toCategoryForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch category details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveCategory = createAsyncThunk(
  'category/saveCategory',
  async (form: CategoryForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await categoryService.addEditCategory(toCategoryModel(form));
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save category';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeCategory = createAsyncThunk(
  'category/removeCategory',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await categoryService.deleteCategory(id);
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

/** Companies and clients for the form dropdowns. */
export const fetchCategoryDropdowns = createAsyncThunk(
  'category/fetchCategoryDropdowns',
  async (_: void, { dispatch }) => {
    const [companies, clients] = await Promise.all([
      projectService.getCompanies().catch(() => []),
      projectService.getClients().catch(() => []),
    ]);
    dispatch(setDropdowns({ companies, clients }));
  }
);

/** Projects under the selected client. */
export const fetchCategoryProjects = createAsyncThunk(
  'category/fetchCategoryProjects',
  async (clientId: number, { dispatch }) => {
    const projects =
      clientId > 0 ? await categoryService.getProjectsByClient(clientId).catch(() => []) : [];
    dispatch(setDropdowns({ projects }));
  }
);

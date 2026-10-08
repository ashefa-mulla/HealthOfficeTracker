import { createAsyncThunk } from '@reduxjs/toolkit';
import top10TaskService from '../../services/top10taskService';
import { Top10TaskListItem, Top10TaskModel } from '../../types/top10task/top10task.types';
import toastService from '../../services/toastService';
import { formatLocalDateToIso } from '../../helpers/dateHelper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setAllTasks,
  setListWithPagination,
  setSelected,
  setSuccess,
  setError,
  setTotalProjectedHours,
  setPointPersonList,
  setProjectList,
  setSubProjectList,
  setSubProjectCategoryList,
  saveSuccess,
  deleteSuccess,
} from '../top10task/top10taskSlice';

/**
 * Helper to ensure all dates stored in Redux are serialized ISO strings without timezone shift
 */
export const formatSafeDate = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return formatLocalDateToIso(val);
};

/**
 * Format tasks with calculated hours & minutes from projected total minutes
 */
const formatTaskProjections = (tasks: Top10TaskListItem[]): Top10TaskListItem[] => {
  return tasks.map((task) => {
    const totalMinutes = Number(task.projected || 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return {
      ...task,
      assignDate: formatSafeDate(task.assignDate),
      eta: formatSafeDate(task.eta),
      etahh: hours,
      etamm: minutes < 10 ? `0${minutes}` : `${minutes}`,
    };
  });
};

/**
 * Calculate total projected hours for today's tasks
 */
export const calculateTodayProjectedHours = (tasks: Top10TaskListItem[]): string => {
  try {
    const today = formatLocalDateToIso(new Date()).split('T')[0];
    let totalMinutes = 0;

    tasks.forEach((task) => {
      if (task.assignDate) {
        const taskDate = formatLocalDateToIso(task.assignDate).split('T')[0];
        if (taskDate === today) {
          totalMinutes += Number(task.projected || 0);
        }
      }
    });

    const finalHours = Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes % 60;
    return `${finalHours}h ${finalMinutes}m`;
  } catch {
    return '0h 0m';
  }
};

/**
 * Fetch all tasks for user (full list for quick searching and today's projected calculation)
 */
export const fetchTaskListForUser = createAsyncThunk(
  'top10Task/fetchTaskListForUser',
  async (
    params: { empId: number; status: string; isAdmin?: boolean },
    { dispatch }
  ) => {
    try {
      let rawData: Top10TaskListItem[] = [];

      if (params.isAdmin) {
        rawData = await top10TaskService.getTaskListDetail();
      } else {
        rawData = await top10TaskService.getTaskListForUser(
          params.empId,
          params.status
        );
      }

      const formatted = formatTaskProjections(rawData);
      dispatch(setAllTasks(formatted));

      const totalHours = calculateTodayProjectedHours(formatted);
      dispatch(setTotalProjectedHours(totalHours));

      return formatted;
    } catch (error: any) {
      console.error('Error fetching full task list:', error?.message);
      return [];
    }
  }
);

/**
 * Fetch paginated tasks for user
 */
export const fetchTaskListWithPagination = createAsyncThunk(
  'top10Task/fetchTaskListWithPagination',
  async (
    params: {
      empId: number;
      status: string;
      pageNumber: number;
      pageSize: number;
    },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading());
      const response = await top10TaskService.getTaskListForUserWithPagination(
        params.empId,
        params.status,
        params.pageNumber || 1,
        params.pageSize || 10
      );

      const formattedData = formatTaskProjections(response.data || []);
      const totalCount = response.totalCount || formattedData.length;
      const totalPages = Math.ceil(totalCount / (params.pageSize || 10)) || 1;

      const payload = {
        data: formattedData,
        currentPage: params.pageNumber || 1,
        totalPages,
        pageSize: params.pageSize || 10,
        totalRecords: totalCount,
      };

      dispatch(setListWithPagination(payload));

      // Calculate projected hours from the items
      const todayTotal = calculateTodayProjectedHours(formattedData);
      dispatch(setTotalProjectedHours(todayTotal));

      return formattedData;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch tasks';
      console.error('Error fetching paginated tasks:', errorMsg);
      dispatch(setError(errorMsg));
      throw error;
    }
  }
);

/**
 * Fetch single task by ID (supports 'E' for Edit and 'C' for Clone)
 */
export const fetchTaskById = createAsyncThunk(
  'top10Task/fetchTaskById',
  async (
    params: { id: number; type?: 'E' | 'C'; loggedInUserId?: number },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading());
      const task = await top10TaskService.getTaskById(params.id);

      const isClone = params.type === 'C';

      const etaTimeVal = isClone
        ? { hour: 0, minute: 0, second: 0 }
        : {
          hour: Number((task as any).etaHH || (task as any).etahh || 0),
          minute: Number((task as any).etaMM || (task as any).etamm || 0),
          second: 0,
        };

      const mappedModel: Top10TaskModel = {
        id: isClone ? 0 : task.id,
        pointPerson: task.pointPerson ?? null,
        secondPerson: isClone
          ? task.pointPerson
          : (task.secondPerson ?? task.pointPerson),
        accountablePerson: isClone
          ? (params.loggedInUserId ?? task.accountablePerson)
          : task.accountablePerson,
        project: task.project ?? null,
        subproject: task.subproject ?? null,
        subProjectCategory: task.subProjectCategory ?? null,
        task: task.task ?? '',
        subject: task.subject ?? '',
        completed: isClone ? 'Not Started' : (task.completed || 'Not Started'),
        duration: task.duration ?? 0,
        projected: isClone ? 0 : (task.projected ?? 0),
        eta: isClone ? '' : formatSafeDate(task.eta),
        etaTime: etaTimeVal,
        etahh: isClone ? 0 : ((task as any).etahh ?? 0),
        etamm: isClone ? 0 : ((task as any).etamm ?? 0),
        actualTime: isClone ? 0 : (task.actualTime ?? 0),
        createdTime: formatSafeDate(task.createdTime),
        assignDate: isClone ? '' : formatSafeDate(task.assignDate),
        isRecurrent: isClone ? false : (task.isRecurrent ?? false),
      };

      dispatch(setSelected(mappedModel));

      // Trigger cascade lookups in parallel
      const lookups: Promise<any>[] = [];
      if (task.project) {
        lookups.push(dispatch(fetchTrackerSubProjects(Number(task.project))));
        if (task.subproject) {
          lookups.push(
            dispatch(
              fetchTrackerSubProjectCategories({
                projectId: Number(task.project),
                subProjectCategoryId: Number(task.subproject),
              })
            )
          );
        }
      }
      if (lookups.length > 0) {
        await Promise.allSettled(lookups);
      }

      return mappedModel;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch task details';
      console.error('Error fetching task by ID:', errorMsg);
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/**
 * Save Task (Create or Update)
 */
export const saveTask = createAsyncThunk(
  'top10Task/saveTask',
  async (
    params: { model: Top10TaskModel; id: number },
    { dispatch }
  ) => {
    try {
      dispatch(setSaving());
      const response = await top10TaskService.addOrEditTaskList(params.model);

      const msg =
        params.id > 0 ? 'Record is updated' : 'Record is added';

      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save task';
      console.error('Error saving task:', errorMsg);
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/**
 * Delete Task
 */
export const removeTask = createAsyncThunk(
  'top10Task/removeTask',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await top10TaskService.deleteTask(id);

      dispatch(deleteSuccess(id));
      toastService.success('Record deleted');
      return id;
    } catch (error: any) {
      const errorMsg = error?.message || 'Error deleting record';
      console.error('Error deleting task:', errorMsg);
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/**
 * Dropdown lookup thunks
 */
export const fetchPointPersonList = createAsyncThunk(
  'top10Task/fetchPointPersonList',
  async (_, { dispatch }) => {
    try {
      const list = await top10TaskService.getEmployerNameList();
      dispatch(setPointPersonList(list));
      return list;
    } catch (error: any) {
      console.error('Error fetching assignee list:', error?.message);
      return [];
    }
  }
);

export const fetchTrackerProjects = createAsyncThunk(
  'top10Task/fetchTrackerProjects',
  async (
    params: { companyId?: number; branchId?: number } = {},
    { dispatch }
  ) => {
    try {
      const companyId = params.companyId || 1;
      const branchId = params.branchId || 1;
      const list = await top10TaskService.getTrackerProject(companyId, branchId);
      dispatch(setProjectList(list));
      return list;
    } catch (error: any) {
      console.error('Error fetching tracker projects:', error?.message);
      return [];
    }
  }
);

export const fetchTrackerSubProjects = createAsyncThunk(
  'top10Task/fetchTrackerSubProjects',
  async (projectId: number, { dispatch }) => {
    try {
      const list = await top10TaskService.getTrackerSubProject(projectId);
      dispatch(setSubProjectList(list));
      return list;
    } catch (error: any) {
      console.error('Error fetching subprojects:', error?.message);
      return [];
    }
  }
);

export const fetchTrackerSubProjectCategories = createAsyncThunk(
  'top10Task/fetchTrackerSubProjectCategories',
  async (
    params: { projectId: number; subProjectCategoryId: number },
    { dispatch }
  ) => {
    try {
      const list = await top10TaskService.getTrackerSubProjectCategory(
        params.projectId,
        params.subProjectCategoryId
      );
      dispatch(setSubProjectCategoryList(list));
      return list;
    } catch (error: any) {
      console.error('Error fetching subproject categories:', error?.message);
      return [];
    }
  }
);

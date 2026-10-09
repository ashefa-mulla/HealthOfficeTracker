import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import {
  Top10TaskListItem,
  Top10TaskModel,
  UtilizationTrackerModel,
} from '@/types/top10task/top10task.types';
import {
  fetchTaskListWithPagination,
  fetchTaskListForUser,
  removeTask,
} from '../../../slices/top10task/top10taskThunk';
import {
  setDefaultStatus,
  setSearchQuery,
} from '../../../slices/top10task/top10taskSlice';
import top10TaskService from '../../../services/top10taskService';
import toastService from '@/services/toastService';
import { useAuthStore } from '../../../store/useAuthStore';
import { getNumericEmployeeId } from '../../../helpers/userHelper';
import { formatDateOnly } from '@/helpers/dateHelper';

const Top10TaskList: React.FC = () => {
  document.title = 'My Tracker Task | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { user, profileInfo } = useAuthStore();
  const empId = getNumericEmployeeId(profileInfo, user);

  // Check admin session role
  const sessionRole =
    localStorage.getItem('sessionrole') ||
    profileInfo?.userRole ||
    (profileInfo?.utype === 1 || profileInfo?.utype === 4 ? 'Admin' : '');
  const isAdmin =
    sessionRole === 'Admin' ||
    profileInfo?.utype === 1 ||
    profileInfo?.utype === 4;
  const sessionType = isAdmin ? 1 : 0;

  // Redux state
  const {
    list,
    allTasks,
    loading,
    saving,
    totalPages,
    currentPage,
    pageSize,
    totalRecords,
    totalProjectedHours,
    defaultStatus,
  } = useSelector((state: RootState) => (state as any).Top10Task);

  // Server-side pagination and search states
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize_Local, setPageSize_Local] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  // In-Row Live Timer States
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<number | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [timerRunningSeconds, setTimerRunningSeconds] = useState<number>(0);
  const [timerLoadingTaskId, setTimerLoadingTaskId] = useState<number | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTaskRef = useRef<{
    id: number;
    baseSec: number;
    initialSec: number;
    startTime: number;
    item: Top10TaskListItem | null;
  } | null>(null);

  // Permission flags matching Angular
  const isHideDelete = !isAdmin;
  const isHideEdit = false;

  // Helper: Safely parse integer with fallback
  const toSafeInt = (val: any, fallback = 0): number => {
    if (val === undefined || val === null || val === '') return fallback;
    const n = Number(val);
    return isNaN(n) ? fallback : Math.floor(n);
  };

  // Helper: Parse duration string/number into total seconds
  const parseDurationToSeconds = (durationVal?: any): number => {
    if (durationVal === undefined || durationVal === null || durationVal === '') return 0;
    if (typeof durationVal === 'string' && durationVal.includes(':')) {
      const parts = durationVal.split(':').map((p) => Number(p) || 0);
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      if (parts.length === 2) {
        return parts[0] * 3600 + parts[1] * 60;
      }
    }
    const num = Number(durationVal);
    if (!isNaN(num) && num > 0) {
      return num * 60;
    }
    return 0;
  };

  // Helper: Format seconds into HH:MM:SS
  const formatSecondsToHHMMSS = (totalSeconds: number): string => {
    const isNegative = totalSeconds < 0;
    const absSec = Math.abs(totalSeconds);
    const h = Math.floor(absSec / 3600);
    const m = Math.floor((absSec % 3600) / 60);
    const s = absSec % 60;
    const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return isNegative ? `-${formatted}` : formatted;
  };

  // Load paginated data
  const loadData = useCallback(
    async (page: number, size: number, status: string) => {
      if (empId > 0 || isAdmin) {
        await dispatch(
          fetchTaskListWithPagination({
            empId,
            status,
            pageNumber: page,
            pageSize: size,
          })
        );
      }
    },
    [dispatch, empId, isAdmin]
  );

  // Check on load if user has an active/ongoing tracker task (endTime === null)
  const checkAndResumeActiveTrackerTask = useCallback(async () => {
    const checkEmpId = toSafeInt(
      empId ||
      localStorage.getItem('employerId') ||
      localStorage.getItem('employeeid') ||
      localStorage.getItem('userid'),
      37
    );

    if (!checkEmpId) return;

    try {
      const res = await top10TaskService.getTrackerTask(checkEmpId);
      const trackerTask = Array.isArray(res) ? res[0] : res;

      let savedLocal: any = null;
      try {
        const localStr = localStorage.getItem('active_tracker_timer');
        if (localStr) savedLocal = JSON.parse(localStr);
      } catch (e) {
        // ignore parse error
      }

      const taskId = Number(
        trackerTask?.taskListid ||
        trackerTask?.TaskListid ||
        trackerTask?.taskListId ||
        trackerTask?.tasklistid ||
        savedLocal?.taskId ||
        0
      );

      const isEnded = Boolean(trackerTask?.endTime || trackerTask?.EndTime);

      if (taskId > 0 && !isEnded) {
        let taskItem: Top10TaskListItem | null = null;
        try {
          const taskDetail = await top10TaskService.getTaskById(taskId);
          if (taskDetail) {
            taskItem = taskDetail as any;
          }
        } catch (e) {
          console.warn('Could not fetch task detail on resume:', e);
        }

        if (!taskItem) {
          taskItem = {
            id: taskId,
            task: trackerTask?.activity || savedLocal?.taskName || 'Task',
            project: trackerTask?.projectId,
            subProject: trackerTask?.subProjectId,
            subProjectCategory: trackerTask?.subProjectCategoryId,
          } as any;
        }

        // Determine base task duration before current running session
        let baseSec = 0;
        if (savedLocal && savedLocal.taskId === taskId && typeof savedLocal.baseSec === 'number') {
          baseSec = savedLocal.baseSec;
        } else if (taskItem) {
          baseSec = parseDurationToSeconds(
            taskItem.duration ?? taskItem.Duration ?? taskItem.actualTime ?? 0
          );
        }

        const isPaused = trackerTask?.button === 'pause' || (savedLocal?.taskId === taskId && savedLocal.isPaused);
        setIsTimerPaused(isPaused);

        let sessionStartTime = Date.now();
        let elapsedSeconds = 0;

        if (savedLocal && savedLocal.taskId === taskId && savedLocal.startTime && !savedLocal.isPaused) {
          sessionStartTime = Number(savedLocal.startTime);
          elapsedSeconds = Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000));
        } else if (!isPaused) {
          const startTimeStr = trackerTask?.startTime || trackerTask?.StartTime;
          if (startTimeStr) {
            const startMs = new Date(startTimeStr).getTime();
            if (!isNaN(startMs) && startMs > 0) {
              sessionStartTime = startMs;
              elapsedSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
            }
          }
        }

        let totalSec = baseSec + elapsedSeconds;

        if (isPaused) {
          if (savedLocal && savedLocal.taskId === taskId && typeof savedLocal.pausedTotalSec === 'number') {
            totalSec = savedLocal.pausedTotalSec;
          } else {
            const trackerDurationSec = parseDurationToSeconds(
              trackerTask?.duration || trackerTask?.Duration
            );
            if (trackerDurationSec >= baseSec && trackerDurationSec > 0) {
              totalSec = trackerDurationSec;
            } else {
              totalSec = baseSec + trackerDurationSec;
            }
          }
        }

        activeTaskRef.current = {
          id: taskId,
          baseSec,
          initialSec: totalSec,
          startTime: sessionStartTime,
          item: taskItem,
        };

        localStorage.setItem(
          'active_tracker_timer',
          JSON.stringify({
            taskId,
            taskName: taskItem?.task || taskItem?.subject || 'Task',
            baseSec,
            startTime: sessionStartTime,
            isPaused,
            pausedTotalSec: isPaused ? totalSec : undefined,
          })
        );

        setActiveTimerTaskId(taskId);
        setTimerRunningSeconds(totalSec);

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }

        if (!isPaused) {
          timerIntervalRef.current = setInterval(() => {
            if (activeTaskRef.current) {
              const elapsed = Math.floor(
                (Date.now() - activeTaskRef.current.startTime) / 1000
              );
              setTimerRunningSeconds(activeTaskRef.current.baseSec + elapsed);
            }
          }, 1000);
        }
      } else {
        if (savedLocal) {
          localStorage.removeItem('active_tracker_timer');
        }
        setActiveTimerTaskId(null);
        setIsTimerPaused(false);
      }
    } catch (err) {
      console.warn('Error checking active tracker task on load:', err);
    }
  }, [empId]);

  // Initial load and status filter change
  useEffect(() => {
    loadData(1, pageSize_Local, defaultStatus);
    checkAndResumeActiveTrackerTask();
    if (empId > 0 || isAdmin) {
      dispatch(
        fetchTaskListForUser({
          empId,
          status: defaultStatus,
          isAdmin,
        })
      );
    }
    setIsFirstLoad(false);
  }, [defaultStatus, empId, isAdmin, checkAndResumeActiveTrackerTask]);

  // Reactive load on pagination or size changes (only when not searching)
  useEffect(() => {
    if (isFirstLoad) return;
    if (!searchTerm || !searchTerm.trim()) {
      loadData(pageNumber, pageSize_Local, defaultStatus);
    }
  }, [pageNumber, pageSize_Local, defaultStatus, searchTerm, loadData, isFirstLoad]);

  // Handle server-side query changes from TableContainer
  const handleServerChange = (query: any) => {
    if (query.search !== undefined && query.search !== searchTerm) {
      setSearchTerm(query.search);
      setPageNumber(1);
      return;
    }
    if (query.pageSize !== undefined && query.pageSize !== pageSize_Local) {
      setPageSize_Local(query.pageSize);
      setPageNumber(1);
      return;
    }
    if (query.page !== undefined && query.page !== pageNumber) {
      setPageNumber(query.page);
    }
  };

  // Handle Filter Change ('P' = Pending, 'C' = Completed)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    dispatch(setDefaultStatus(newStatus));
    setPageNumber(1);
    setSearchTerm('');
  };

  // Delete Action Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeleteId) {
      await dispatch(removeTask(selectedDeleteId));
      setDeleteModal(false);
      setSelectedDeleteId(null);
      loadData(pageNumber, pageSize_Local, defaultStatus);
    }
  };

  // Format date helper (MM/DD/YYYY)
  const formatDate = (dateVal?: string | Date) => {
    return formatDateOnly(dateVal);
  };

  // Format Projected Time
  const formatProjectedTime = (element: Top10TaskListItem) => {
    const hh = element.etahh ?? element.ETAHH;
    const mm = element.etamm ?? element.ETAMM;
    if (hh !== undefined && mm !== undefined && hh !== null && mm !== null) {
      return `${hh}:${String(mm).padStart(2, '0')}`;
    }
    const projected = element.projected ?? element.Projected;
    if (projected !== undefined && !isNaN(Number(projected))) {
      const totalMin = Number(projected);
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return `${h}:${String(m).padStart(2, '0')}`;
    }
    return '-';
  };

  // Format Actual Time
  const formatActualTime = (durationVal?: any) => {
    if (durationVal === undefined || durationVal === null) return '00:00';
    if (typeof durationVal === 'string' && durationVal.includes(':')) {
      return durationVal;
    }
    const num = Number(durationVal);
    if (!isNaN(num) && num >= 0) {
      const h = Math.floor(num / 60);
      const m = num % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return String(durationVal);
  };

  // Start in-row timer for a task
  const startTaskTimer = async (row: Top10TaskListItem) => {
    const taskId = Number(row.id || row.ID || 0);
    if (!taskId) return;

    let taskDetail: any = null;
    try {
      taskDetail = await top10TaskService.getTaskById(taskId);
    } catch (err) {
      console.warn('Failed to fetch task details by ID before starting timer:', err);
    }

    const taskItem = taskDetail || row;
    const baseSec = parseDurationToSeconds(
      taskDetail?.duration ?? taskDetail?.actualTime ?? row.duration ?? row.Duration ?? row.actualTime
    );
    const now = Date.now();
    const companyId = toSafeInt(localStorage.getItem('companyid'), 1);
    const branchId = toSafeInt(localStorage.getItem('branchid'), 1);

    const taskName = String(
      row.task ||
      row.Task ||
      taskDetail?.subject ||
      taskDetail?.task ||
      row.subject ||
      row.Subject ||
      row.priority ||
      'Task'
    ).trim();

    activeTaskRef.current = {
      id: taskId,
      baseSec,
      initialSec: baseSec,
      startTime: now,
      item: taskItem,
    };

    localStorage.setItem(
      'active_tracker_timer',
      JSON.stringify({
        taskId,
        taskName,
        baseSec,
        startTime: now,
        isPaused: false,
      })
    );

    setActiveTimerTaskId(taskId);
    setIsTimerPaused(false);
    setTimerRunningSeconds(baseSec);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      if (activeTaskRef.current) {
        const elapsed = Math.floor((Date.now() - activeTaskRef.current.startTime) / 1000);
        setTimerRunningSeconds(activeTaskRef.current.baseSec + elapsed);
      }
    }, 1000);

    // Exact C# UtilizationTrackerModel payload for AddEditTrackerTask (start)
    const trackerPayload: UtilizationTrackerModel = {
      id: 0,
      taskListId: taskId,
      projectId: toSafeInt(taskDetail?.project ?? taskDetail?.projectId ?? row.project ?? row.projectId, 0),
      subProjectId: toSafeInt(taskDetail?.subproject ?? taskDetail?.subProjectId ?? row.subProject ?? row.subProjectId, 0),
      subProjectCategoryId: toSafeInt(taskDetail?.subProjectCategory ?? taskDetail?.subProjectCategoryId ?? row.subProjectCategory ?? row.subProjectCategoryId, 0),
      activity: taskName,
      branchid: branchId,
      button: 'start',
      cloneID: toSafeInt(taskDetail?.cloneID ?? taskDetail?.cloneId, 0),
      companyid: companyId,
      employeeid: empId,
      isAdmin: Boolean(isAdmin),
      activeInvoice: true,
      nonBillable: false,
      duration: formatSecondsToHHMMSS(baseSec),
      watcherAppTitle: '',
    };

    try {
      await top10TaskService.addEditTrackerTask(trackerPayload);
    } catch (err) {
      console.warn('UtilizationTracker/AddEditTrackerTask API call on play:', err);
    }

    toastService.success(`Timer started for ${taskName}`);
  };

  // Pause in-row timer for a task
  const pauseTaskTimer = async (taskId: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    let currentSec = timerRunningSeconds;
    let baseSec = 0;
    let taskItem = activeTaskRef.current?.item;
    if (activeTaskRef.current && activeTaskRef.current.id === taskId) {
      baseSec = activeTaskRef.current.baseSec;
      const elapsed = Math.floor((Date.now() - activeTaskRef.current.startTime) / 1000);
      currentSec = activeTaskRef.current.baseSec + elapsed;
      activeTaskRef.current.initialSec = currentSec;
      taskItem = activeTaskRef.current.item;
    }

    setIsTimerPaused(true);
    setTimerRunningSeconds(currentSec);

    const taskName = String(
      taskItem?.task ||
      taskItem?.subject ||
      'Task'
    ).trim();

    localStorage.setItem(
      'active_tracker_timer',
      JSON.stringify({
        taskId,
        taskName,
        baseSec: currentSec,
        isPaused: true,
        pausedTotalSec: currentSec,
      })
    );

    const companyId = toSafeInt(localStorage.getItem('companyid'), 1);
    const branchId = toSafeInt(localStorage.getItem('branchid'), 1);

    let taskDetail: any = null;
    try {
      taskDetail = await top10TaskService.getTaskById(taskId);
    } catch (e) {
      console.warn('Could not fetch task before pause:', e);
    }

    const trackerPayload: UtilizationTrackerModel = {
      id: 0,
      taskListId: taskId,
      projectId: toSafeInt(taskDetail?.project ?? taskDetail?.projectId ?? taskItem?.project ?? taskItem?.projectId, 0),
      subProjectId: toSafeInt(taskDetail?.subproject ?? taskDetail?.subProjectId ?? taskItem?.subProject ?? taskItem?.subProjectId, 0),
      subProjectCategoryId: toSafeInt(taskDetail?.subProjectCategory ?? taskDetail?.subProjectCategoryId ?? taskItem?.subProjectCategory ?? taskItem?.subProjectCategoryId, 0),
      activity: taskName,
      branchid: branchId,
      button: 'pause',
      cloneID: toSafeInt(taskDetail?.cloneID ?? taskDetail?.cloneId, 0),
      companyid: companyId,
      employeeid: empId,
      isAdmin: Boolean(isAdmin),
      activeInvoice: true,
      nonBillable: false,
      duration: formatSecondsToHHMMSS(currentSec),
      watcherAppTitle: '',
    };

    try {
      await top10TaskService.addEditTrackerTask(trackerPayload);
    } catch (err) {
      console.warn('UtilizationTracker/AddEditTrackerTask API call on pause:', err);
    }

    toastService.success(`Timer paused for ${taskName}`);
  };

  // Resume in-row timer for a task
  const resumeTaskTimer = async (taskId: number, row?: Top10TaskListItem) => {
    const now = Date.now();
    const currentSec = timerRunningSeconds;

    activeTaskRef.current = {
      id: taskId,
      baseSec: currentSec,
      initialSec: currentSec,
      startTime: now,
      item: activeTaskRef.current?.item || row || ({ id: taskId } as any),
    };

    const taskItem = activeTaskRef.current.item;
    const taskName = String(
      taskItem?.task ||
      taskItem?.subject ||
      'Task'
    ).trim();

    localStorage.setItem(
      'active_tracker_timer',
      JSON.stringify({
        taskId,
        taskName,
        baseSec: currentSec,
        startTime: now,
        isPaused: false,
      })
    );

    setIsTimerPaused(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      if (activeTaskRef.current) {
        const elapsed = Math.floor((Date.now() - activeTaskRef.current.startTime) / 1000);
        setTimerRunningSeconds(activeTaskRef.current.baseSec + elapsed);
      }
    }, 1000);

    const companyId = toSafeInt(localStorage.getItem('companyid'), 1);
    const branchId = toSafeInt(localStorage.getItem('branchid'), 1);

    let taskDetail: any = null;
    try {
      taskDetail = await top10TaskService.getTaskById(taskId);
    } catch (e) {
      console.warn('Could not fetch task before resume:', e);
    }

    const trackerPayload: UtilizationTrackerModel = {
      id: 0,
      taskListId: taskId,
      projectId: toSafeInt(taskDetail?.project ?? taskDetail?.projectId ?? taskItem?.project ?? taskItem?.projectId, 0),
      subProjectId: toSafeInt(taskDetail?.subproject ?? taskDetail?.subProjectId ?? taskItem?.subProject ?? taskItem?.subProjectId, 0),
      subProjectCategoryId: toSafeInt(taskDetail?.subProjectCategory ?? taskDetail?.subProjectCategoryId ?? taskItem?.subProjectCategory ?? taskItem?.subProjectCategoryId, 0),
      activity: taskName,
      branchid: branchId,
      button: 'resume',
      cloneID: toSafeInt(taskDetail?.cloneID ?? taskDetail?.cloneId, 0),
      companyid: companyId,
      employeeid: empId,
      isAdmin: Boolean(isAdmin),
      activeInvoice: true,
      nonBillable: false,
      duration: formatSecondsToHHMMSS(currentSec),
      watcherAppTitle: '',
    };

    try {
      await top10TaskService.addEditTrackerTask(trackerPayload);
    } catch (err) {
      console.warn('UtilizationTracker/AddEditTrackerTask API call on resume:', err);
    }

    toastService.success(`Timer resumed for ${taskName}`);
  };

  // Stop in-row timer for a task and save duration to backend
  const stopTaskTimer = async (taskId: number, showNotification: boolean = true) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    let finalSeconds = timerRunningSeconds;
    let taskItem = activeTaskRef.current?.item;
    if (activeTaskRef.current && activeTaskRef.current.id === taskId) {
      if (!isTimerPaused) {
        const elapsed = Math.floor((Date.now() - activeTaskRef.current.startTime) / 1000);
        finalSeconds = activeTaskRef.current.baseSec + elapsed;
      } else {
        finalSeconds = activeTaskRef.current.initialSec;
      }
      taskItem = activeTaskRef.current.item;
    }

    setActiveTimerTaskId(null);
    setIsTimerPaused(false);
    activeTaskRef.current = null;
    localStorage.removeItem('active_tracker_timer');

    const durationInMinutes = Math.max(0, Math.round(finalSeconds / 60));
    const companyId = toSafeInt(localStorage.getItem('companyid'), 1);
    const branchId = toSafeInt(localStorage.getItem('branchid'), 1);

    try {
      let taskDetail: any = null;
      try {
        taskDetail = await top10TaskService.getTaskById(taskId);
      } catch (e) {
        console.warn('Could not fetch task before stop:', e);
      }

      const assignedEmpId = toSafeInt(
        taskDetail?.accountablePerson ||
        taskDetail?.employeeid ||
        taskItem?.accountablePerson ||
        taskItem?.secondPerson ||
        taskItem?.pointPerson ||
        empId ||
        localStorage.getItem('employerId')
      );

      const taskName = String(
        taskItem?.task ||
        taskDetail?.subject ||
        taskDetail?.task ||
        taskItem?.subject ||
        taskItem?.priority ||
        'Task'
      ).trim();

      if (taskDetail) {
        const updatedModel: Top10TaskModel = {
          ...taskDetail,
          duration: durationInMinutes,
          actualTime: durationInMinutes,
          completed:
            taskDetail.completed === 'Not Started'
              ? 'In Process'
              : (taskDetail.completed || 'In Process'),
        };

        await top10TaskService.addOrEditTaskList(updatedModel);
      }

      // Exact C# UtilizationTrackerModel payload for AddEditTrackerTask (stop)
      const trackerPayload: UtilizationTrackerModel = {
        id: 1,
        taskListId: taskId,
        projectId: toSafeInt(taskDetail?.project ?? taskDetail?.projectId ?? taskItem?.project ?? taskItem?.projectId, 0),
        subProjectId: toSafeInt(taskDetail?.subproject ?? taskDetail?.subProjectId ?? taskItem?.subProject ?? taskItem?.subProjectId, 0),
        subProjectCategoryId: toSafeInt(taskDetail?.subProjectCategory ?? taskDetail?.subProjectCategoryId ?? taskItem?.subProjectCategory ?? taskItem?.subProjectCategoryId, 0),
        activity: taskName,
        branchid: branchId,
        button: 'stop',
        cloneID: toSafeInt(taskDetail?.cloneID ?? taskDetail?.cloneId, 0),
        companyid: companyId,
        employeeid: empId || assignedEmpId,
        isAdmin: Boolean(isAdmin),
        activeInvoice: true,
        nonBillable: false,
        duration: formatSecondsToHHMMSS(finalSeconds),
        watcherAppTitle: '',
      };

      await top10TaskService.addEditTrackerTask(trackerPayload).catch(console.warn);

      if (showNotification) {
        toastService.success(`Timer stopped for ${taskName}. Total duration: ${formatSecondsToHHMMSS(finalSeconds)}`);
      }

      loadData(pageNumber, pageSize_Local, defaultStatus);
    } catch (err: any) {
      console.error('Failed to save task timer duration:', err);
      toastService.error('Failed to save task duration.');
    }
  };

  // Button Action Handlers
  const handleStartTimer = async (row: Top10TaskListItem) => {
    const taskId = Number(row.id || row.ID || 0);
    if (!taskId) return;

    setTimerLoadingTaskId(taskId);
    try {
      // If another task is currently running or paused -> stop it first
      if (activeTimerTaskId && activeTimerTaskId !== taskId) {
        await stopTaskTimer(activeTimerTaskId, false);
      }
      await startTaskTimer(row);
    } finally {
      setTimerLoadingTaskId(null);
    }
  };

  const handlePauseTimer = async (taskId: number) => {
    setTimerLoadingTaskId(taskId);
    try {
      await pauseTaskTimer(taskId);
    } finally {
      setTimerLoadingTaskId(null);
    }
  };

  const handleResumeTimer = async (taskId: number, row?: Top10TaskListItem) => {
    setTimerLoadingTaskId(taskId);
    try {
      await resumeTaskTimer(taskId, row);
    } finally {
      setTimerLoadingTaskId(null);
    }
  };

  const handleStopTimer = async (taskId: number) => {
    setTimerLoadingTaskId(taskId);
    try {
      await stopTaskTimer(taskId, true);
    } finally {
      setTimerLoadingTaskId(null);
    }
  };

  // Clean up interval timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Column definitions using @tanstack/react-table ColumnDef matching VirtualClinic-React
  const columns = useMemo<ColumnDef<Top10TaskListItem, any>[]>(() => {
    const cols: ColumnDef<Top10TaskListItem, any>[] = [
      {
        header: 'Assigned By',
        accessorKey: 'pointPerson',
        enableSorting: true,
        cell: (info) => {
          const row = info.row.original;
          return row.pointPerson || row.PointPerson || row.accountablePerson || row.AccountablePerson || '-';
        },
      },
    ];

    if (sessionType === 1) {
      cols.push({
        header: 'Assigned To',
        accessorKey: 'secondPerson',
        enableSorting: true,
        cell: (info) => {
          const row = info.row.original;
          return row.secondPerson || row.SecondPerson || row.accountablePerson || row.AccountablePerson || '-';
        },
      });
    }

    cols.push(
      {
        header: 'Assigned Date',
        accessorKey: 'assignDate',
        enableSorting: true,
        cell: (info) => formatDate(info.row.original.assignDate || info.row.original.AssignDate),
      },
      {
        header: 'Due Date',
        accessorKey: 'eta',
        enableSorting: true,
        cell: (info) => formatDate(info.row.original.eta || info.row.original.ETA),
      },
      {
        header: 'Project',
        accessorKey: 'project',
        enableSorting: true,
        cell: (info) => info.row.original.project || info.row.original.Project || '-',
      },
      {
        header: 'SubProject',
        accessorKey: 'subProject',
        enableSorting: true,
        cell: (info) => info.row.original.subProject || info.row.original.SubProject || '-',
      },
      {
        header: 'Task',
        accessorKey: 'task',
        enableSorting: true,
        cell: (info) => {
          const row = info.row.original;
          const taskText = row.task || row.Task || row.priority || row.Priority || '-';
          return (
            <span style={{ fontWeight: 500 }}>
              {taskText}
            </span>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'completed',
        enableSorting: true,
        cell: (info) => {
          const row = info.row.original;
          const id = Number(row.id || row.ID || 0);
          const isTimerActive = activeTimerTaskId === id;
          const status = isTimerActive && (!row.completed || row.completed === 'Not Started')
            ? 'In Process'
            : (row.completed || row.Completed || 'Not Started');
          const isDone = status === 'Done' || status === 'Completed';
          const isInProcess = status === 'In Process' || status === 'In Progress' || isTimerActive;

          return isDone ? (
            <span className="badge-status-done">{status}</span>
          ) : isInProcess ? (
            <span className="badge-status-in-process">{status}</span>
          ) : (
            <span className="badge-status-not-started">{status}</span>
          );
        },
      },
      {
        header: 'Projected',
        accessorKey: 'projected',
        enableSorting: true,
        cell: (info) => formatProjectedTime(info.row.original),
      },
      {
        header: 'Actual',
        accessorKey: 'duration',
        enableSorting: true,
        cell: (info) => {
          const row = info.row.original;
          const id = Number(row.id || row.ID || 0);
          const isTimerActive = activeTimerTaskId === id;

          if (isTimerActive) {
            const projectedH = Number(row.etahh ?? row.ETAHH ?? 0);
            const projectedM = Number(row.etamm ?? row.ETAMM ?? 0);
            const rawProjected = Number(row.projected ?? row.Projected ?? 0);
            const totalProjectedMinutes = (projectedH * 60 + projectedM) || rawProjected;
            const totalProjectedSeconds = totalProjectedMinutes * 60;
            const remainingSeconds = totalProjectedSeconds - timerRunningSeconds;

            return (
              <div className="timer-live-cell">
                <div className="d-flex align-items-center gap-1">
                  <span
                    className={`timer-pulse-dot ${isTimerPaused ? 'paused' : ''}`}
                    title={isTimerPaused ? 'Timer Paused' : 'Timer Running'}
                  ></span>
                  <span className={`timer-running-text ${isTimerPaused ? 'paused' : ''}`}>
                    {formatSecondsToHHMMSS(timerRunningSeconds)}
                  </span>
                  {isTimerPaused && (
                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle py-0 px-1 font-size-10">
                      Paused
                    </span>
                  )}
                </div>
                {totalProjectedMinutes > 0 && (
                  <span
                    className={`timer-countdown-badge ${remainingSeconds >= 0 ? 'remaining-positive' : 'remaining-negative'
                      }`}
                    title={remainingSeconds >= 0 ? 'Remaining Projected Time' : 'Overdue Time'}
                  >
                    <i className={`mdi ${remainingSeconds >= 0 ? 'mdi-timer-sand' : 'mdi-alert-circle-outline'} font-size-11`}></i>
                    {remainingSeconds >= 0
                      ? `-${formatSecondsToHHMMSS(remainingSeconds)}`
                      : `+${formatSecondsToHHMMSS(Math.abs(remainingSeconds))}`}
                  </span>
                )}
              </div>
            );
          }

          return formatActualTime(row.duration || row.Duration);
        },
      },
      {
        header: 'Action',
        accessorKey: 'id',
        enableSorting: false,
        cell: (info) => {
          const row = info.row.original;
          const id = Number(row.id || row.ID || 0);
          const completed = row.completed || row.Completed || 'Not Started';
          const isDone = completed === 'Done' || completed === 'Completed';
          const isActiveTimer = activeTimerTaskId === id;
          const isTimerLoading = timerLoadingTaskId === id;

          return (
            <div className="d-flex align-items-center">
              {/* Edit button */}
              {!isDone && !isHideEdit && (
                <Link
                  to={`/area/top10task/edit/${id}`}
                  className="task-action-icon me-2"
                  title="Edit"
                >
                  <i className="mdi mdi-pencil-outline"></i>
                </Link>
              )}

              {/* In-Row Timer Controls: Play/Pause/Resume + Stop */}
              {!isDone && (
                isTimerLoading ? (
                  <button
                    type="button"
                    disabled={true}
                    className="task-action-icon me-2"
                    title="Updating Timer..."
                    style={{ cursor: 'wait' }}
                  >
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      style={{ width: '15px', height: '15px', borderWidth: '2px' }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </button>
                ) : isActiveTimer ? (
                  <div className="d-inline-flex align-items-center">
                    {/* Pause / Resume Button */}
                    {/* {!isTimerPaused ? (
                      <button
                        type="button"
                        disabled={timerLoadingTaskId !== null}
                        onClick={() => handlePauseTimer(id)}
                        className="task-action-icon me-2 text-warning"
                        title="Pause Timer"
                      >
                        <i className="mdi mdi-pause-circle font-size-18"></i>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={timerLoadingTaskId !== null}
                        onClick={() => handleResumeTimer(id, row)}
                        className="task-action-icon me-2 text-success"
                        title="Resume Timer"
                      >
                        <i className="mdi mdi-play-circle-outline font-size-18"></i>
                      </button>
                    )} */}

                    {/* Stop Button */}
                    <button
                      type="button"
                      disabled={timerLoadingTaskId !== null}
                      onClick={() => handleStopTimer(id)}
                      className="task-action-icon me-2 text-danger"
                      title="Stop Timer"
                    >
                      <i className="mdi mdi-stop-circle font-size-18"></i>
                    </button>
                  </div>
                ) : (
                  /* Start Timer Button */
                  <button
                    type="button"
                    disabled={timerLoadingTaskId !== null}
                    onClick={() => handleStartTimer(row)}
                    className="task-action-icon me-2 text-primary"
                    title="Start Timer"
                  >
                    <i className="mdi mdi-play-circle-outline font-size-18"></i>
                  </button>
                )
              )}

              {/* Clone button */}
              {isDone && (
                <Link
                  to={`/area/top10task/edit/${id}Clone`}
                  className="task-action-icon me-2"
                  title="Clone"
                >
                  <i className="mdi mdi-content-copy"></i>
                </Link>
              )}

              {/* Delete button */}
              {!isHideDelete && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(id)}
                  className="task-action-icon delete-icon"
                  title="Delete"
                >
                  <i className="mdi mdi-trash-can-outline"></i>
                </button>
              )}
            </div>
          );
        },
      }
    );

    return cols;
  }, [sessionType, isHideDelete, isHideEdit, activeTimerTaskId, isTimerPaused, timerRunningSeconds, timerLoadingTaskId]);

  const isSearching = Boolean(searchTerm && searchTerm.trim());

  // Full dataset for client-side search across all fields
  const fullDataset = useMemo(() => {
    if (allTasks && allTasks.length > 0) {
      return allTasks;
    }
    return list || [];
  }, [allTasks, list]);

  // Filtered tasks across all fields when searching
  const filteredTasks = useMemo(() => {
    if (!isSearching) return [];

    const term = searchTerm.toLowerCase().trim();

    return fullDataset.filter((item: Top10TaskListItem) => {
      const assignedBy = String(
        item.pointPerson ||
        item.PointPerson ||
        item.accountablePerson ||
        item.AccountablePerson ||
        ''
      ).toLowerCase();
      const assignedTo = String(
        item.secondPerson ||
        item.SecondPerson ||
        item.accountablePerson ||
        item.AccountablePerson ||
        ''
      ).toLowerCase();
      const task = String(
        item.task ||
        item.Task ||
        item.subject ||
        item.Subject ||
        item.priority ||
        item.Priority ||
        ''
      ).toLowerCase();
      const project = String(
        item.project ||
        item.Project ||
        item.projectName ||
        item.ProjectName ||
        ''
      ).toLowerCase();
      const subProject = String(
        item.subProject ||
        item.SubProject ||
        item.subProjectName ||
        item.SubProjectName ||
        ''
      ).toLowerCase();
      const category = String(
        item.subProjectCategory ||
        item.SubProjectCategory ||
        item.categoryName ||
        item.CategoryName ||
        ''
      ).toLowerCase();
      const status = String(
        item.completed || item.Completed || ''
      ).toLowerCase();
      const assignDate = formatDateOnly(
        item.assignDate || item.AssignDate
      ).toLowerCase();
      const etaDate = formatDateOnly(item.eta || item.ETA).toLowerCase();
      const id = String(item.id || item.ID || '');

      return (
        task.includes(term) ||
        project.includes(term) ||
        subProject.includes(term) ||
        category.includes(term) ||
        assignedBy.includes(term) ||
        assignedTo.includes(term) ||
        status.includes(term) ||
        assignDate.includes(term) ||
        etaDate.includes(term) ||
        id.includes(term)
      );
    });
  }, [isSearching, searchTerm, fullDataset]);

  // Active display data: locally paginated if searching, otherwise server-paginated list
  const displayData = useMemo(() => {
    if (isSearching) {
      const startIndex = (pageNumber - 1) * pageSize_Local;
      return filteredTasks.slice(startIndex, startIndex + pageSize_Local);
    }
    return list || [];
  }, [isSearching, filteredTasks, pageNumber, pageSize_Local, list]);

  const displayTotalRecords = isSearching
    ? filteredTasks.length
    : totalRecords || 0;

  const displayTotalPages = isSearching
    ? Math.ceil(filteredTasks.length / pageSize_Local) || 1
    : totalPages || 1;

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <TableContainer
          columns={columns}
          data={displayData}
          isGlobalFilter={true}
          searchPlaceholder="Search..."
          isAddButton={true}
          buttonName="+ Add New"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/top10task/create')}
          customCenterHeader={
            <div className="projected-hours-red-badge" title="Today's Total Projected Hours">
              <i className="mdi mdi-clock-fast"></i>
              <span>Today&apos;s Projected Hours: {totalProjectedHours || '0h 0m'}</span>
            </div>
          }
          customRightHeader={
            <div className="task-filter-wrapper">
              <label htmlFor="taskStatusFilterSelect">Filter:</label>
              <select
                id="taskStatusFilterSelect"
                className="task-filter-select"
                value={defaultStatus}
                onChange={handleFilterChange}
              >
                <option value="P">Pending Task</option>
                <option value="C">Completed Task</option>
              </select>
            </div>
          }
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No tasks found."
          isServerSidePagination={true}
          onServerChange={handleServerChange}
          serverSideTotalRecords={displayTotalRecords}
          serverSideCurrentPage={pageNumber}
          serverSidePageSize={pageSize_Local}
          serverSideTotalPages={displayTotalPages}
          serverSideSearchTerm={searchTerm}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleConfirmDelete}
          onCloseClick={() => setDeleteModal(false)}
          loading={saving}
        />
      </div>
    </React.Fragment>
  );
};

export default Top10TaskList;

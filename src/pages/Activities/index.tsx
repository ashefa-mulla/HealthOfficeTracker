import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from 'reactstrap';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import { TaskActivityItem } from '@/types/activity/activity.types';
import {
  TrackerProjectItem,
  TrackerSubProjectItem,
  TrackerSubProjectCategoryItem,
} from '@/types/top10task/top10task.types';
import { fetchActivityListWithPagination } from '@/slices/activity/activityThunk';
import {
  setSearchTerm,
  setDateRange,
} from '@/slices/activity/activitySlice';
import taskActivityService from '@/services/taskActivityService';
import top10TaskService from '@/services/top10taskService';
import toastService from '@/services/toastService';
import { useAuthStore } from '@/store/useAuthStore';
import { getNumericEmployeeId } from '@/helpers/userHelper';
import {
  formatDateOnly,
  formatDateTimeDisplay,
  parseSafeDate,
  formatLocalDateToIso,
} from '@/helpers/dateHelper';
import ActivityEditModal from './ActivityEditModal';
import {
  ActivityEditForm,
  emptyActivityEditForm,
} from '@/types/activity/activity.schema';

// Helper: Get start and end date of the current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const pad = (n: number) => String(n).padStart(2, '0');
  const startStr = `${year}-${pad(month + 1)}-01`;
  const lastDay = new Date(year, month + 1, 0);
  const endStr = `${year}-${pad(month + 1)}-${pad(lastDay.getDate())}`;

  return {
    start: startStr,
    end: endStr,
    startObj: new Date(year, month, 1),
    endObj: lastDay,
  };
};

// Helper: Format Time string into HH:MM AM/PM
const formatTimeDisplay = (timeStr: string) => {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (trimmed.toUpperCase().includes('AM') || trimmed.toUpperCase().includes('PM')) {
    return trimmed;
  }
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    let h = Number(match[1]);
    const m = match[2];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }
  return trimmed;
};

// Helper: Format Start Date + Time (MM/DD/YYYY hh:mm AM/PM)
const formatStartDateTime = (item: TaskActivityItem) => {
  const rawDate = item.oExecDate;
  const rawTime = item.starttime;

  if (!rawTime && !rawDate) return '-';

  if (rawTime && (rawTime.includes('/') || rawTime.includes('-') || rawTime.includes('T'))) {
    const formatted = formatDateTimeDisplay(rawTime);
    if (formatted) return formatted;
  }

  const datePart = rawDate ? formatDateOnly(rawDate) : '';
  const timePart = rawTime ? formatTimeDisplay(rawTime) : '';

  if (datePart && timePart) return `${datePart} ${timePart}`;
  return datePart || timePart || '-';
};

// Helper: Format End Date + Time (MM/DD/YYYY hh:mm AM/PM)
const formatEndDateTime = (item: TaskActivityItem) => {
  const rawDate = item.oOutDate || item.oExecDate;
  const rawTime = item.endtime;

  if (!rawTime && !rawDate) return '-';

  if (rawTime && (rawTime.includes('/') || rawTime.includes('-') || rawTime.includes('T'))) {
    const formatted = formatDateTimeDisplay(rawTime);
    if (formatted) return formatted;
  }

  const datePart = rawDate ? formatDateOnly(rawDate) : '';
  const timePart = rawTime ? formatTimeDisplay(rawTime) : '';

  if (datePart && timePart) return `${datePart} ${timePart}`;
  return datePart || timePart || '-';
};

// Helper: Format Duration (HH:MM)
const formatDuration = (item: TaskActivityItem) => {
  const dur = item.duration;
  const sec = item.secondvalue;

  if (dur && typeof dur === 'string' && dur.includes(':')) {
    const parts = dur.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
  }

  if (sec !== undefined && sec !== null && !isNaN(Number(sec))) {
    const totalSec = Number(sec);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  return dur || '00:00';
};

// Helper: Format Updated Date (MM/DD/YYYY hh:mm AM/PM)
const formatUpdatedDateTime = (item: TaskActivityItem) => {
  const rawVal = item.updated_date;
  if (!rawVal) return '-';
  const formatted = formatDateTimeDisplay(rawVal);
  return formatted || formatDateOnly(rawVal) || '-';
};

// Helper: Calculate duration string (HH:MM:SS) and validation from two dates
const computeDurationFromDates = (
  start: Date | null,
  end: Date | null
): { durationStr: string; isValid: boolean } => {
  if (!start || !end) return { durationStr: '00:00:00', isValid: true };
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) {
    return { durationStr: '00:00:00', isValid: false };
  }
  const totalSec = Math.floor(diffMs / 1000);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);
  return {
    durationStr: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    isValid: true,
  };
};


const TaskActivityList: React.FC = () => {
  document.title = 'My Activities | HO Tracker';

  const dispatch = useDispatch<any>();
  const { user, profileInfo } = useAuthStore();
  const empId = getNumericEmployeeId(profileInfo, user);

  const sessionRole =
    localStorage.getItem('sessionrole') ||
    profileInfo?.userRole ||
    (profileInfo?.utype === 1 || profileInfo?.utype === 4 ? 'Admin' : '');
  const isAdmin =
    sessionRole === 'Admin' ||
    profileInfo?.utype === 1 ||
    profileInfo?.utype === 4 ||
    empId === 78;
  const showAdminField = isAdmin;

  const userType = Number(
    profileInfo?.utype ?? profileInfo?.usertype ?? profileInfo?.userType ?? 3
  );

  // Current month default date range
  const defaultMonthRange = useMemo(() => getCurrentMonthRange(), []);

  // Redux state
  const {
    list,
    loading,
    totalRecords,
    totalPages,
    searchTerm: reduxSearchTerm,
    startDate: reduxStartDate,
    endDate: reduxEndDate,
  } = useSelector((state: RootState) => (state as any).Activity);

  // Local filter states
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize_Local, setPageSize_Local] = useState(10);
  const [search, setSearch] = useState(reduxSearchTerm || '');
  const [searchUser, setSearchUser] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [startDate, setStartDate] = useState(reduxStartDate || defaultMonthRange.start);
  const [endDate, setEndDate] = useState(reduxEndDate || defaultMonthRange.end);
  const [datePickerValue, setDatePickerValue] = useState<Date[]>([
    defaultMonthRange.startObj,
    defaultMonthRange.endObj,
  ]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Edit Modal States matching Angular dw_form2
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [formData, setFormData] = useState<ActivityEditForm>(emptyActivityEditForm(empId));

  // Dropdown options in Modal
  const [projectList, setProjectList] = useState<TrackerProjectItem[]>([]);
  const [subprojectList, setSubprojectList] = useState<TrackerSubProjectItem[]>([]);
  const [subprojectCategoryList, setSubprojectCategoryList] = useState<TrackerSubProjectCategoryItem[]>([]);
  const [employeeList, setEmployeeList] = useState<any[]>([]);

  // Fetch paginated activity log data from API
  const loadData = useCallback(
    async (page: number, size: number, term: string, start?: string, end?: string) => {
      await dispatch(
        fetchActivityListWithPagination({
          Employeeid: empId > 0 ? empId : null,
          utype: userType,
          pageNumber: page,
          pageSize: size,
          search: term && term.trim() ? term.trim() : null,
          start: start && start.trim() ? start.trim() : null,
          end: end && end.trim() ? end.trim() : null,
        })
      );
    },
    [dispatch, empId, userType]
  );

  // Initial load passing current month
  useEffect(() => {
    const initialStart = startDate || defaultMonthRange.start;
    const initialEnd = endDate || defaultMonthRange.end;
    loadData(1, pageSize_Local, search, initialStart, initialEnd);
    setIsFirstLoad(false);
  }, [loadData, defaultMonthRange]);

  // Reactive reload when page or page size changes
  useEffect(() => {
    if (isFirstLoad) return;
    loadData(pageNumber, pageSize_Local, search, startDate, endDate);
  }, [pageNumber, pageSize_Local]);

  // Handle server-side query change from TableContainer (page or pageSize)
  const handleServerChange = (query: any) => {
    if (query.pageSize !== undefined && query.pageSize !== pageSize_Local) {
      setPageSize_Local(query.pageSize);
      setPageNumber(1);
      loadData(1, query.pageSize, search, startDate, endDate);
      return;
    }
    if (query.page !== undefined && query.page !== pageNumber) {
      setPageNumber(query.page);
    }
  };

  // Handle Search Input Change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    dispatch(setSearchTerm(val));
    setPageNumber(1);
    loadData(1, pageSize_Local, val, startDate, endDate);
  };

  // Handle Date Range Change from Flatpickr
  const handleDateRangeChange = (selectedDates: Date[]) => {
    setDatePickerValue(selectedDates);
    if (selectedDates.length === 2) {
      const [startObj, endObj] = selectedDates;
      const pad = (n: number) => String(n).padStart(2, '0');
      const startStr = `${startObj.getFullYear()}-${pad(startObj.getMonth() + 1)}-${pad(startObj.getDate())}`;
      const endStr = `${endObj.getFullYear()}-${pad(endObj.getMonth() + 1)}-${pad(endObj.getDate())}`;

      setStartDate(startStr);
      setEndDate(endStr);
      dispatch(setDateRange({ startDate: startStr, endDate: endStr }));
      setPageNumber(1);
      loadData(1, pageSize_Local, search, startStr, endStr);
    } else if (selectedDates.length === 0) {
      setStartDate('');
      setEndDate('');
      dispatch(setDateRange({ startDate: '', endDate: '' }));
      setPageNumber(1);
      loadData(1, pageSize_Local, search, '', '');
    }
  };

  // Handle Clear Filter (Pill button)
  const handleClearFilters = () => {
    const monthRange = getCurrentMonthRange();
    setSearch('');
    setSearchUser('');
    setSearchClient('');
    setStartDate(monthRange.start);
    setEndDate(monthRange.end);
    setDatePickerValue([monthRange.startObj, monthRange.endObj]);
    dispatch(setSearchTerm(''));
    dispatch(setDateRange({ startDate: monthRange.start, endDate: monthRange.end }));
    setPageNumber(1);
    loadData(1, pageSize_Local, '', monthRange.start, monthRange.end);
  };

  // Handle Print / View Active Log Report PDF from Backend Reports Controller
  const handlePrintReport = async () => {
    try {
      setIsPrinting(true);
      const currentMonth = getCurrentMonthRange();
      const sDate = startDate || currentMonth.start;
      const eDate = endDate || currentMonth.end;

      const blob = await taskActivityService.downloadActiveLogReport({
        stdt: sDate,
        enddt: eDate,
        empid: empId > 0 ? empId : 0,
        uid: userType || 3,
      });

      if (!blob || blob.size === 0) {
        toastService.error('Activity log records not found');
        return;
      }

      // If backend returned JSON error inside blob
      if (blob.type === 'application/json') {
        const text = await blob.text();
        try {
          const errObj = JSON.parse(text);
          toastService.error(errObj.message || errObj || 'Activity log records not found');
        } catch {
          toastService.error(text || 'Activity log records not found');
        }
        return;
      }

      const fileUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const newWindow = window.open(fileUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = `ActivityLog_${sDate}_to_${eDate}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err: any) {
      console.error('Failed to open activity log report:', err);
      toastService.error(err?.message || 'Activity log records not found or failed to load.');
    } finally {
      setIsPrinting(false);
    }
  };

  // Open Edit Modal matching Angular openModal
  const handleOpenEditModal = async (id: number) => {
    setIsEditModalOpen(true);
    setIsLoadingModal(true);
    setFormError('');

    const companyId = Number(localStorage.getItem('companyid')) || 1;
    const branchId = Number(localStorage.getItem('branchid')) || 1;

    try {
      // Load projects and employees concurrently
      const [projects, employees] = await Promise.all([
        top10TaskService.getTrackerProject(companyId, branchId).catch(() => []),
        isAdmin ? taskActivityService.getEmployeeList(companyId).catch(() => []) : Promise.resolve([]),
      ]);
      setProjectList(projects || []);
      setEmployeeList(employees || []);

      if (id > 0) {
        // Fetch activity details for edit
        const res = await taskActivityService.getEditTrackerTaskById(id);
        if (res) {
          const sDate = parseSafeDate(res.startTime || res.StartTime) || new Date();
          const eDate = parseSafeDate(res.endTime || res.EndTime) || new Date();
          const { durationStr } = computeDurationFromDates(sDate, eDate);

          const pId = Number(res.projectId ?? res.ProjectId ?? 0);
          const subPId = Number(res.subProjectId ?? res.SubProjectId ?? 0);
          const catId = Number(res.subProjectCategoryId ?? res.SubProjectCategoryId ?? 0);

          let subprojects: TrackerSubProjectItem[] = [];
          let categories: TrackerSubProjectCategoryItem[] = [];

          if (pId > 0) {
            subprojects = await top10TaskService.getTrackerSubProject(pId).catch(() => []);
            if (subPId > 0) {
              categories = await top10TaskService
                .getTrackerSubProjectCategory(pId, subPId)
                .catch(() => []);
            }
          }

          setSubprojectList(subprojects || []);
          setSubprojectCategoryList(categories || []);

          setFormData({
            id: Number(res.id ?? id),
            branchid: Number(res.branchid ?? branchId),
            companyid: Number(res.companyid ?? companyId),
            employeeid: Number(res.employeeid ?? empId),
            taskListid: Number(res.taskListid ?? 0),
            projectId: pId,
            subProjectId: subPId,
            subProjectCategoryId: catId,
            activity: String(res.activity ?? res.Activity ?? ''),
            startTime: sDate.toISOString(),
            endTime: eDate.toISOString(),
            startTimeDisplay: formatDateTimeDisplay(sDate) || '-',
            endTimeDisplay: formatDateTimeDisplay(eDate) || '-',
            duration: res.duration || durationStr,
            activeInvoice: res.activeInvoice !== undefined ? Boolean(res.activeInvoice) : true,
            isAdmin: res.isAdmin !== undefined ? Boolean(res.isAdmin) : true,
            updatedBy: Number(res.updatedBy ?? empId),
            ActivityUpdatedby: Number(res.ActivityUpdatedby ?? empId),
          });
        }
      } else {
        const now = new Date();
        setFormData({
          id: 0,
          branchid: branchId,
          companyid: companyId,
          employeeid: empId,
          taskListid: 0,
          projectId: 0,
          subProjectId: 0,
          subProjectCategoryId: 0,
          activity: '',
          startTime: now.toISOString(),
          endTime: now.toISOString(),
          startTimeDisplay: formatDateTimeDisplay(now) || '-',
          endTimeDisplay: formatDateTimeDisplay(now) || '-',
          duration: '00:00:00',
          activeInvoice: true,
          isAdmin: true,
          updatedBy: empId,
          ActivityUpdatedby: empId,
        });
        setSubprojectList([]);
        setSubprojectCategoryList([]);
      }
    } catch (err: any) {
      console.error('Error opening edit activity modal:', err);
      toastService.error('Failed to load activity details.');
    } finally {
      setIsLoadingModal(false);
    }
  };

  // Close Modal
  const toggleEditModal = () => {
    if (!isSubmittingModal) {
      setIsEditModalOpen(false);
    }
  };

  // Handle Client (Project) dropdown change in modal
  const handleProjectChange = async (projectId: number) => {
    setSubprojectList([]);
    setSubprojectCategoryList([]);

    if (projectId > 0) {
      try {
        const subs = await top10TaskService.getTrackerSubProject(projectId);
        setSubprojectList(subs || []);
      } catch (err) {
        console.warn('Failed to load subprojects:', err);
      }
    }
  };

  // Handle Project (SubProject) dropdown change in modal
  const handleSubProjectChange = async (subProjectId: number) => {
    setSubprojectCategoryList([]);

    if (subProjectId > 0) {
      try {
        const cats = await top10TaskService.getTrackerSubProjectCategory(
          Number(formData.projectId || 0),
          subProjectId
        );
        setSubprojectCategoryList(cats || []);
      } catch (err) {
        console.warn('Failed to load subproject categories:', err);
      }
    }
  };

  // Handle Form Submit in modal matching Angular onSubmitActivity / onEditMyActivites
  const handleSubmitEdit = async (formValues: ActivityEditForm) => {
    setIsSubmittingModal(true);
    setFormError('');
    try {
      const nowIso = new Date().toISOString();
      const payload = {
        id: formValues.id,
        branchid: formValues.branchid,
        companyid: formValues.companyid,
        employeeid: formValues.employeeid || empId,
        taskListid: formValues.taskListid || 0,
        projectId: Number(formValues.projectId),
        subProjectId: Number(formValues.subProjectId),
        subProjectCategoryId: Number(formValues.subProjectCategoryId || 0),
        activity: formValues.activity.trim(),
        startTime: formValues.startTime || nowIso,
        endTime: formValues.endTime || nowIso,
        updateddate: nowIso,
        duration: formValues.duration || '00:00:00',
        activeInvoice: Boolean(formValues.activeInvoice),
        isAdmin: Boolean(formValues.isAdmin),
        updatedBy: empId,
        ActivityUpdateddate: nowIso,
        ActivityUpdatedby: empId,
      };

      await taskActivityService.editTrackerTask(payload);
      toastService.success('Record is updated');
      setIsEditModalOpen(false);
      loadData(pageNumber, pageSize_Local, search, startDate, endDate);
    } catch (err: any) {
      console.error('Failed to update activity:', err);
      toastService.error(err?.message || 'Failed to update activity.');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  // Filter list locally for User and Client inputs if specified
  const filteredData = useMemo(() => {
    let result = list || [];
    if (searchUser && searchUser.trim()) {
      const uTerm = searchUser.toLowerCase().trim();
      result = result.filter((item: TaskActivityItem) =>
        String(item.fullname || '').toLowerCase().includes(uTerm)
      );
    }
    if (searchClient && searchClient.trim()) {
      const cTerm = searchClient.toLowerCase().trim();
      result = result.filter((item: TaskActivityItem) =>
        String(item.project || '').toLowerCase().includes(cTerm)
      );
    }
    return result;
  }, [list, searchUser, searchClient]);

  // Exact Table Columns matching screenshot & Angular specification
  const columns = useMemo<ColumnDef<TaskActivityItem, any>[]>(() => {
    const cols: ColumnDef<TaskActivityItem, any>[] = [];

    if (showAdminField) {
      cols.push({
        header: 'Name',
        accessorKey: 'fullname',
        enableSorting: true,
        cell: (info) => (
          <span className="text-dark fw-medium">{info.row.original.fullname || '-'}</span>
        ),
      });
    }

    cols.push(
      {
        header: 'Start Time',
        accessorKey: 'Starttime',
        enableSorting: true,
        cell: (info) => (
          <span className="text-dark">{formatStartDateTime(info.row.original)}</span>
        ),
      },
      {
        header: 'End Time',
        accessorKey: 'Endtime',
        enableSorting: true,
        cell: (info) => (
          <span className="text-dark">{formatEndDateTime(info.row.original)}</span>
        ),
      },
      {
        header: 'Duration',
        accessorKey: 'DURATION',
        enableSorting: true,
        cell: (info) => (
          <span className="text-dark fw-medium">{formatDuration(info.row.original)}</span>
        ),
      },
      {
        header: 'Client',
        accessorKey: 'Project',
        enableSorting: true,
        cell: (info) => (
          <span>{info.row.original.project || '-'}</span>
        ),
      },
      {
        header: 'Project',
        accessorKey: 'Subcategory',
        enableSorting: true,
        cell: (info) => (
          <span>{info.row.original.subcategory || '-'}</span>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'subprojectcategory',
        enableSorting: true,
        cell: (info) => (
          <span>{info.row.original.subprojectcategory || '-'}</span>
        ),
      },
      {
        header: 'Activity',
        accessorKey: 'Activity',
        enableSorting: true,
        cell: (info) => (
          <span className="text-dark" style={{ wordBreak: 'break-word' }}>
            {info.row.original.activity || '-'}
          </span>
        ),
      },
      {
        header: 'Updated Date',
        accessorKey: 'Updated_date',
        enableSorting: true,
        cell: (info) => (
          <span className="text-dark">{formatUpdatedDateTime(info.row.original)}</span>
        ),
      },
      {
        header: 'Action',
        id: 'action',
        enableSorting: false,
        cell: (info) => (
          <button
            type="button"
            className="activity-table-action-btn"
            title="Edit Activity"
            onClick={() => {
              const id = Number(info.row.original.id || 0);
              handleOpenEditModal(id);
            }}
          >
            <i className="mdi mdi-pencil-outline"></i>
          </button>
        ),
      }
    );

    return cols;
  }, [showAdminField]);

  return (
    <React.Fragment>
      <div className="activity-page-wrapper">
        {/* Filter Controls Row (Exact Match to Screenshot) */}
        <div className="activity-filter-bar">
          {/* Add New Button for Admin */}
          {showAdminField && (
            <div className="activity-filter-item">
              <label className="activity-filter-label">&nbsp;</label>
              <button
                type="button"
                className="btn btn-primary"
                style={{ height: '36px', borderRadius: '4px', fontWeight: 500 }}
                onClick={() => handleOpenEditModal(0)}
              >
                + Add New
              </button>
            </div>
          )}

          {/* 1. Search */}
          <div className="activity-filter-item">
            <label className="activity-filter-label">Search</label>
            <input
              type="text"
              className="activity-filter-input"
              placeholder="Search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* 2. From Date - To Date (Flatpickr Range Picker) */}
          <div className="activity-filter-item">
            <label className="activity-filter-label">From Date - To Date</label>
            <div className="position-relative d-inline-block">
              <Flatpickr
                className="activity-filter-input activity-filter-date-input"
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
                options={{
                  mode: 'range',
                  dateFormat: 'm/d/Y',
                  allowInput: true,
                }}
                value={datePickerValue}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>

          {/* 3. Clear Button (Pill shaped) */}
          <div className="activity-filter-item">
            <label className="activity-filter-label">Clear</label>
            <button
              type="button"
              className="btn-activity-clear-pill"
              title="Clear all filters"
              onClick={handleClearFilters}
            >
              <i className="mdi mdi-close"></i>
            </button>
          </div>

          {/* 4. Print Button (Navy Blue Pill) */}
          <div className="activity-filter-item ms-auto">
            <button
              type="button"
              className="btn-activity-print d-flex align-items-center justify-content-center"
              onClick={handlePrintReport}
              disabled={isPrinting}
              title="Print Active Log Report"
            >
              {isPrinting ? (
                <>
                  <Spinner size="sm" className="me-1" /> Printing...
                </>
              ) : (
                'Print'
              )}
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableContainer
          columns={columns}
          data={filteredData}
          isGlobalFilter={false}
          isAddButton={false}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No activity records found."
          isServerSidePagination={true}
          onServerChange={handleServerChange}
          serverSideTotalRecords={totalRecords || 0}
          serverSideCurrentPage={pageNumber}
          serverSidePageSize={pageSize_Local}
          serverSideTotalPages={totalPages || 1}
        />

        {/* Edit Task Activity Modal Component */}
        <ActivityEditModal
          isOpen={isEditModalOpen}
          toggle={toggleEditModal}
          initialData={formData}
          projectList={projectList}
          subprojectList={subprojectList}
          subprojectCategoryList={subprojectCategoryList}
          employeeList={employeeList}
          showAdminField={showAdminField}
          isLoadingModal={isLoadingModal}
          isSubmittingModal={isSubmittingModal}
          formError={formError}
          onProjectChange={handleProjectChange}
          onSubProjectChange={handleSubProjectChange}
          onSubmitForm={handleSubmitEdit}
        />
      </div>
    </React.Fragment>
  );
};

export default TaskActivityList;

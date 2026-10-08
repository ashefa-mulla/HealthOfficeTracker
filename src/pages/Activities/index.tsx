import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import { TaskActivityItem } from '@/types/activity/activity.types';
import { fetchActivityListWithPagination } from '@/slices/activity/activityThunk';
import {
  setSearchTerm,
  setDateRange,
} from '@/slices/activity/activitySlice';
import { useAuthStore } from '@/store/useAuthStore';
import { getNumericEmployeeId } from '@/helpers/userHelper';
import { formatDateOnly, formatDateTimeDisplay } from '@/helpers/dateHelper';

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

const TaskActivityList: React.FC = () => {
  document.title = 'My Activities | HO Tracker';

  const dispatch = useDispatch<any>();
  const { user, profileInfo } = useAuthStore();
  const empId = getNumericEmployeeId(profileInfo, user);

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

  // Exact Table Columns matching screenshot
  const columns = useMemo<ColumnDef<TaskActivityItem, any>[]>(() => {
    return [
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
          <span>
            {info.row.original.subprojectcategory ||
              '-'}
          </span>
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
              const id = info.row.original.id;
              console.log('Edit activity id:', id);
            }}
          >
            <i className="mdi mdi-pencil-outline"></i>
          </button>
        ),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div className="activity-page-wrapper">
        {/* Filter Controls Row (Exact Match to Screenshot) */}
        <div className="activity-filter-bar">
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

          {/* 3. User */}
          {/* <div className="activity-filter-item">
            <label className="activity-filter-label">User</label>
            <input
              type="text"
              className="activity-filter-input"
              placeholder="Search User"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div> */}

          {/* 4. Client */}
          {/* <div className="activity-filter-item">
            <label className="activity-filter-label">Client</label>
            <input
              type="text"
              className="activity-filter-input"
              placeholder="Search Client"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
            />
          </div> */}

          {/* 5. Clear Button (Pill shaped) */}
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

          {/* 6. Print Button (Navy Blue Pill) */}
          <div className="activity-filter-item ms-auto">
            <button
              type="button"
              className="btn-activity-print"
              onClick={() => window.print()}
              title="Print Activities"
            >
              Print
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
      </div>
    </React.Fragment>
  );
};

export default TaskActivityList;

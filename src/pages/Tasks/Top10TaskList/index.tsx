import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { Top10TaskListItem } from '@/types/top10task/top10task.types';
import {
  fetchTaskListWithPagination,
  fetchTaskListForUser,
  removeTask,
} from '../../../slices/top10task/top10taskThunk';
import {
  setDefaultStatus,
  setSearchQuery,
} from '../../../slices/top10task/top10taskSlice';
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  // Permission flags matching Angular
  const isHideDelete = !isAdmin;
  const isHideEdit = false;

  // Initial and reactive load
  const loadData = useCallback(() => {
    if (empId > 0 || isAdmin) {
      dispatch(
        fetchTaskListWithPagination({
          empId,
          status: defaultStatus,
          pageNumber,
          pageSize: pageSize_Local,
        })
      );
      dispatch(
        fetchTaskListForUser({
          empId,
          status: defaultStatus,
          isAdmin,
        })
      );
    }
  }, [dispatch, empId, defaultStatus, pageNumber, pageSize_Local, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle server-side query changes from TableContainer
  const handleServerChange = (query: any) => {
    if (query.page !== undefined) {
      setPageNumber(query.page);
    }
    if (query.pageSize !== undefined) {
      setPageSize_Local(query.pageSize);
    }
    if (query.search !== undefined) {
      setSearchTerm(query.search);
      setPageNumber(1);
      dispatch(setSearchQuery(query.search));
    }
  };

  // Handle Filter Change ('P' = Pending, 'C' = Completed)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    dispatch(setDefaultStatus(newStatus));
    setPageNumber(1);
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
      loadData();
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
          const status = row.completed || row.Completed || 'Not Started';
          const isDone = status === 'Done' || status === 'Completed';
          const isInProcess = status === 'In Process' || status === 'In Progress';

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
        cell: (info) => formatActualTime(info.row.original.duration || info.row.original.Duration),
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

              {/* Timer button */}
              {!isDone && (
                <Link
                  to={`/timer?taskId=${id}`}
                  className="task-action-icon me-2"
                  title="Timer"
                >
                  <i className="mdi mdi-clock-outline"></i>
                </Link>
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
  }, [sessionType, isHideDelete, isHideEdit]);

  // Source data: use allTasks if available, or list
  const sourceData = allTasks && allTasks.length > 0 ? allTasks : list || [];

  // Filtered data based on search term across all task fields
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) {
      return list || [];
    }

    const term = searchTerm.toLowerCase().trim();
    return sourceData.filter((item: Top10TaskListItem) => {
      const assignedBy = String(item.pointPerson || item.PointPerson || item.accountablePerson || item.AccountablePerson || '').toLowerCase();
      const assignedTo = String(item.secondPerson || item.SecondPerson || item.accountablePerson || item.AccountablePerson || '').toLowerCase();
      const task = String(item.task || item.Task || item.subject || item.Subject || item.priority || item.Priority || '').toLowerCase();
      const project = String(item.project || item.Project || item.projectName || item.ProjectName || '').toLowerCase();
      const subProject = String(item.subProject || item.SubProject || item.subProjectName || item.SubProjectName || '').toLowerCase();
      const category = String(item.subProjectCategory || item.SubProjectCategory || item.categoryName || item.CategoryName || '').toLowerCase();
      const status = String(item.completed || item.Completed || '').toLowerCase();
      const assignDate = formatDateOnly(item.assignDate || item.AssignDate);
      const etaDate = formatDateOnly(item.eta || item.ETA);

      return (
        assignedBy.includes(term) ||
        assignedTo.includes(term) ||
        task.includes(term) ||
        project.includes(term) ||
        subProject.includes(term) ||
        category.includes(term) ||
        status.includes(term) ||
        assignDate.toLowerCase().includes(term) ||
        etaDate.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, sourceData, list]);

  // Paginate filtered data for the current page
  const paginatedData = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) {
      return list || [];
    }
    const start = (pageNumber - 1) * pageSize_Local;
    return filteredData.slice(start, start + pageSize_Local);
  }, [filteredData, searchTerm, pageNumber, pageSize_Local, list]);

  const displayTotalRecords = searchTerm ? filteredData.length : totalRecords;
  const displayTotalPages = searchTerm
    ? Math.ceil(filteredData.length / pageSize_Local) || 1
    : totalPages;

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <TableContainer
          columns={columns}
          data={paginatedData}
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

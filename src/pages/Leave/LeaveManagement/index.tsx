import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnDef, Row } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { LeaveTransactionListItem } from '@/types/leave/leave.types';
import {
  fetchAllEmployeeLeaves,
  fetchLeaveApprovalById,
  saveLeaveApproval,
  saveLeave,
  removeLeave,
  fetchLeaveEmployees,
} from '@/slices/leave/leaveThunk';
import { LeaveApprovalForm, LeaveForm } from '@/types/leave/leave.schema';
import { emptyLeaveForm, toLeaveApprovalForm } from '@/types/leave/leave.mapper';
import { useAuthStore } from '@/store/useAuthStore';
import { isAdminUser } from '@/helpers/userHelper';
import { formatDateOnly, parseSafeDate } from '@/helpers/dateHelper';
import ApplyLeaveModal from '../ApplyLeaveCreate/ApplyLeaveModal';
import LeaveApprovalModal from './LeaveApprovalModal';

type StatusFilter = 'all' | 'pending' | 'approved';

const num = (v: any) => Number(v || 0);
const fromValue = (r: LeaveTransactionListItem) => r.fromDate || r.start_date;
const toValue = (r: LeaveTransactionListItem) => r.toDate || r.end_date;
const timeOf = (v: any) => parseSafeDate(v)?.getTime() ?? 0;

/** Sort the formatted date columns by the real date, not the "MM/DD/YYYY" text */
const byDate =
  (pick: (r: LeaveTransactionListItem) => any) =>
  (a: Row<LeaveTransactionListItem>, b: Row<LeaveTransactionListItem>) =>
    timeOf(pick(a.original)) - timeOf(pick(b.original));

/** Admin: every employee's leaves - edit the day split, approve, add for an employee, delete */
const LeaveManagement: React.FC = () => {
  document.title = 'Leave Management | HO Tracker';

  const dispatch = useDispatch<any>();
  const { profileInfo } = useAuthStore();
  const isAdmin = isAdminUser(profileInfo);

  const { list, loading, saving, employeeList } = useSelector(
    (state: RootState) => (state as any).Leave
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Edit / approve modal
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalSaving, setApprovalSaving] = useState(false);
  const [approvalEmployee, setApprovalEmployee] = useState('');
  const [approvalData, setApprovalData] = useState<LeaveApprovalForm>(toLeaveApprovalForm(null));

  // Add leave (for any employee) modal
  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addData, setAddData] = useState<LeaveForm>(emptyLeaveForm(0));

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const refreshList = useCallback(() => {
    dispatch(fetchAllEmployeeLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (isAdmin) refreshList();
  }, [isAdmin, refreshList]);

  // Newest first; the status filter narrows the rows before the table's own search
  const rows: LeaveTransactionListItem[] = useMemo(() => {
    const all: LeaveTransactionListItem[] = list || [];
    return all
      .filter((r) =>
        statusFilter === 'all' ? true : statusFilter === 'approved' ? !!r.isApprove : !r.isApprove
      )
      .sort((a, b) => timeOf(fromValue(b)) - timeOf(fromValue(a)));
  }, [list, statusFilter]);

  const pendingCount = useMemo(
    () => ((list || []) as LeaveTransactionListItem[]).filter((r) => !r.isApprove).length,
    [list]
  );

  // ---- edit / approve --------------------------------------------------------
  const openApproval = useCallback(
    async (row: LeaveTransactionListItem) => {
      setApprovalEmployee(row.employee || '');
      setApprovalOpen(true);
      try {
        setApprovalLoading(true);
        const data = await dispatch(fetchLeaveApprovalById(Number(row.id))).unwrap();
        setApprovalData(data);
      } catch {
        setApprovalOpen(false);
      } finally {
        setApprovalLoading(false);
      }
    },
    [dispatch]
  );

  const handleSubmitApproval = async (values: LeaveApprovalForm) => {
    try {
      setApprovalSaving(true);
      await dispatch(saveLeaveApproval(values)).unwrap();
      setApprovalOpen(false);
      refreshList();
    } catch {
      // error toast shown by the thunk
    } finally {
      setApprovalSaving(false);
    }
  };

  // ---- add -------------------------------------------------------------------
  const openAdd = () => {
    const companyId = Number(localStorage.getItem('companyid')) || 1;
    dispatch(fetchLeaveEmployees(companyId));
    setAddData(emptyLeaveForm(0));
    setAddOpen(true);
  };

  const handleSubmitAdd = async (values: LeaveForm) => {
    try {
      setAddSaving(true);
      await dispatch(saveLeave({ form: values, id: 0 })).unwrap();
      setAddOpen(false);
      refreshList();
    } catch {
      // error toast shown by the thunk
    } finally {
      setAddSaving(false);
    }
  };

  // ---- delete ----------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeLeave(selectedDeleteId)).unwrap();
      refreshList();
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<LeaveTransactionListItem, any>[]>(
    () => [
      {
        id: 'fromDate',
        header: 'From Date',
        accessorFn: (r) => formatDateOnly(fromValue(r)),
        sortingFn: byDate(fromValue),
        enableColumnFilter: false,
      },
      {
        id: 'toDate',
        header: 'To Date',
        accessorFn: (r) => formatDateOnly(toValue(r)),
        sortingFn: byDate(toValue),
        enableColumnFilter: false,
      },
      {
        header: 'Employee',
        accessorKey: 'employee',
        enableColumnFilter: false,
        cell: (info) => info.row.original.employee || '-',
      },
      {
        header: 'Leaves',
        accessorKey: 'leaves',
        enableColumnFilter: false,
        cell: (info) => num(info.row.original.leaves),
      },
      {
        header: 'Sick Leaves',
        accessorKey: 'sick_Leaves',
        enableColumnFilter: false,
        cell: (info) => num(info.row.original.sick_Leaves),
      },
      {
        header: 'LWP',
        accessorKey: 'lwp',
        enableColumnFilter: false,
        cell: (info) => num(info.row.original.lwp),
      },
      {
        id: 'isApprove',
        header: 'Approve',
        accessorFn: (r) => (r.isApprove ? 'Approved' : 'Pending'),
        enableColumnFilter: false,
        cell: (info) =>
          info.row.original.isApprove ? (
            <span className="badge-status-done">Approved</span>
          ) : (
            <span className="badge-status-not-started">Pending</span>
          ),
      },
      {
        header: 'Action',
        accessorKey: 'id',
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="d-flex align-items-center">
              <button
                type="button"
                onClick={() => openApproval(row)}
                className="task-action-icon me-2"
                title={row.isApprove ? 'Edit' : 'Edit / Approve'}
              >
                <i className="mdi mdi-pencil-outline"></i>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDeleteId(Number(row.id));
                  setDeleteModal(true);
                }}
                className="task-action-icon delete-icon"
                title="Delete"
              >
                <i className="mdi mdi-trash-can-outline"></i>
              </button>
            </div>
          );
        },
      },
    ],
    [openApproval]
  );

  if (!isAdmin) {
    return (
      <div className="task-list-page-container">
        <div className="page-header-box">
          <h1 className="page-title-main">Leave Management</h1>
        </div>
        <p className="text-muted">Only admins can manage employee leaves.</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <div className="page-header-box">
          <div>
            <h1 className="page-title-main">Leave Management</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={rows}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search employee or date..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={openAdd}
          customRightHeader={
            <div className="task-filter-wrapper">
              <label htmlFor="leaveStatusFilterSelect">Filter:</label>
              <select
                id="leaveStatusFilterSelect"
                className="task-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Leaves</option>
                <option value="pending">Pending ({pendingCount})</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          }
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No leave records found."
        />

        {/* Edit / Approve Leave Modal */}
        <LeaveApprovalModal
          isOpen={approvalOpen}
          toggle={() => !approvalSaving && setApprovalOpen(false)}
          employeeName={approvalEmployee}
          initialData={approvalData}
          isLoading={approvalLoading}
          isSaving={approvalSaving}
          onSubmit={handleSubmitApproval}
        />

        {/* Add Leave (admin picks the employee) */}
        <ApplyLeaveModal
          isOpen={addOpen}
          toggle={() => !addSaving && setAddOpen(false)}
          leaveId={0}
          initialData={addData}
          employeeList={employeeList || []}
          isAdmin={true}
          isLoading={false}
          isSaving={addSaving}
          onSubmit={handleSubmitAdd}
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

export default LeaveManagement;

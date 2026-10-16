import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { LeaveTransactionListItem } from '@/types/leave/leave.types';
import {
  fetchLeaveList,
  removeLeave,
  fetchLeaveById,
  saveLeave,
  fetchLeaveEmployees,
} from '@/slices/leave/leaveThunk';
import { LeaveForm } from '@/types/leave/leave.schema';
import { emptyLeaveForm } from '@/types/leave/leave.mapper';
import { useAuthStore } from '@/store/useAuthStore';
import { getNumericEmployeeId, isAdminUser } from '@/helpers/userHelper';
import { formatDateOnly } from '@/helpers/dateHelper';
import ApplyLeaveModal from '../ApplyLeaveCreate/ApplyLeaveModal';

const num = (v: any) => Number(v || 0);

const ApplyLeaveList: React.FC = () => {
  document.title = 'Apply Leave | HO Tracker';

  const dispatch = useDispatch<any>();

  const { user, profileInfo } = useAuthStore();
  const empId = getNumericEmployeeId(profileInfo, user);
  const isAdmin = isAdminUser(profileInfo);

  const { list, loading, saving, employeeList } = useSelector(
    (state: RootState) => (state as any).Leave
  );

  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  // Add / Edit Leave Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLeaveId, setModalLeaveId] = useState<number>(0);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isSavingModal, setIsSavingModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<LeaveForm>(
    emptyLeaveForm(isAdmin ? 0 : empId)
  );

  const refreshList = useCallback(() => {
    if (isAdmin) {
      // empId 0 = all employees (current year)
      dispatch(
        fetchLeaveList({ empId: 0, year: new Date().getFullYear(), currentYear: true })
      );
    } else if (empId > 0) {
      dispatch(fetchLeaveList({ empId }));
    }
  }, [dispatch, empId, isAdmin]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  // Open Leave Modal for Add (id = 0) or Edit (id > 0)
  const handleOpenModal = useCallback(
    async (id: number = 0) => {
      setModalLeaveId(id);
      setIsModalOpen(true);

      const companyId = Number(localStorage.getItem('companyid')) || 1;
      dispatch(fetchLeaveEmployees(companyId));

      if (id > 0) {
        try {
          setIsLoadingModal(true);
          const data = await dispatch(fetchLeaveById(id)).unwrap();
          setFormData(data);
        } catch (err: any) {
          console.error('Failed to load leave details:', err);
          setIsModalOpen(false);
        } finally {
          setIsLoadingModal(false);
        }
      } else {
        setFormData(emptyLeaveForm(isAdmin ? 0 : empId));
        setIsLoadingModal(false);
      }
    },
    [dispatch, isAdmin, empId]
  );

  const toggleModal = () => {
    if (!isSavingModal) {
      setIsModalOpen(false);
    }
  };

  const handleSubmitModal = async (values: LeaveForm) => {
    try {
      setIsSavingModal(true);
      await dispatch(
        saveLeave({ form: values, id: Number(values.id || 0) })
      ).unwrap();
      setIsModalOpen(false);
      refreshList();
    } catch (err: any) {
      console.error('Failed to save leave:', err);
    } finally {
      setIsSavingModal(false);
    }
  };

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
      ...(isAdmin
        ? [
            {
              header: 'Employee',
              accessorKey: 'employee',
              enableColumnFilter: false,
              cell: (info: any) => info.row.original.employee || '-',
            } as ColumnDef<LeaveTransactionListItem, any>,
          ]
        : []),
      {
        header: 'From Date',
        accessorKey: 'fromDate',
        enableColumnFilter: false,
        cell: (info) =>
          formatDateOnly(info.row.original.fromDate || info.row.original.start_date),
      },
      {
        header: 'To Date',
        accessorKey: 'toDate',
        enableColumnFilter: false,
        cell: (info) =>
          formatDateOnly(info.row.original.toDate || info.row.original.end_date),
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
        header: 'Status',
        accessorKey: 'isApprove',
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
          const id = Number(row.id || 0);
          // Approved leaves are locked for the employee; admin can still edit/delete
          if (row.isApprove && !isAdmin) return <span className="text-muted">-</span>;
          return (
            <div className="d-flex align-items-center">
              <button
                type="button"
                onClick={() => handleOpenModal(id)}
                className="task-action-icon me-2"
                title="Edit"
              >
                <i className="mdi mdi-pencil-outline"></i>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDeleteId(id);
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
    [isAdmin, handleOpenModal]
  );

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search leave..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => handleOpenModal(0)}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No leave records found."
        />

        {/* Add / Edit Leave Modal Dialog */}
        <ApplyLeaveModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          leaveId={modalLeaveId}
          initialData={formData}
          employeeList={employeeList || []}
          isAdmin={isAdmin}
          isLoading={isLoadingModal}
          isSaving={isSavingModal}
          onSubmit={handleSubmitModal}
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

export default ApplyLeaveList;

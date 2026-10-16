import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { EmployeeListItem } from '@/types/employee/employee.types';
import {
  fetchEmployeeList,
  removeEmployee,
} from '@/slices/employee/employeeThunk';
import { formatDateOnly } from '@/helpers/dateHelper';
import { getFileUrl } from '@/types/employee/employee.mapper';

const fullName = (e: EmployeeListItem) =>
  [e.firstname, e.middlename, e.lastname].filter(Boolean).join(' ').trim() || '-';

const EmployeeList: React.FC = () => {
  document.title = 'Users | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { list, loading, saving, lookups } = useSelector(
    (state: RootState) => (state as any).Employee
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchEmployeeList());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeEmployee(selectedDeleteId)).unwrap();
      dispatch(fetchEmployeeList());
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<EmployeeListItem, any>[]>(
    () => [
      {
        header: 'Profile',
        accessorKey: 'profileimage',
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const url = getFileUrl(row.profileimage);
          const initials =
            `${(row.firstname || '')[0] || ''}${(row.lastname || '')[0] || ''}`.toUpperCase() || '?';
          return url ? (
            <img
              src={url}
              alt={fullName(row)}
              className="rounded-circle"
              style={{ width: 36, height: 36, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold"
              style={{ width: 36, height: 36, fontSize: 13 }}
            >
              {initials}
            </div>
          );
        },
      },
      {
        header: 'Code',
        accessorKey: 'employerCode',
        enableColumnFilter: false,
        cell: (info) => info.row.original.employerCode || '-',
      },
      {
        header: 'Name',
        id: 'name',
        accessorFn: (row) => fullName(row),
        enableColumnFilter: false,
        cell: (info) => <span style={{ fontWeight: 500 }}>{fullName(info.row.original)}</span>,
      },
      {
        header: 'Joining Date',
        accessorKey: 'joiningDate',
        enableColumnFilter: false,
        cell: (info) => formatDateOnly(info.row.original.joiningDate) || '-',
      },
      {
        header: 'Contact',
        accessorKey: 'primaryContact',
        enableColumnFilter: false,
        cell: (info) => info.row.original.primaryContact || '-',
      },
      {
        header: 'Email',
        accessorKey: 'primaryEmail',
        enableColumnFilter: false,
        cell: (info) => info.row.original.primaryEmail || '-',
      },
      {
        header: 'City',
        id: 'city',
        accessorFn: (row) => lookups?.cities?.[Number(row.cityId)] || '',
        enableColumnFilter: false,
        cell: (info) => info.getValue() || '-',
      },
      {
        header: 'State',
        id: 'state',
        accessorFn: (row) => lookups?.states?.[Number(row.stateId)] || '',
        enableColumnFilter: false,
        cell: (info) => info.getValue() || '-',
      },
      {
        header: 'Active',
        accessorKey: 'active',
        enableColumnFilter: false,
        cell: (info) =>
          info.row.original.active ? (
            <span className="badge-status-done">Yes</span>
          ) : (
            <span className="badge-status-not-started">No</span>
          ),
      },
      {
        header: 'Action',
        accessorKey: 'id',
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const id = Number(info.row.original.id || 0);
          return (
            <div className="d-flex align-items-center">
              <Link
                to={`/area/employee/edit/${id}`}
                className="task-action-icon me-2"
                title="Edit"
              >
                <i className="mdi mdi-pencil-outline"></i>
              </Link>
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
    [lookups]
  );

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <div className="page-header-box">
          <div>
            <h1 className="page-title-main">Team Members</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search team member..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/employee/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No users found."
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

export default EmployeeList;

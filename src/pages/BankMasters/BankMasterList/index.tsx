import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { BankMasterListItem } from '@/types/bankMaster/bankMaster.types';
import {
  fetchBankMasterList,
  removeBankMaster,
} from '@/slices/bankMaster/bankMasterThunk';
import { formatDateOnly } from '@/helpers/dateHelper';

/** The list SP returns the date as text; show it formatted when parseable, otherwise as-is. */
const showDate = (v?: string | null): string => {
  if (!v) return '-';
  const formatted = formatDateOnly(v);
  return formatted === '-' ? String(v) : formatted;
};

const BankMasterList: React.FC = () => {
  document.title = 'Bank Master | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { list, loading, saving } = useSelector(
    (state: RootState) => (state as any).BankMaster
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBankMasterList());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeBankMaster(selectedDeleteId)).unwrap();
      dispatch(fetchBankMasterList());
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<BankMasterListItem, any>[]>(
    () => [
      {
        header: 'Bank Name',
        accessorKey: 'name',
        enableColumnFilter: false,
        cell: (info) => (
          <span style={{ fontWeight: 500 }}>{info.row.original.name || '-'}</span>
        ),
      },
      {
        header: 'Account Number',
        accessorKey: 'accountNo',
        enableColumnFilter: false,
        cell: (info) => {
          const v = info.row.original.accountNo;
          return v === null || v === undefined || v === ''
            ? '-'
            : typeof v === 'number'
              ? v.toLocaleString('fullwide', { useGrouping: false })
              : String(v);
        },
      },
      {
        header: 'Opening Date',
        accessorKey: 'openingDate',
        enableColumnFilter: false,
        cell: (info) => showDate(info.row.original.openingDate),
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
                to={`/area/bankmaster/edit/${id}`}
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
    []
  );

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <div className="page-header-box">
          <div>
            <h1 className="page-title-main">Bank Master</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search bank..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/bankmaster/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No banks found."
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

export default BankMasterList;

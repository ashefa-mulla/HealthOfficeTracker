import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { ChequeRequestListItem } from '@/types/chequeRequest/chequeRequest.types';
import {
  fetchChequeRequestList,
  removeChequeRequest,
} from '@/slices/chequeRequest/chequeRequestThunk';
import { formatDateOnly } from '@/helpers/dateHelper';

/** The list SP returns the date as text; show it formatted when parseable, otherwise as-is. */
const showDate = (v?: string | null): string => {
  if (!v) return '-';
  const formatted = formatDateOnly(v);
  return formatted === '-' ? String(v) : formatted;
};

const showAmount = (v: any): string =>
  v === null || v === undefined || v === ''
    ? '-'
    : Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ChequeRequestList: React.FC = () => {
  document.title = 'Cheque Request | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { list, loading, saving } = useSelector(
    (state: RootState) => (state as any).ChequeRequest
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchChequeRequestList());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeChequeRequest(selectedDeleteId)).unwrap();
      dispatch(fetchChequeRequestList());
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<ChequeRequestListItem, any>[]>(
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
        header: 'Request Date',
        accessorKey: 'requestDate',
        enableColumnFilter: false,
        cell: (info) => showDate(info.row.original.requestDate),
      },
      {
        header: 'PayTo',
        accessorKey: 'payTo',
        enableColumnFilter: false,
        cell: (info) => info.row.original.payTo || '-',
      },
      {
        header: 'Memo',
        accessorKey: 'memo',
        enableColumnFilter: false,
        cell: (info) => info.row.original.memo || '-',
      },
      {
        header: 'Address',
        accessorKey: 'address',
        enableColumnFilter: false,
        cell: (info) => info.row.original.address || '-',
      },
      {
        header: 'Cost Centre',
        accessorKey: 'costCentreName',
        enableColumnFilter: false,
        cell: (info) => info.row.original.costCentreName || '-',
      },
      {
        header: 'Payment Method',
        accessorKey: 'payMethod',
        enableColumnFilter: false,
        cell: (info) => info.row.original.payMethod || '-',
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        enableColumnFilter: false,
        cell: (info) => showAmount(info.row.original.amount),
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
                to={`/area/chequerequest/edit/${id}`}
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
            <h1 className="page-title-main">Cheque Request</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search cheque request..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/chequerequest/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No cheque requests found."
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

export default ChequeRequestList;

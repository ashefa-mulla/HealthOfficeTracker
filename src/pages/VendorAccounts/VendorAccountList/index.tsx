import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { VendorAccountListItem } from '@/types/vendorAccount/vendorAccount.types';
import {
  fetchVendorAccountList,
  removeVendorAccount,
} from '@/slices/vendorAccount/vendorAccountThunk';

const VendorAccountList: React.FC = () => {
  document.title = 'Vendor Account | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { list, loading, saving } = useSelector(
    (state: RootState) => (state as any).VendorAccount
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchVendorAccountList());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeVendorAccount(selectedDeleteId)).unwrap();
      dispatch(fetchVendorAccountList());
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<VendorAccountListItem, any>[]>(
    () => [
      {
        header: 'Vendor Name',
        accessorKey: 'name',
        enableColumnFilter: false,
        cell: (info) => (
          <span style={{ fontWeight: 500 }}>{info.row.original.name || '-'}</span>
        ),
      },
      {
        header: 'Contact',
        accessorKey: 'contact',
        enableColumnFilter: false,
        cell: (info) => {
          const v = info.row.original.contact;
          return v === null || v === undefined || v === ''
            ? '-'
            : Number(v).toLocaleString('fullwide', { useGrouping: false });
        },
      },
      {
        header: 'EmailID',
        accessorKey: 'emailID',
        enableColumnFilter: false,
        cell: (info) => info.row.original.emailID || '-',
      },
      {
        header: 'Category',
        accessorKey: 'categoryName',
        enableColumnFilter: false,
        cell: (info) => info.row.original.categoryName || '-',
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
                to={`/area/vendoraccount/edit/${id}`}
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
            <h1 className="page-title-main">Vendor Account</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search vendor account..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/vendoraccount/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No vendor accounts found."
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

export default VendorAccountList;
